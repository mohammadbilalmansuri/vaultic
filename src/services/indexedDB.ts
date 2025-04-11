import { ISavedUserData } from "@/types";
import {
  INDEXED_DB_NAME,
  INDEXED_DB_STORE_NAME,
  INDEXED_DB_VERSION,
} from "@/constants";

let dbInstance: IDBDatabase | null = null;

const openDB = async (): Promise<IDBDatabase> => {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(INDEXED_DB_STORE_NAME)) {
        db.createObjectStore(INDEXED_DB_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      dbInstance.onclose = () => {
        dbInstance = null;
      };
      resolve(dbInstance);
    };

    request.onerror = () =>
      reject(new Error(`IndexedDB error: ${request.error?.message}`));
  });
};

const withTransaction = async <T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXED_DB_STORE_NAME, mode);
    const store = tx.objectStore(INDEXED_DB_STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error(`Transaction failed: ${request.error?.message}`));

    tx.oncomplete = () => {
      // dbInstance is reused for performance
    };
  });
};

export const saveUserData = async (
  id: string,
  value: ISavedUserData
): Promise<void> => {
  try {
    await withTransaction("readwrite", (store) => store.put({ id, value }));
  } catch (error) {
    throw new Error(
      `Failed to save user data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getUserData = async (
  id: string
): Promise<ISavedUserData | null> => {
  try {
    const result = await withTransaction("readonly", (store) => store.get(id));
    return result?.value ?? null;
  } catch (error) {
    throw new Error(
      `Failed to get user data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await withTransaction("readwrite", (store) => store.clear());
  } catch (error) {
    throw new Error(
      `Failed to clear user data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
