/**
 * @hide
 */
export default class FunctionRouteHandler extends BaseRouteHandler {
    constructor(schema: any, serializerOrRegistry: any, userFunction: any, path: any, server: any);
    schema: any;
    serializerOrRegistry: any;
    userFunction: any;
    path: any;
    handle(request: any): any;
    setRequest(request: any): void;
    request: any;
    serialize(response: any, serializerType: any): any;
    normalizedRequestAttrs(modelName?: null): any;
}
import BaseRouteHandler from "./base";
//# sourceMappingURL=function.d.ts.map