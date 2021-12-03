import { HttpVerb, Middleware, ObjectType } from "./types";

export interface ControllerMetadata {
  target: ObjectType<any>;
  // pattern?: string | RegExp;
}

export interface ControllerActionMetadata {
  target: ObjectType<any>;
  pattern?: string | RegExp;
  method: HttpVerb;
  methodName: string;
}

export interface ControllerErrorHandlerMetadata {
  target: ObjectType<any>;
  methodName: string;
}

export interface ControllerMiddlewareMetadata {
  target: ObjectType<any>;
  methodName?: string;
  handler: Middleware<any, any>;
}

export class ControllerMetadataStorage {
  // prettier-ignore
  private readonly controllersMetadata = new Map<ObjectType<any>, ControllerMetadata>();

  // prettier-ignore
  private readonly actionMetadata = new Map<ObjectType<any>, ControllerActionMetadata[]>();

  // prettier-ignore
  private readonly controllerErrorHandler = new Map<ObjectType<any>, ControllerErrorHandlerMetadata>();

  // prettier-ignore
  private readonly middlewaresMetadata = new Map<ObjectType<any>, ControllerMiddlewareMetadata[]>();

  addController(controllerMetadata: ControllerMetadata) {
    this.controllersMetadata.set(controllerMetadata.target, controllerMetadata);
  }

  addAction(actionMetadata: ControllerActionMetadata) {
    const actions = this.actionMetadata.get(actionMetadata.target);

    if (actions) {
      for (const action of actions) {
        // prettier-ignore
        if (action.method === actionMetadata.method && action.pattern === actionMetadata.pattern) {
          throw new Error(`Confliting route path: ${action.method} "${action.pattern}"`);
        }
      }

      actions.push(actionMetadata);
    } else {
      this.actionMetadata.set(actionMetadata.target, [actionMetadata]);
    }
  }

  addErrorHandler(errorHandler: ControllerErrorHandlerMetadata) {
    this.controllerErrorHandler.set(errorHandler.target, errorHandler);
  }

  addMiddleware(middleware: ControllerMiddlewareMetadata) {
    const middlewares = this.middlewaresMetadata.get(middleware.target);

    if (middlewares) {
      middlewares.push(middleware);
    } else {
      this.middlewaresMetadata.set(middleware.target, [middleware]);
    }
  }

  getControllers(type: ObjectType<any>): ControllerMetadata | undefined {
    return this.controllersMetadata.get(type);
  }

  getActions(type: ObjectType<any>): ControllerActionMetadata[] {
    return this.actionMetadata.get(type) || [];
  }

  getErrorHandler(
    type: ObjectType<any>
  ): ControllerErrorHandlerMetadata | undefined {
    return this.controllerErrorHandler.get(type);
  }

  getMiddlewares(type: ObjectType<any>): ControllerMiddlewareMetadata[] {
    return this.middlewaresMetadata.get(type) || [];
  }
}

const metadataStorage = new ControllerMetadataStorage();

export function getMetadataStorage(): ControllerMetadataStorage {
  return metadataStorage;
}
