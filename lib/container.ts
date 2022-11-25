import { pluralize, singularize } from "inflected";
import Db from "./db";
import Association from "./orm/associations/association";
import RouteHandler from "./route-handler";
import BaseRouteHandler from "./route-handlers/base";
import Serializer from "./serializer";
import SerializerRegistry from "./serializer-registry";
import Schema from "./orm/schema";

const defaultInflector = { singularize, pluralize };

type StringToString = (value: string) => string;

const classes = {
  Db,
  Association,
  RouteHandler,
  BaseRouteHandler,
  Serializer,
  SerializerRegistry,
  Schema,
};

/**
 Lightweight DI container for customizable objects that are needed by
 deeply nested classes.

 @class Container
 @hide
 */
class Container {
  readonly inflector: Record<string, StringToString>;

  constructor() {
    this.inflector = defaultInflector;
  }

  register(key: string, value: StringToString) {
    this.inflector[key] = value;
  }

  create<ClassName extends keyof typeof classes>(
    className: ClassName,
    ...args: ConstructorParameters<typeof classes[typeof className]>
  ) {
    const Class = classes[className];
    // FIXME: Remove this @ts-ignore after finished migrating all the Class in classes
    // @ts-ignore
    Class.prototype._container = this;

    // FIXME
    // @ts-ignore
    return new Class(...args);
  }
}

const defaultContainer = new Container();

// FIXME: Remove these @ts-ignore after finished migrating all the Class in classes
// @ts-ignore
Db.prototype._container = defaultContainer;
// @ts-ignore
Association.prototype._container = defaultContainer;
// @ts-ignore
BaseRouteHandler.prototype._container = defaultContainer;
// @ts-ignore
RouteHandler.prototype._container = defaultContainer;
// @ts-ignore
Serializer.prototype._container = defaultContainer;
// @ts-ignore
SerializerRegistry.prototype._container = defaultContainer;

Schema.prototype._container = defaultContainer;

export default Container;
