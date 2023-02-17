export default Model;
/**
  Models wrap your database, and allow you to define relationships.

  **Class vs. instance methods**

  The methods documented below apply to _instances_ of models, but you'll typically use the `Schema` to access the model _class_, which can be used to find or create instances.

  You can find the Class methods documented under the `Schema` API docs.

  **Accessing properties and relationships**

  You can access properites (fields) and relationships directly off of models.

  ```js
  user.name;    // 'Sam'
  user.team;    // Team model
  user.teamId;  // Team id (foreign key)
  ```

  Mirage Models are schemaless in their attributes, but their relationship schema is known.

  For example,

  ```js
  let user = schema.users.create();
  user.attrs  // { }
  user.name   // undefined

  let user = schema.users.create({ name: 'Sam' });
  user.attrs  // { name: 'Sam' }
  user.name   // 'Sam'
  ```

  However, if a `user` has a `posts` relationships defined,

  ```js
  let user = schema.users.create();
  user.posts  // returns an empty Posts Collection
  ```

  @class Model
  @constructor
  @public
 */
declare class Model {
    constructor(schema: any, modelName: any, attrs: any, fks: any);
    _schema: any;
    modelName: any;
    fks: any;
    /**
      Returns the attributes of your model.

      ```js
      let post = schema.blogPosts.find(1);
      post.attrs; // {id: 1, title: 'Lorem Ipsum', publishedAt: '2012-01-01 10:00:00'}
      ```

      Note that you can also access individual attributes directly off a model, e.g. `post.title`.

      @property attrs
      @public
    */
    public attrs: {};
    /**
      Create or saves the model.
  
      ```js
      let post = blogPosts.new({ title: 'Lorem ipsum' });
      post.id; // null
  
      post.save();
      post.id; // 1
  
      post.title = 'Hipster ipsum'; // db has not been updated
      post.save();                  // ...now the db is updated
      ```
  
      @method save
      @return this
      @public
     */
    public save(): Model;
    /**
      Updates the record in the db.
  
      ```js
      let post = blogPosts.find(1);
      post.update('title', 'Hipster ipsum'); // the db was updated
      post.update({
        title: 'Lorem ipsum',
        created_at: 'before it was cool'
      });
      ```
  
      @method update
      @param {String} key
      @param {String} val
      @return this
      @public
     */
    public update(key: string, val: string): Model;
    /**
      Destroys the db record.
  
      ```js
      let post = blogPosts.find(1);
      post.destroy(); // removed from the db
      ```
  
      @method destroy
      @public
     */
    public destroy(): void;
    /**
      Boolean, true if the model has not been persisted yet to the db.
  
      ```js
      let post = blogPosts.new({title: 'Lorem ipsum'});
      post.isNew(); // true
      post.id;      // null
  
      post.save();  // true
      post.isNew(); // false
      post.id;      // 1
      ```
  
      @method isNew
      @return {Boolean}
      @public
     */
    public isNew(): boolean;
    /**
      Boolean, opposite of `isNew`
  
      @method isSaved
      @return {Boolean}
      @public
     */
    public isSaved(): boolean;
    /**
      Reload a model's data from the database.
  
      ```js
      let post = blogPosts.find(1);
      post.attrs;     // {id: 1, title: 'Lorem ipsum'}
  
      post.title = 'Hipster ipsum';
      post.title;     // 'Hipster ipsum';
  
      post.reload();  // true
      post.title;     // 'Lorem ipsum'
      ```
  
      @method reload
      @return this
      @public
     */
    public reload(): Model;
    _tempAssociations: {} | undefined;
    toJSON(): {};
    /**
      Returns a hash of this model's associations.
  
      ```js
      let server = createServer({
        models: {
          user: Model,
          post: Model.extend({
            user: belongsTo(),
            comments: hasMany()
          }),
          comment: Model
        },
  
        seeds(server) {
          let peter = server.create("user", { name: "Peter" });
          server.create("post", { user: peter });
        }
      });
  
      let post = server.schema.posts.find(1)
      post.associations
  
      // {
      //   user: BelongsToAssociation,
      //   comments: HasManyAssociation
      // }
      ```
  
      Check out the docs on the Association class to see what fields are available for each association.
  
      @method associations
      @type {Object}
      @public
     */
    public get associations(): Object;
    /**
      Returns the association for the given key
  
      @method associationFor
      @param key
      @public
      @hide
     */
    public associationFor(key: any): any;
    /**
      Returns this model's inverse association for the given
      model-type-association pair, if it exists.
  
      Example:
  
           post: Model.extend({
             comments: hasMany()
           }),
           comments: Model.extend({
             post: belongsTo()
           })
  
       post.inversefor(commentsPostAssociation) would return the
       `post.comments` association object.
  
       Originally we had association.inverse() but that became impossible with
       the addition of polymorphic models. Consider the following:
  
           post: Model.extend({
             comments: hasMany()
           }),
           picture: Model.extend({
             comments: hasMany()
           }),
           comments: Model.extend({
             commentable: belongsTo({ polymorphic: true })
           })
  
       `commentable.inverse()` is ambiguous - does it return
       `post.comments` or `picture.comments`? Instead we need to ask each model
       if it has an inverse for a given association. post.inverseFor(commentable)
       is no longer ambiguous.
  
      @method hasInverseFor
      @param {String} modelName The model name of the class we're scanning
      @param {ORM/Association} association
      @return {ORM/Association}
      @public
      @hide
     */
    public inverseFor(association: any): any;
    /**
      Finds the inverse for an association that explicity defines it's inverse
  
      @private
      @hide
    */
    private _explicitInverseFor;
    /**
      Ensures multiple explicit inverses don't exist on the current model
      for the given association.
  
      TODO: move this to compile-time check
  
      @private
      @hide
    */
    private _checkForMultipleExplicitInverses;
    /**
      Finds if there is an inverse for an association that does not
      explicitly define one.
  
      @private
      @hide
    */
    private _implicitInverseFor;
    /**
      Returns whether this model has an inverse association for the given
      model-type-association pair.
  
      @method hasInverseFor
      @param {String} modelName
      @param {ORM/Association} association
      @return {Boolean}
      @public
      @hide
     */
    public hasInverseFor(association: any): boolean;
    /**
      Used to check if models match each other. If models are saved, we check model type
      and id, since they could have other non-persisted properties that are different.
  
      @public
      @hide
    */
    public alreadyAssociatedWith(model: any, association: any): any;
    associate(model: any, association: any): void;
    disassociate(model: any, association: any): void;
    /**
      @hide
    */
    get isSaving(): any;
    /**
      model.attrs represents the persistable attributes, i.e. your db
      table fields.
      @method _setupAttr
      @param attr
      @param value
      @private
      @hide
     */
    private _setupAttr;
    /**
      Define getter/setter for a plain attribute
      @method _definePlainAttribute
      @param attr
      @private
      @hide
     */
    private _definePlainAttribute;
    /**
      Foreign keys get set on attrs directly (to avoid potential recursion), but
      model references use the setter.
     *
      We validate foreign keys during instantiation.
     *
      @method _setupRelationship
      @param attr
      @param value
      @private
      @hide
     */
    private _setupRelationship;
    /**
      @method _validateAttr
      @private
      @hide
     */
    private _validateAttr;
    /**
      Originally we validated this via association.setId method, but it triggered
      recursion. That method is designed for updating an existing model's ID so
      this method is needed during instantiation.
     *
      @method _validateForeignKeyExistsInDatabase
      @private
      @hide
     */
    private _validateForeignKeyExistsInDatabase;
    /**
      Update associated children when saving a collection
     *
      @method _saveAssociations
      @private
      @hide
     */
    private _saveAssociations;
    _saveBelongsToAssociations(): void;
    _saveHasManyAssociations(): void;
    _disassociateFromOldInverses(association: any): void;
    _disassociateFromHasManyInverses(association: any): void;
    _disassociateFromBelongsToInverse(association: any): void;
    _disassociateFromDependents(): void;
    _saveNewAssociates(association: any): void;
    __isSavingNewChildren: boolean | undefined;
    _associateWithNewInverses(association: any): void;
    _associateModelWithInverse(model: any, association: any): void;
    _updateInDb(attrs: any): void;
    _syncTempAssociations(tempAssociate: any): void;
    /**
      Simple string representation of the model and id.
  
      ```js
      let post = blogPosts.find(1);
      post.toString(); // "model:blogPost:1"
      ```
  
      @method toString
      @return {String}
      @public
    */
    public toString(): string;
    /**
      Checks the equality of this model and the passed-in model
     *
      @method equals
      @return boolean
      @public
      @hide
     */
    public equals(model: any): boolean;
}
declare namespace Model {
    export { extend };
    export function findBelongsToAssociation(associationType: any): any;
}
import extend from "../utils/extend";
//# sourceMappingURL=model.d.ts.map