import { IStoredWalletData } from "@/types";
import { INDEXED_DB } from "@/constants";

let dbInstance: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXED_DB.NAME, INDEXED_DB.VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(INDEXED_DB.STORE_NAME)) {
        db.createObjectStore(INDEXED_DB.STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
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
    const tx = db.transaction(INDEXED_DB.STORE_NAME, mode);
    const store = tx.objectStore(INDEXED_DB.STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error(`Transaction failed: ${request.error?.message}`));
  });
};

export const saveWalletData = async (
  id: string,
  value: IStoredWalletData
): Promise<void> => {
  await withTransaction("readwrite", (store) => store.put({ id, value }));
};

export const getWalletData = async (
  id: string
): Promise<IStoredWalletData | null> => {
  const result = await withTransaction("readonly", (store) => store.get(id));
  return result?.value ?? null;
};

export const clearWalletData = async (): Promise<void> => {
  await withTransaction("readwrite", (store) => store.clear());
};
