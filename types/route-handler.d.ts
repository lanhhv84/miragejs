/**
 * @hide
 */
export default class RouteHandler {
    constructor({ schema, verb, rawHandler, customizedCode, options, path, serializerOrRegistry, }: {
        schema: any;
        verb: any;
        rawHandler: any;
        customizedCode: any;
        options: any;
        path: any;
        serializerOrRegistry: any;
    });
    verb: any;
    customizedCode: any;
    serializerOrRegistry: any;
    handler: FunctionHandler | ObjectHandler | GetShorthandHandler | PostShorthandHandler | PutShorthandHandler | DeleteShorthandHandler | HeadShorthandHandler | undefined;
    handle(request: any): Promise<any>;
    _getMirageResponseForRequest(request: any): Promise<any>;
    _toMirageResponse(result: any): Promise<any>;
    _getCodeForResponse(response: any): any;
    serialize(mirageResponse: any, request: any): any;
}
import FunctionHandler from "./route-handlers/function";
import ObjectHandler from "./route-handlers/object";
import GetShorthandHandler from "./route-handlers/shorthands/get";
import PostShorthandHandler from "./route-handlers/shorthands/post";
import PutShorthandHandler from "./route-handlers/shorthands/put";
import DeleteShorthandHandler from "./route-handlers/shorthands/delete";
import HeadShorthandHandler from "./route-handlers/shorthands/head";
//# sourceMappingURL=route-handler.d.ts.map