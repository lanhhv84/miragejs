export default DbCollection;
/**
  Mirage's `Db` has many `DbCollections`, which are equivalent to tables from traditional databases. They store specific types of data, for example `users` and `posts`.

  `DbCollections` have names, like `users`, which you use to access the collection from the `Db` object.

  Suppose you had a `user` model defined, and the following data had been inserted into your database (either through factories or fixtures):

  ```js
  export default [
    { id: 1, name: 'Zelda' },
    { id: 2, name: 'Link' }
  ];
  ```

  Then `db.contacts` would return this array.

  @class DbCollection
  @constructor
  @public
 */
declare class DbCollection {
    constructor(name: any, initialData: any, IdentityManager: any);
    name: any;
    _records: any[];
    identityManager: any;
    /**
     * Returns a copy of the data, to prevent inadvertent data manipulation.
     * @method all
     * @public
     * @hide
     */
    public all(): any;
    /**
      Inserts `data` into the collection. `data` can be a single object
      or an array of objects. Returns the inserted record.
  
      ```js
      // Insert a single record
      let link = db.users.insert({ name: 'Link', age: 173 });
  
      link;  // { id: 1, name: 'Link', age: 173 }
  
      // Insert an array
      let users = db.users.insert([
        { name: 'Zelda', age: 142 },
        { name: 'Epona', age: 58 },
      ]);
  
      users;  // [ { id: 2, name: 'Zelda', age: 142 }, { id: 3, name: 'Epona', age: 58 } ]
      ```
  
      @method insert
      @param data
      @public
     */
    public insert(data: any): any;
    /**
      Returns a single record from the `collection` if `ids` is a single
      id, or an array of records if `ids` is an array of ids. Note
      each id can be an int or a string, but integer ids as strings
      (e.g. the string “1”) will be treated as integers.
  
      ```js
      // Given users = [{id: 1, name: 'Link'}, {id: 2, name: 'Zelda'}]
  
      db.users.find(1);      // {id: 1, name: 'Link'}
      db.users.find([1, 2]); // [{id: 1, name: 'Link'}, {id: 2, name: 'Zelda'}]
      ```
  
      @method find
      @param ids
      @public
     */
    public find(ids: any): any;
    /**
      Returns the first model from `collection` that matches the
      key-value pairs in the `query` object. Note that a string
      comparison is used. `query` is a POJO.
  
      ```js
      // Given users = [ { id: 1, name: 'Link' }, { id: 2, name: 'Zelda' } ]
      db.users.findBy({ name: 'Link' }); // { id: 1, name: 'Link' }
      ```
  
      @method find
      @param query
      @public
     */
    public findBy(query: any): any;
    /**
      Returns an array of models from `collection` that match the
      key-value pairs in the `query` object. Note that a string
      comparison is used. `query` is a POJO.
  
      ```js
      // Given users = [ { id: 1, name: 'Link' }, { id: 2, name: 'Zelda' } ]
  
      db.users.where({ name: 'Zelda' }); // [ { id: 2, name: 'Zelda' } ]
      ```
  
      @method where
      @param query
      @public
     */
    public where(query: any): any[];
    /**
      Finds the first record matching the provided _query_ in
      `collection`, or creates a new record using a merge of the
      `query` and optional `attributesForCreate`.
  
      Often times you may have a pattern like the following in your API stub:
  
      ```js
      // Given users = [
      //   { id: 1, name: 'Link' },
      //   { id: 2, name: 'Zelda' }
      // ]
  
      // Create Link if he doesn't yet exist
      let records = db.users.where({ name: 'Link' });
      let record;
  
      if (records.length > 0) {
        record = records[0];
      } else {
        record = db.users.insert({ name: 'Link' });
      }
      ```
  
      You can now replace this with the following:
  
      ```js
      let record = db.users.firstOrCreate({ name: 'Link' });
      ```
  
      An extended example using *attributesForCreate*:
  
      ```js
      let record = db.users.firstOrCreate({ name: 'Link' }, { evil: false });
      ```
  
      @method firstOrCreate
      @param query
      @param attributesForCreate
      @public
     */
    public firstOrCreate(query: any, attributesForCreate?: {}): any;
    /**
      Updates one or more records in the collection.
  
      If *attrs* is the only arg present, updates all records in the collection according to the key-value pairs in *attrs*.
  
      If *target* is present, restricts updates to those that match *target*. If *target* is a number or string, finds a single record whose id is *target* to update. If *target* is a POJO, queries *collection* for records that match the key-value pairs in *target*, and updates their *attrs*.
  
      Returns the updated record or records.
  
      ```js
      // Given users = [
      //   {id: 1, name: 'Link'},
      //   {id: 2, name: 'Zelda'}
      // ]
  
      db.users.update({name: 'Ganon'}); // db.users = [{id: 1, name: 'Ganon'}, {id: 2, name: 'Ganon'}]
      db.users.update(1, {name: 'Young Link'}); // db.users = [{id: 1, name: 'Young Link'}, {id: 2, name: 'Zelda'}]
      db.users.update({name: 'Link'}, {name: 'Epona'}); // db.users = [{id: 1, name: 'Epona'}, {id: 2, name: 'Zelda'}]
      ```
  
      @method update
      @param target
      @param attrs
      @public
     */
    public update(target: any, attrs: any): any;
    /**
      Removes one or more records in *collection*.
  
      If *target* is undefined, removes all records. If *target* is a number or string, removes a single record using *target* as id. If *target* is a POJO, queries *collection* for records that match the key-value pairs in *target*, and removes them from the collection.
  
      ```js
      // Given users = [
      //   {id: 1, name: 'Link'},
      //   {id: 2, name: 'Zelda'}
      // ]
  
      db.users.remove(); // db.users = []
      db.users.remove(1); // db.users = [{id: 2, name: 'Zelda'}]
      db.users.remove({name: 'Zelda'}); // db.users = [{id: 1, name: 'Link'}]
      ```
  
      @method remove
      @param target
      @public
     */
    public remove(target: any): void;
    /**
      @method _findRecord
      @param id
      @private
      @hide
     */
    private _findRecord;
    /**
      @method _findRecordBy
      @param query
      @private
      @hide
     */
    private _findRecordBy;
    /**
      @method _findRecords
      @param ids
      @private
      @hide
     */
    private _findRecords;
    /**
      @method _findRecordsWhere
      @param query
      @private
      @hide
     */
    private _findRecordsWhere;
    /**
      @method _insertRecord
      @param data
      @private
      @hide
     */
    private _insertRecord;
    /**
      @method _updateRecord
      @param record
      @param attrs
      @private
      @hide
     */
    private _updateRecord;
}
//# sourceMappingURL=db-collection.d.ts.map