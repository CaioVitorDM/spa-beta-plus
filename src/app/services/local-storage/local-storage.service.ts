import {Injectable} from '@angular/core';

/**
 * Service for interacting with the browser's local storage.
 * @Injectable decorator indicates that this service can be injected into other Angular components or services.
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   * Sets an item in local storage.
   * @param key - The key under which to store the item.
   * @param value - The value to be stored. Must be serializable to a string.
   */
  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, value as unknown as string);
  }

  /**
   * Retrieves an item from local storage.
   * @param key - The key of the item to retrieve.
   * @returns The retrieved item, or null if the key is not found.
   */
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  }

  /**
   * Removes an item from local storage.
   * @param key - The key of the item to be removed.
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clears all items from local storage.
   */
  clear(): void {
    localStorage.clear();
  }
}
