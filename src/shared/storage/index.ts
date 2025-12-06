import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { type Account, type Device } from './schema';

export * from './schema';

export class Storage<Scopes extends unknown[], Schema> {
  protected sep = ':';
  protected storeId: string;
  private listeners = new Map<string, Set<() => void>>();

  constructor({ id }: { id: string }) {
    this.storeId = id;
  }

  private getKey(scopes: string[]): string {
    return `${this.storeId}:${scopes.join(this.sep)}`;
  }

  async set<Key extends keyof Schema>(
    scopes: [...Scopes, Key],
    data: Schema[Key],
  ): Promise<void> {
    const key = this.getKey(scopes as string[]);

    await AsyncStorage.setItem(key, JSON.stringify({ data }));
    this.notifyListeners(scopes);
  }

  async get<Key extends keyof Schema>(
    scopes: [...Scopes, Key],
  ): Promise<Schema[Key] | undefined> {
    const key = this.getKey(scopes as string[]);
    const res = await AsyncStorage.getItem(key);

    if (!res) return undefined;
    try {
      return JSON.parse(res).data;
    } catch {
      return undefined;
    }
  }

  async remove<Key extends keyof Schema>(scopes: [...Scopes, Key]): Promise<void> {
    const key = this.getKey(scopes as string[]);

    await AsyncStorage.removeItem(key);
    this.notifyListeners(scopes);
  }

  async removeMany<Key extends keyof Schema>(
    scopes: [...Scopes],
    keys: Key[],
  ): Promise<void> {
    await Promise.all(keys.map(key => this.remove([...scopes, key])));
  }

  async removeAll(): Promise<void> {
    const allKeys = await AsyncStorage.getAllKeys();
    const keysToRemove = allKeys.filter(key => key.startsWith(`${this.storeId}:`));

    await AsyncStorage.multiRemove(keysToRemove);
    this.listeners.clear();
  }
  addOnValueChangedListener<Key extends keyof Schema>(
    scopes: [...Scopes, Key],
    callback: () => void,
  ): { remove: () => void } {
    const key = scopes.join(this.sep);

    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    this.listeners.get(key)!.add(callback);

    return {
      remove: () => {
        const callbacks = this.listeners.get(key);

        if (callbacks) {
          callbacks.delete(callback);
          if (callbacks.size === 0) {
            this.listeners.delete(key);
          }
        }
      },
    };
  }

  private notifyListeners<Key extends keyof Schema>(scopes: [...Scopes, Key]): void {
    const key = scopes.join(this.sep);
    const callbacks = this.listeners.get(key);

    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }
}

type StorageSchema<T extends Storage<any, any>> =
  T extends Storage<any, infer U> ? U : never;
type StorageScopes<T extends Storage<any, any>> =
  T extends Storage<infer S, any> ? S : never;

export function useStorage<
  Store extends Storage<any, any>,
  Key extends keyof StorageSchema<Store>,
>(
  storage: Store,
  scopes: [...StorageScopes<Store>, Key],
): [StorageSchema<Store>[Key] | undefined, (data: StorageSchema<Store>[Key]) => void] {
  type Schema = StorageSchema<Store>;
  const [value, setValue] = useState<Schema[Key] | undefined>();

  useEffect(() => {
    storage.get(scopes).then(loadedValue => {
      setValue(loadedValue);
    });
  }, [storage, scopes]);

  useEffect(() => {
    const sub = storage.addOnValueChangedListener(scopes, () => {
      storage.get(scopes).then(loadedValue => {
        setValue(loadedValue);
      });
    });

    return () => sub.remove();
  }, [storage, scopes]);

  const setter = useCallback(
    (data: Schema[Key]) => {
      setValue(data);
      storage.set(scopes, data);
    },
    [storage, scopes],
  );

  return [value, setter] as const;
}

export const device = new Storage<[], Device>({ id: 'bitify_device' });

export const account = new Storage<[string], Account>({ id: 'bitify_account' });

if (__DEV__ && typeof window !== 'undefined') {
  // @ts-expect-error - dev global
  window.bitify_storage = {
    device,
    account,
  };
}
