import { isBrowser } from "@shared/utils";
import { useState } from "react";

const EMPTY_STORAGE: Storage = Object.freeze({
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null,
  clear: () => null,
  key: () => null,
  length: 0,
});

export interface UseStorageItemState<T> {
  value: T | undefined;
  set: (value: T) => void;
  remove: () => void;
}

function useStorageItem<T>(
  storage: Storage,
  key: string,
  initialValue?: T
): UseStorageItemState<T> {
  const [value, setValue] = useState<T | undefined>(() => {
    const item = storage.getItem(key);

    try {
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  const set = (value: T) => {
    setValue(value);
    storage.setItem(key, JSON.stringify(value));
  };

  const remove = () => {
    storage.removeItem(key);
    setValue(undefined);
  };

  return {
    value,
    set,
    remove,
  };
}

export function useLocalStorageItem<T>(
  key: string,
  initialValue?: T
): UseStorageItemState<T> {
  const storage = isBrowser() ? window.localStorage : EMPTY_STORAGE;
  return useStorageItem(storage, key, initialValue);
}

export function useSessionStorageItem<T>(
  key: string,
  initialValue?: T
): UseStorageItemState<T> {
  const storage = isBrowser() ? window.sessionStorage : EMPTY_STORAGE;
  return useStorageItem(storage, key, initialValue);
}
