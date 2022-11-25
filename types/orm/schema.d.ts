declare type Assign<T, U> = U & Omit<T, keyof U>;
export interface ModelDefinition<Data extends {} = {}> {
    prototype: any;
    belongsToAssociations: any[];
    hasManyAssociations: any[];
    extend<NewData>(data?: NewData): ModelDefinition<Assign<Data, NewData>>;
}
declare type AnyModels = Record<string, ModelDefinition>;
declare type DB = Record<string, any>;
declare type InternalCollection<Registry extends AnyRegistry, K extends keyof Registry> = {
    all: () => any;
    new: (attrs: Record<string, any>) => any;
    camelizedModelName: any;
    find: (ids: string[]) => any;
    create: (attrs: Record<string, any>) => any;
    findBy: (attrs: Partial<ExtractModelData<RegistryModel<Registry>, K>>) => ExtractModelData<RegistryModel<Registry>, K> | null;
    findOrCreateBy: (attrs: Record<string, any>) => any;
    where: (attrs: Record<string, any>) => any;
    none: () => any;
    first: () => any;
};
declare type Container = {
    inflector: Record<any, (v: string) => string>;
};
declare type ExtractModelData<Models, K> = K extends keyof Models ? Models[K] extends ModelDefinition<infer Data> ? Data : {} : {};
declare type WithFactoryMethods<T> = {
    [K in keyof T]: T[K] | ((n: number) => T[K]);
};
declare type FlattenFactoryMethods<T> = {
    [K in keyof T]: T[K] extends (n: number) => infer V ? V : T[K];
};
interface FactoryDefinition<Data extends {} = {}> {
    extend<NewData>(data: WithFactoryMethods<NewData>): FactoryDefinition<Assign<Data, FlattenFactoryMethods<NewData>>>;
}
declare type ExtractFactoryData<Factories, K> = K extends keyof Factories ? Factories[K] extends FactoryDefinition<infer Data> ? FlattenFactoryMethods<Data> : {} : {};
declare type Registry<Models extends AnyModels, Factories extends AnyFactories> = {
    [K in keyof Models | keyof Factories]: ExtractModelData<Models, K> & ExtractFactoryData<Factories, K>;
};
declare type AnyFactories = Record<string, FactoryDefinition>;
/** A marker type for easily constraining type parameters that must be shaped like a Registry */
declare type AnyRegistry = Registry<AnyModels, AnyFactories>;
interface SchemaIndexer<Registry extends AnyRegistry> {
    [key: string]: typeof key extends keyof Registry ? InternalCollection<Registry, typeof key> : any;
}
declare type RegistryModel<R extends AnyRegistry> = R extends Registry<infer U, any> ? U : never;
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
export default class Schema<Registry extends AnyRegistry> implements SchemaIndexer<Registry> {
    [key: string]: any;
    _container: Container | undefined;
    private readonly db;
    private readonly collections;
    private readonly _registry;
    private readonly _dependentAssociations;
    private readonly isSaving;
    constructor(db: DB, modelsMap?: {});
    /**
     @method registerModels
     @param hash
     @public
     @hide
     */
    registerModels(hash: AnyModels): void;
    /**
     @method registerModel
     @param type
     @param ModelClass
     @public
     @hide
     */
    registerModel<Model = {}>(type: string, ModelClass: ModelDefinition<Model>): this;
    /**
     @method modelFor
     @param type
     @public
     @hide
     */
    modelFor(type: string): {
        class: any;
        foreignKeys: string[];
    };
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
    new(type: string, attrs: Record<string, unknown>): any;
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
    create(type: string, attrs: Record<string, unknown>): any;
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
    all(type: string): any;
    /**
     Return an empty collection of type `type`.
  
     @method none
     @param type
     @public
     */
    none(type: string): any;
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
    find(type: string, ids: string[]): any;
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
    findBy<K extends keyof Registry & string = string, ElementType = Partial<ExtractModelData<RegistryModel<Registry>, K>>>(type: K, attributesOrPredicate: ElementType | ((instance: ElementType) => boolean)): any;
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
    findOrCreateBy(type: string, attrs: Record<string, unknown>): any;
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
    where(type: string, query: Record<string, unknown>): any;
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
    first(type: string): any;
    /**
     @method modelClassFor
     @param modelName
     @public
     @hide
     */
    modelClassFor(modelName: string): ModelDefinition;
    addDependentAssociation(association: any, modelName: string): void;
    dependentAssociationsFor(modelName: string): any;
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
    associationsFor(modelName: string): any[];
    hasModelForModelName(modelName: string): {
        class: any;
        foreignKeys: string[];
    };
    /**
     @method collectionForType
     @param type
     @private
     @hide
     */
    collectionForType(type: string): any;
    toCollectionName(type: string): string;
    toInternalCollectionName(type: string): string;
    toModelName(type: string): string;
    /**
     @method _addForeignKeyToRegistry
     @param type
     @param fk
     @private
     @hide
     */
    private _addForeignKeyToRegistry;
    /**
     @method _instantiateModel
     @param modelName
     @param attrs
     @private
     @hide
     */
    private _instantiateModel;
    /**
     @method _modelFor
     @param modelName
     @private
     @hide
     */
    private _modelFor;
    /**
     @method _foreignKeysFor
     @param modelName
     @private
     @hide
     */
    private _foreignKeysFor;
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
    private _hydrate;
}
export {};
//# sourceMappingURL=schema.d.ts.map