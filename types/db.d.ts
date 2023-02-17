export default Db;
/**
  Your Mirage server has a database which you can interact with in your route handlers. You’ll typically use models to interact with your database data, but you can always reach into the db directly in the event you want more control.

  Access the db from your route handlers via `schema.db`.

  You can access individual DbCollections by using `schema.db.name`:

  ```js
  schema.db.users  // would return, e.g., [ { id: 1, name: 'Yehuda' }, { id: 2, name: 'Tom '} ]
  ```

  @class Db
  @constructor
  @public
 */
declare class Db {
    constructor(initialData: any, identityManagers: any);
    _collections: any[];
    /**
      Loads an object of data into Mirage's database.
  
      The keys of the object correspond to the DbCollections, and the values are arrays of records.
  
      ```js
      server.db.loadData({
        users: [
          { name: 'Yehuda' },
          { name: 'Tom' }
        ]
      });
      ```
  
      As with `db.collection.insert`, IDs will automatically be created for records that don't have them.
  
      @method loadData
      @param {Object} data - Data to load
      @public
     */
    public loadData(data: Object): void;
    /**
     Logs out the contents of the Db.
  
     ```js
     server.db.dump() // { users: [ name: 'Yehuda', ...
     ```
  
     @method dump
     @public
     */
    public dump(): any;
    /**
      Add an empty collection named _name_ to your database. Typically you won’t need to do this yourself, since collections are automatically created for any models you have defined.
  
      @method createCollection
      @param name
      @param initialData (optional)
      @public
     */
    public createCollection(name: any, initialData: any): Db;
    /**
      @method createCollections
      @param ...collections
      @public
      @hide
     */
    public createCollections(...collections: any[]): void;
    /**
      Removes all data from Mirage's database.
  
      @method emptyData
      @public
     */
    public emptyData(): void;
    /**
      @method identityManagerFor
      @param name
      @public
      @hide
     */
    public identityManagerFor(name: any): any;
    /**
      @method registerIdentityManagers
      @public
      @hide
     */
    public registerIdentityManagers(identityManagers: any): void;
    _identityManagers: any;
}
//# sourceMappingURL=db.d.ts.map