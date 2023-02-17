import Db from "./db";
import Association from "./orm/associations/association";
import RouteHandler from "./route-handler";
import BaseRouteHandler from "./route-handlers/base";
import Serializer from "./serializer";
import SerializerRegistry from "./serializer-registry";
import Schema from "./orm/schema";
declare type StringToString = (value: string) => string;
declare const classes: {
    Db: typeof Db;
    Association: typeof Association;
    RouteHandler: typeof RouteHandler;
    BaseRouteHandler: typeof BaseRouteHandler;
    Serializer: typeof Serializer;
    SerializerRegistry: typeof SerializerRegistry;
    Schema: typeof Schema;
};
/**
 Lightweight DI container for customizable objects that are needed by
 deeply nested classes.

 @class Container
 @hide
 */
declare class Container {
    readonly inflector: Record<string, StringToString>;
    constructor();
    register(key: string, value: StringToString): void;
    create<ClassName extends keyof typeof classes>(className: ClassName, ...args: ConstructorParameters<typeof classes[typeof className]>): Association | Db | RouteHandler | BaseRouteHandler | Serializer | SerializerRegistry | Schema<{
        [x: string]: {};
    }>;
}
export default Container;
//# sourceMappingURL=container.d.ts.map