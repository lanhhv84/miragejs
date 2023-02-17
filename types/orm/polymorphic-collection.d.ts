/**
 * An array of models, returned from one of the schema query
 * methods (all, find, where). Knows how to update and destroy its models.
 *
 * Identical to Collection except it can contain a heterogeneous array of
 * models. Thus, it has no `modelName` property. This lets serializers and
 * other parts of the system interact with it differently.
 *
 * @class PolymorphicCollection
 * @constructor
 * @public
 * @hide
 */
export default class PolymorphicCollection {
    constructor(models?: any[]);
    models: any[];
    /**
     * Number of models in the collection.
     *
     * @property length
     * @type Number
     * @public
     */
    public get length(): number;
    /**
     * Updates each model in the collection (persisting immediately to the db).
     * @method update
     * @param key
     * @param val
     * @return this
     * @public
     */
    public update(...args: any[]): PolymorphicCollection;
    /**
     * Destroys the db record for all models in the collection.
     * @method destroy
     * @return this
     * @public
     */
    public destroy(): PolymorphicCollection;
    /**
     * Saves all models in the collection.
     * @method save
     * @return this
     * @public
     */
    public save(): PolymorphicCollection;
    /**
     * Reloads each model in the collection.
     * @method reload
     * @return this
     * @public
     */
    public reload(): PolymorphicCollection;
    /**
     * Adds a model to this collection
     *
     * @method add
     * @return this
     * @public
     */
    public add(model: any): PolymorphicCollection;
    /**
     * Removes a model to this collection
     *
     * @method remove
     * @return this
     * @public
     */
    public remove(model: any): PolymorphicCollection;
    /**
     * Checks if the collection includes the model
     *
     * @method includes
     * @return boolean
     * @public
     */
    public includes(model: any): boolean;
    /**
     * @method filter
     * @param f
     * @return {Collection}
     * @public
     */
    public filter(f: any): any;
    /**
     * @method sort
     * @param f
     * @return {Collection}
     * @public
     */
    public sort(f: any): any;
    /**
     * @method slice
     * @param {Integer} begin
     * @param {Integer} end
     * @return {Collection}
     * @public
     */
    public slice(...args: any[]): any;
    /**
     * @method mergeCollection
     * @param collection
     * @return this
     * @public
     */
    public mergeCollection(collection: any): PolymorphicCollection;
    /**
     * Simple string representation of the collection and id.
     * @method toString
     * @return {String}
     * @public
     */
    public toString(): string;
}
//# sourceMappingURL=polymorphic-collection.d.ts.map