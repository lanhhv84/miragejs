/**
 * @class HasMany
 * @extends Association
 * @constructor
 * @public
 * @hide
 */
export default class HasMany extends Association {
    /**
     * @method getForeignKeyArray
     * @return {Array} Array of camelized model name of associated objects
     * and foreign key for the object owning the association
     * @public
     */
    public getForeignKeyArray(): any[];
    /**
     * @method getForeignKey
     * @return {String} Foreign key for the object owning the association
     * @public
     */
    public getForeignKey(): string;
    /**
     * Registers has-many association defined by given key on given model,
     * defines getters / setters for associated records and associated records' ids,
     * adds methods for creating unsaved child records and creating saved ones
     *
     * @method addMethodsToModelClass
     * @param {Function} ModelClass
     * @param {String} key
     * @public
     */
    public addMethodsToModelClass(ModelClass: Function, key: string): void;
    /**
     *
     *
     * @public
     */
    public disassociateAllDependentsFromTarget(model: any): void;
}
import Association from "./association";
//# sourceMappingURL=has-many.d.ts.map