export module ObjectUtils {
  export function clone<T>(obj: T): T;
  export function clone<T>(obj: T[]): T[];
  export function clone<T>(obj: T | T[]): T | T[] {
    if (obj == null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => clone(item));
    }

    return Object.assign({}, obj);
  }

  export function getValue<T>(obj: any, key: string): T {
    return obj[key];
  }
}
