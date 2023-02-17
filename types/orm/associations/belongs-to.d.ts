/**
 * The belongsTo association adds a fk to the owner of the association
 *
 * @class BelongsTo
 * @extends Association
 * @constructor
 * @public
 * @hide
 */
export default class BelongsTo extends Association {
    /**
     * @method getForeignKeyArray
     * @return {Array} Array of camelized name of the model owning the association
     * and foreign key for the association
     * @public
     */
    public getForeignKeyArray(): any[];
    /**
     * @method getForeignKey
     * @return {String} Foreign key for the association
     * @public
     */
    public getForeignKey(): string;
    /**
     * Registers belongs-to association defined by given key on given model,
     * defines getters / setters for associated parent and associated parent's id,
     * adds methods for creating unsaved parent record and creating a saved one
     *
     * @method addMethodsToModelClass
     * @param {Function} ModelClass
     * @param {String} key the named key for the association
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
//# sourceMappingURL=belongs-to.d.ts.map