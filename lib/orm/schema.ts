import assert from "@lib/assert";
import forIn from "lodash.forin";
import { camelize, dasherize } from "@lib/utils/inflector";
import Association from "@lib/orm/associations/association";
import Collection from "@lib/orm/collection";

const collectionNameCache: Record<string, string> = {};
const internalCollectionNameCache: Record<string, string> = {};
const modelNameCache: Record<string, string> = {};

type Assign<T, U> = U & Omit<T, keyof U>;

export interface ModelDefinition<Data extends {} = {}> {
  prototype: any;
  belongsToAssociations: any[];
  hasManyAssociations: any[];

  extend<NewData>(data?: NewData): ModelDefinition<Assign<Data, NewData>>;
}

type AnyModels = Record<string, ModelDefinition>;

type DB = Record<string, any>;

type InternalCollection<
  Registry extends AnyRegistry,
  K extends keyof Registry
> = {
  all: () => any;
  new: (attrs: Record<string, any>) => any;
  camelizedModelName: any;
  find: (ids: string[]) => any;
  create: (attrs: Record<string, any>) => any;
  findBy: (
    attrs: Partial<ExtractModelData<RegistryModel<Registry>, K>>
  ) => ExtractModelData<RegistryModel<Registry>, K> | null;
  findOrCreateBy: (attrs: Record<string, any>) => any;
  where: (attrs: Record<string, any>) => any;
  none: () => any;
  first: () => any;
};

type Container = {
  inflector: Record<any, (v: string) => string>;
};

// Extracts model definition info for the given key, if a corresponding model is defined
type ExtractModelData<Models, K> = K extends keyof Models
  ? Models[K] extends ModelDefinition<infer Data>
    ? Data
    : {}
  : {};

type WithFactoryMethods<T> = {
  [K in keyof T]: T[K] | ((n: number) => T[K]);
};

// Extract factory method return values from a factory definition
type FlattenFactoryMethods<T> = {
  [K in keyof T]: T[K] extends (n: number) => infer V ? V : T[K];
};

// Captures the result of a `Factory.extend()` call
interface FactoryDefinition<Data extends {} = {}> {
  extend<NewData>(
    data: WithFactoryMethods<NewData>
  ): FactoryDefinition<Assign<Data, FlattenFactoryMethods<NewData>>>;
}

// Extracts factory definition info for the given key, if a corresponding factory is defined
type ExtractFactoryData<Factories, K> = K extends keyof Factories
  ? Factories[K] extends FactoryDefinition<infer Data>
    ? FlattenFactoryMethods<Data>
    : {}
  : {};

type Registry<Models extends AnyModels, Factories extends AnyFactories> = {
  [K in keyof Models | keyof Factories]: ExtractModelData<Models, K> &
    ExtractFactoryData<Factories, K>;
};

type AnyFactories = Record<string, FactoryDefinition>;

/** A marker type for easily constraining type parameters that must be shaped like a Registry */
type AnyRegistry = Registry<AnyModels, AnyFactories>;

interface SchemaIndexer<Registry extends AnyRegistry> {
  [key: string]: typeof key extends keyof Registry
    ? InternalCollection<Registry, typeof key>
    : any;
}

type RegistryModel<R extends AnyRegistry> = R extends Registry<infer U, any>
  ? U
  : never;

/**
 The primary use of the `Schema` class is to use it to find Models and Collections via the `Model` class methods.

 The `Schema` is most often accessed via the first parameter to a route handler:

 ```js
 this.get('posts', schema => {
    return schema.posts.where({ isAdmin: false });
  });
 ```

 It is also available from the `.schema` property of a `server` instance:

 ```js
 server.schema.users.create({ name: 'Yehuda' });
 ```

 To work with the Model or Collection returned from one of the methods below, refer to the instance methods in the API docs for the `Model` and `Collection` classes.

 @class Schema
 @constructor
 @public
 */
