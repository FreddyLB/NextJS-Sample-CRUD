import { ObjectType } from "./types";

export interface ControllerMetadata {
  target: ObjectType<any>;
  pattern?: string | RegExp;
}

export interface ControllerActionMetadata {
  target: ObjectType<any>;
  pattern?: string | RegExp;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  methodName: string;
}

export class ControllerMetadataStorage {
  // prettier-ignore
  private readonly controllersMetadata = new Map<ObjectType<any>, ControllerMetadata>();

  // prettier-ignore
  private readonly actionMetadata = new Map<ObjectType<any>, ControllerActionMetadata[]>();

  addController(controller: ControllerMetadata) {
    this.controllersMetadata.set(controller.target, controller);
  }

  addAction(action: ControllerActionMetadata) {
    const actions = this.actionMetadata.get(action.target);

    if (actions) {
      actions.push(action);
    } else {
      this.actionMetadata.set(action.target, [action]);
    }
  }
}

const metadataStorage = new ControllerMetadataStorage();

export function getMetadataStorage(): ControllerMetadataStorage {
  return metadataStorage;
}
