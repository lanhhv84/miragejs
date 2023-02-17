export default IdentityManager;
/**
  By default Mirage uses autoincrementing numbers starting with `1` as IDs for records. This can be customized by implementing one or more IdentityManagers for your application.

  An IdentityManager is a class that's responsible for generating unique identifiers. You can define a custom identity manager for your entire application, as well as on a per-model basis.

  A custom IdentityManager must implement these methods:

  - `fetch`, which must return an identifier not yet used
  - `set`, which is called with an `id` of a record being insert into Mirage's database
  - `reset`, which should reset database to initial state

  Check out the advanced guide on Mocking UUIDs to see a complete example of a custom IdentityManager.

  @class IdentityManager
  @constructor
  @public
*/
declare class IdentityManager {
    _nextId: number;
    _ids: {};
    /**
      @method get
      @hide
      @private
    */
    private get;
    /**
      Registers `uniqueIdentifier` as used.
  
      This method should throw is `uniqueIdentifier` has already been taken.
  
      @method set
      @param {String|Number} uniqueIdentifier
      @public
    */
    public set(uniqueIdentifier: string | number): void;
    /**
      @method inc
      @hide
      @private
    */
    private inc;
    /**
      Returns the next unique identifier.
  
      @method fetch
      @return {String} Unique identifier
      @public
    */
    public fetch(): string;
    /**
      Resets the identity manager, marking all unique identifiers as available.
  
      @method reset
      @public
    */
    public reset(): void;
}
//# sourceMappingURL=identity-manager.d.ts.map