export default class Schema<Registry extends AnyRegistry>
  implements SchemaIndexer<Registry>
{
  [key: string]: any;

  _container: Container | undefined;
  private readonly db: DB;
  private readonly collections: {
    [K in keyof Registry]?: InternalCollection<Registry, K>;
  } = {};
  private readonly _registry: Record<
    string,
    {
      class: any;
      foreignKeys: string[];
    }
  >;
  private readonly _dependentAssociations: {
    polymorphic: any[];
  } & Record<string, any>;
  private readonly isSaving: Record<string, boolean>;

  constructor(db: DB, modelsMap = {}) {
    assert(db, "A schema requires a db");

    /**
     Returns Mirage's database. See the `Db` docs for the db's API.

     @property db
     @type {Object}
     @public
     */
    this.db = db;
    this._registry = {};
    this._dependentAssociations = { polymorphic: [] };
    this.registerModels(modelsMap);
    this.isSaving = {}; // a hash of models that are being saved, used to avoid cycles
  }

  /**
   @method registerModels
   @param hash
   @public
   @hide
   */
  registerModels(hash: AnyModels) {
    forIn(hash, (model, key) => {
      this.registerModel(key, hash[key]);
    });
  }

  /**
   @method registerModel
   @param type
   @param ModelClass
   @public
   @hide
   */
  registerModel<Model = {}>(type: string, ModelClass: ModelDefinition<Model>) {
    const camelizedModelName = camelize(type) as string; // FIXME
    const modelName = dasherize(camelizedModelName);

    // Avoid mutating original class, because we may want to reuse it across many tests
    ModelClass = ModelClass.extend();

    // Store model & fks in registry
    // TODO: don't think this is needed anymore
    this._registry[camelizedModelName] = this._registry[camelizedModelName] || {
      class: null,
      foreignKeys: [],
    }; // we may have created this key before, if another model added fks to it
    this._registry[camelizedModelName].class = ModelClass;

    // TODO: set here, remove from model#constructor
    ModelClass.prototype._schema = this;
    ModelClass.prototype.modelName = modelName;
    // Set up associations
    ModelClass.prototype.hasManyAssociations = {}; // a registry of the model's hasMany associations. Key is key from model definition, value is association instance itself
    ModelClass.prototype.hasManyAssociationFks = {}; // a lookup table to get the hasMany association by foreignKey
    ModelClass.prototype.belongsToAssociations = {}; // a registry of the model's belongsTo associations. Key is key from model definition, value is association instance itself
    ModelClass.prototype.belongsToAssociationFks = {}; // a lookup table to get the belongsTo association by foreignKey
    ModelClass.prototype.associationKeys = new Set(); // ex: address.user, user.addresses
    ModelClass.prototype.associationIdKeys = new Set(); // ex: address.user_id, user.address_ids
    ModelClass.prototype.dependentAssociations = []; // a registry of associations that depend on this model, needed for deletion cleanup.

    const fksAddedFromThisModel: Record<string, any> = {};
    for (const associationProperty in ModelClass.prototype) {
      if (ModelClass.prototype[associationProperty] instanceof Association) {
        const association = ModelClass.prototype[associationProperty];
        association.name = associationProperty;
        association.modelName =
          association.modelName || this.toModelName(associationProperty);
        association.ownerModelName = modelName;
        association.setSchema(this);

        // Update the registry with this association's foreign keys. This is
        // essentially our "db migration", since we must know about the fks.
        const [fkHolder, fk] = association.getForeignKeyArray();

        fksAddedFromThisModel[fkHolder] = fksAddedFromThisModel[fkHolder] || [];
        assert(
          !fksAddedFromThisModel[fkHolder].includes(fk),
          `Your '${type}' model definition has multiple possible inverse relationships of type '${fkHolder}'. Please use explicit inverses.`
        );
        fksAddedFromThisModel[fkHolder].push(fk);

        this._addForeignKeyToRegistry(fkHolder, fk);

        // Augment the Model's class with any methods added by this association
        association.addMethodsToModelClass(ModelClass, associationProperty);
      }
    }

    // Create a db collection for this model, if doesn't exist
    const collection = this.toCollectionName(modelName);
    if (!this.db[collection]) {
      this.db.createCollection(collection);
    }

    // Create the entity methods
    const internalCollection: InternalCollection<
      Registry,
      typeof camelizedModelName
    > = {
      camelizedModelName,
      new: (attrs) => this.new(camelizedModelName, attrs),
      create: (attrs) => this.create(camelizedModelName, attrs),
      all: () => this.all(camelizedModelName),
      find: (ids) => this.find(camelizedModelName, ids),
      findBy: (attrs) => this.findBy(camelizedModelName, attrs),
      findOrCreateBy: (attrs) => this.findOrCreateBy(camelizedModelName, attrs),
      where: (attrs) => this.where(camelizedModelName, attrs),
      none: () => this.none(camelizedModelName),
      first: () => this.first(camelizedModelName),
    };

    this[collection] = internalCollection;

    return this;
  }

  /**
   @method modelFor
   @param type
   @public
   @hide
   */
  modelFor(type: string) {
    return this._registry[type];
  }

  /**
   Create a new unsaved model instance with attributes *attrs*.

   ```js
   let post = blogPosts.new({ title: 'Lorem ipsum' });
   post.title;   // Lorem ipsum
   post.id;      // null
   post.isNew(); // true
   ```

   @method new
   @param type
   @param attrs
   @public
   */
  new(type: string, attrs: Record<string, unknown>) {
    return this._instantiateModel(dasherize(type), attrs);
  }

  /**
   Create a new model instance with attributes *attrs*, and insert it into the database.

   ```js
   let post = blogPosts.create({title: 'Lorem ipsum'});
   post.title;   // Lorem ipsum
   post.id;      // 1
   post.isNew(); // false
   ```

   @method create
   @param type
   @param attrs
   @public
   */
  create(type: string, attrs: Record<string, unknown>) {
    return this.new(type, attrs).save();
  }

  /**
   Return all models in the database.

   ```js
   let posts = blogPosts.all();
   // [post:1, post:2, ...]
   ```

   @method all
   @param type
   @public
   */
  all(type: string) {
    const collection = this.collectionForType(type);

    return this._hydrate(collection, dasherize(type));
  }

  /**
   Return an empty collection of type `type`.

   @method none
   @param type
   @public
   */
  none(type: string) {
    return this._hydrate([], dasherize(type));
  }

  /**
   Return one or many models in the database by id.

   ```js
   let post = blogPosts.find(1);
   let posts = blogPosts.find([1, 3, 4]);
   ```

   @method find
   @param type
   @param ids
   @public
   */
  find(type: string, ids: string[]) {
    const collection = this.collectionForType(type);
    const records = collection.find(ids);

    if (Array.isArray(ids)) {
      assert(
        records.length === ids.length,
        `Couldn't find all ${this._container!.inflector.pluralize(
          type
        )} with ids: (${ids.join(",")}) (found ${
          records.length
        } results, but was looking for ${ids.length})`
      );
    }

    return this._hydrate(records, dasherize(type));
  }

  /**
   Returns the first model in the database that matches the key-value pairs in `attrs`. Note that a string comparison is used.

   ```js
   let post = blogPosts.findBy({ published: true });
   let post = blogPosts.findBy({ authorId: 1, published: false });
   let post = blogPosts.findBy({ author: janeSmith, featured: true });
   ```

   This will return `null` if the schema doesn't have any matching record.

   A predicate function can also be used to find a match.

   ```js
   let longPost = blogPosts.findBy((post) => post.body.length > 1000);
   ```

   @method findBy
   @param type
   @param attributesOrPredicate
   @public
   */
  findBy<
    K extends keyof Registry & string = string,
    ElementType = Partial<ExtractModelData<RegistryModel<Registry>, K>>
  >(
    type: K,
    attributesOrPredicate: ElementType | ((instance: ElementType) => boolean)
  ) {
    const collection = this.collectionForType(type);
    const record = collection.findBy(attributesOrPredicate);

    return this._hydrate(record, dasherize(type));
  }

  /**
   Returns the first model in the database that matches the key-value pairs in `attrs`, or creates a record with the attributes if one is not found.

   ```js
   // Find the first published blog post, or create a new one.
   let post = blogPosts.findOrCreateBy({ published: true });
   ```

   @method findOrCreateBy
   @param type
   @param attrs
   @public
   */
  findOrCreateBy(type: string, attrs: Record<string, unknown>) {
    const collection = this.collectionForType(type);
    const record = collection.findBy(attrs);
    let model;

    if (!record) {
      model = this.create(type, attrs);
    } else {
      model = this._hydrate(record, dasherize(type));
    }

    return model;
  }

  /**
   Return an ORM/Collection, which represents an array of models from the database matching `query`.

   If `query` is an object, its key-value pairs will be compared against records using string comparison.

   `query` can also be a compare function.

   ```js
   let posts = blogPosts.where({ published: true });
   let posts = blogPosts.where(post => post.published === true);
   ```

   @method where
   @param type
   @param query
   @public
   */
  where(type: string, query: Record<string, unknown>) {
    const collection = this.collectionForType(type);
    const records = collection.where(query);

    return this._hydrate(records, dasherize(type));
  }

  /**
   Returns the first model in the database.

   ```js
   let post = blogPosts.first();
   ```

   N.B. This will return `null` if the schema doesn't contain any records.

   @method first
   @param type
   @public
   */
  first(type: string) {
    const collection = this.collectionForType(type);
    const record = collection[0];

    return this._hydrate(record, dasherize(type));
  }

  /**
   @method modelClassFor
   @param modelName
   @public
   @hide
   */
  modelClassFor(modelName: string): ModelDefinition {
    const model = this._registry[camelize(modelName)];

    assert(model, `Model not registered: ${modelName}`);

    return model.class.prototype;
  }

  /*
    This method updates the dependentAssociations registry, which is used to
    keep track of which models depend on a given association. It's used when
    deleting models - their dependents need to be looked up and foreign keys
    updated.

    For example,

        schema = {
          post: Model.extend(),
          comment: Model.extend({
            post: belongsTo()
          })
        };

        comment1.post = post1;
        ...
        post1.destroy()

    Deleting this post should clear out comment1's foreign key.

    Polymorphic associations can have _any_ other model as a dependent, so we
    handle them separately.
  */
  addDependentAssociation(association: any, modelName: string) {
    if (association.isPolymorphic) {
      this._dependentAssociations.polymorphic.push(association);
    } else {
      this._dependentAssociations[modelName] =
        this._dependentAssociations[modelName] || [];
      this._dependentAssociations[modelName].push(association);
    }
  }

  dependentAssociationsFor(modelName: string) {
    const directDependents = this._dependentAssociations[modelName] || [];
    const polymorphicAssociations =
      this._dependentAssociations.polymorphic || [];

    return directDependents.concat(polymorphicAssociations);
  }

  /**
   Returns an object containing the associations registered for the model of the given _modelName_.

   For example, given this configuration

   ```js
   import { createServer, Model, hasMany, belongsTo } from 'miragejs'

   let server = createServer({
      models: {
        user: Model,
        article: Model.extend({
          fineAuthor: belongsTo("user"),
          comments: hasMany()
        }),
        comment: Model
      }
    })
   ```

   each of the following would return empty objects

   ```js
   server.schema.associationsFor('user')
   // {}
   server.schema.associationsFor('comment')
   // {}
   ```

   but the associations for the `article` would return

   ```js
   server.schema.associationsFor('article')

   // {
    //   fineAuthor: BelongsToAssociation,
    //   comments: HasManyAssociation
    // }
   ```

   Check out the docs on the Association class to see what fields are available for each association.

   @method associationsFor
   @param {String} modelName
   @return {Object}
   @public
   */
  associationsFor(modelName: string) {
    const modelClass = this.modelClassFor(modelName);

    return Object.assign(
      {},
      modelClass.belongsToAssociations,
      modelClass.hasManyAssociations
    );
  }

  hasModelForModelName(modelName: string) {
    return this.modelFor(camelize(modelName));
  }

  /*
  Private methods
  */

  /**
   @method collectionForType
   @param type
   @private
   @hide
   */
  collectionForType(type: string) {
    const collection = this.toCollectionName(type);
    assert(
      this.db[collection],
      `You're trying to find model(s) of type ${type} but this collection doesn't exist in the database.`
    );

    return this.db[collection];
  }

  toCollectionName(type: string): string {
    if (!this._container) {
      throw new Error("container is undefined");
    }
    if (typeof collectionNameCache[type] !== "string") {
      const modelName = dasherize(type);

      collectionNameCache[type] = camelize(
        this._container.inflector.pluralize(modelName)
      );
    }

    return collectionNameCache[type];
  }

  // This is to get at the underlying Db collection. Poorly named... need to
  // refactor to DbTable or something.
  toInternalCollectionName(type: string) {
    if (typeof internalCollectionNameCache[type] !== "string") {
      internalCollectionNameCache[type] = `_${this.toCollectionName(type)}`;
    }

    return internalCollectionNameCache[type];
  }

  toModelName(type: string): string {
    if (!this._container) {
      throw new Error("container is undefined");
    }
    if (typeof modelNameCache[type] !== "string") {
      const dasherized = dasherize(type);

      modelNameCache[type] = this._container.inflector.singularize(dasherized);
    }

    return modelNameCache[type];
  }

  /**
   @method _addForeignKeyToRegistry
   @param type
   @param fk
   @private
   @hide
   */
  private _addForeignKeyToRegistry(type: string, fk: string) {
    this._registry[type] = this._registry[type] || {
      class: null,
      foreignKeys: [],
    };

    const fks = this._registry[type].foreignKeys;
    if (!fks.includes(fk)) {
      fks.push(fk);
    }
  }

  /**
   @method _instantiateModel
   @param modelName
   @param attrs
   @private
   @hide
   */
  private _instantiateModel(modelName: string, attrs: Record<string, any>) {
    const ModelClass = this._modelFor(modelName);
    const fks = this._foreignKeysFor(modelName);

    return new ModelClass(this, modelName, attrs, fks);
  }

  /**
   @method _modelFor
   @param modelName
   @private
   @hide
   */
  private _modelFor(modelName: string) {
    return this._registry[camelize(modelName)].class;
  }

  /**
   @method _foreignKeysFor
   @param modelName
   @private
   @hide
   */
  private _foreignKeysFor(modelName: string) {
    return this._registry[camelize(modelName)].foreignKeys;
  }

  /**
   Takes a record and returns a model, or an array of records
   and returns a collection.
   *
   @method _hydrate
   @param records
   @param modelName
   @private
   @hide
   */
  private _hydrate(records: any[], modelName: string) {
    if (Array.isArray(records)) {
      const models = records.map((record) => {
        return this._instantiateModel(modelName, record);
      }, this);
      return new Collection(modelName, models);
    } else if (records) {
      return this._instantiateModel(modelName, records);
    } else {
      return null;
    }
  }
}
