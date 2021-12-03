import { NextApiResponse } from "next";
import { NextApiRequestWithParams, ObjectType, Middleware } from ".";
import { getMetadataStorage } from "./metadata";

export function RouteController(route: string) {
  return function (constructor: ObjectType<any>) {
    getMetadataStorage().addController({
      target: constructor,
      pattern: route,
    });
  };
}

export function OnError() {
  return function (target: ObjectType<any>, methodName: string) {
    getMetadataStorage().addErrorHandler({
      target: target,
      methodName,
    });
  };
}

export function UseMiddleware<
  Req extends NextApiRequestWithParams,
  Res extends NextApiResponse
>(middleware: Middleware<Req, Res>) {
  return function (target: ObjectType<any>, methodName?: string) {
    // If the target is no a method but a class, methodName will be undefined
    getMetadataStorage().addMiddleware({
      target: target,
      methodName,
      handler: middleware,
    });
  };
}

export function Get(pattern?: string) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "GET",
      methodName,
    });
  };
}

export function Post(pattern?: string) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "POST",
      methodName,
    });
  };
}

export function Put(pattern?: string) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "PUT",
      methodName,
    });
  };
}

export function Path(pattern?: string) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "PATCH",
      methodName,
    });
  };
}

export function Delete(pattern?: string) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "DELETE",
      methodName,
    });
  };
}
