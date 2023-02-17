/**
  @hide
*/
export default class BaseRouteHandler {
    getModelClassFromPath(fullPath: any): any;
    _getIdForRequest(request: any, jsonApiDoc: any): any;
    _getJsonApiDocForRequest(request: any, modelName: any): any;
    _getAttrsForRequest(request: any, modelName: any): {
        id: any;
    };
    _getAttrsForFormRequest({ requestBody }: {
        requestBody: any;
    }): any;
}
//# sourceMappingURL=base.d.ts.map