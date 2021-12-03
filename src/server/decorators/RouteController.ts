import { ObjectType, getMetadataStorage } from ".";

export function RouteController(route?: string | RegExp) {
  return function (constructor: ObjectType<any>) {
    getMetadataStorage().addController({
      target: constructor,
      pattern: route,
    });
  };
}
