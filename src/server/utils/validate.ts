import { ValidationError } from "./errors";

export module Validate {
  export function is(condition: boolean, message: string): void {
    if (!condition) {
      throw new ValidationError(message);
    }
  }

  export function isRequired(value: any, argName?: string): void {
    if (value === undefined || value === null) {
      const message = argName
        ? "value is required"
        : `'${argName}' is required`;
      throw new ValidationError(message);
    }
  }

  export function isNonNullOrUndefined(value: any, argName?: string): void {
    if (value == null || value == undefined) {
      const message = argName
        ? "value cannot be null or undefined"
        : `'${argName}' cannot be null or undefined`;
      throw new ValidationError(message);
    }
  }

  export function isNonEmptyString(value: any, argName?: string): void {
    if (typeof value !== "string" || value.length === 0) {
      const message = argName
        ? "value cannot be an empty string"
        : `'${argName}' cannot be an empty string`;
      throw new ValidationError(message);
    }
  }

  export function isNonBlankString(value: any, argName?: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      const message = argName
        ? "value cannot be a blank string"
        : `'${argName}' cannot be a blank string`;

      throw new ValidationError(message);
    }
  }

  export function isString(value: any, argName?: string): value is string {
    if (typeof value !== "string") {
      const message = argName
        ? "value must be a string"
        : `'${argName}' must be a string`;

      throw new ValidationError(message);
    }

    return true;
  }

  export function isBoolean(value: any, argName?: string): value is boolean {
    if (typeof value !== "boolean") {
      const message = argName
        ? "value must be a boolean"
        : `'${argName}' must be a boolean`;
      throw new ValidationError(message);
    }

    return true;
  }

  export function isNumber(value: any, argName?: string): value is number {
    if (isNaN(Number(value))) {
      const message = argName
        ? "value must be a number"
        : `'${argName}' must be a number`;

      throw new ValidationError(message);
    }

    return true;
  }

  export function isPositiveNumber(
    value: any,
    argName?: string
  ): value is number {
    if (isNaN(Number(value)) || value <= 0) {
      const message = argName
        ? "value must be a positive number"
        : `'${argName}' must be a positive number`;

      throw new ValidationError(message);
    }

    return true;
  }

  export function isNegativeNumber(
    value: any,
    argName?: string
  ): value is number {
    if (isNaN(Number(value)) || value >= 0) {
      const message = argName
        ? "value must be a negative number"
        : `'${argName}' must be a negative number`;

      throw new ValidationError(message);
    }

    return true;
  }

  export function inRange(
    value: any,
    min: any,
    max: any,
    argName?: string
  ): void {
    isRequired(value, argName);

    if (value < min || value > max) {
      const message = argName
        ? `value must be between ${min} and ${max}`
        : `'${argName}' must be between ${min} and ${max}`;

      throw new ValidationError(message);
    }
  }

  export function oneOf(
    value: any,
    values: Array<any>,
    argName?: string
  ): void {
    if (!values.includes(value)) {
      const message = argName
        ? `value must be one of [${values.join(", ")}]`
        : `'${argName}' must be one of [${values.join(", ")}]`;

      throw new ValidationError(message);
    }
  }

  export function except(
    value: any,
    values: Array<any>,
    argName?: string
  ): void {
    if (values.includes(value)) {
      const message = argName
        ? `value must not be one of [${values.join(", ")}]`
        : `'${argName}' must not be one of [${values.join(", ")}]`;

      throw new ValidationError(message);
    }
  }
}
