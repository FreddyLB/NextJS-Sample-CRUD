import { ObjectUtils } from "./ObjectUtils";

export module ArrayUtils {
  export function range(min: number, max: number): number[] {
    const result: number[] = [];
    for (let i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  }

  export function getOrArray<T>(value: T | T[]): T[] {
    if (Array.isArray(value)) {
      return value;
    }

    return [value];
  }

  export function repeat<T>(value: T[], count: number): T[];
  export function repeat<T>(value: T, count: number): T[];
  export function repeat<T>(value: T | T[], count: number): T[] {
    if (Array.isArray(value)) {
      return repeatArray(value, count);
    }

    return repeatSingle(value, count);
  }

  function repeatSingle<T>(value: T, count: number): T[] {
    const result: T[] = [];

    for (let i = 0; i < count; i++) {
      const cloned = ObjectUtils.clone(value);
      result.push(cloned);
    }

    return result;
  }

  function repeatArray<T>(array: T[], count: number): T[] {
    const result: T[] = [];

    for (let i = 0; i < count; i++) {
      const cloned = ObjectUtils.clone(array);
      result.push(...cloned);
    }

    return result;
  }
}
