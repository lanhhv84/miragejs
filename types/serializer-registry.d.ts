/**
 * @hide
 */
export default class SerializerRegistry {
    constructor(schema: any, serializerMap: {} | undefined, server: any);
    schema: any;
    _serializerMap: {};
    normalize(payload: any, modelName: any): any;
    serialize(response: any, request: any): any;
    request: any;
    serializerFor(type: any, { explicit }?: {
        explicit?: boolean | undefined;
    }): any;
    _isModel(object: any): boolean;
    _isCollection(object: any): boolean;
    _isModelOrCollection(object: any): boolean;
    registerSerializers(newSerializerMaps: any): void;
    getCoalescedIds(request: any, modelName: any): any;
}
//# sourceMappingURL=serializer-registry.d.ts.map