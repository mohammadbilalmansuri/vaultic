import { INDEXED_DB } from "@/config";
import { IStoredWalletData } from "@/types";

let dbInstance: IDBDatabase | null = null;

// Opens IndexedDB connection with upgrade handling
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

// Wraps database operations in a transaction with error handling
const withTransaction = async <T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const txn = db.transaction(INDEXED_DB.STORE_NAME, mode);
    const store = txn.objectStore(INDEXED_DB.STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error(`Transaction failed: ${request.error?.message}`));
  });
};

/**
 * Saves encrypted wallet data to IndexedDB.
 * @param id - Unique identifier for the wallet
 * @param value - Encrypted wallet data to store
 */
export const saveWalletData = async (
  id: string,
  value: IStoredWalletData
): Promise<void> => {
  await withTransaction("readwrite", (store) => store.put({ id, value }));
};

/**
 * Retrieves wallet data from IndexedDB by ID.
 * @param id - Unique identifier for the wallet
 * @returns Stored wallet data or null if not found
 */
export const getWalletData = async (
  id: string
): Promise<IStoredWalletData | null> => {
  const result = await withTransaction("readonly", (store) => store.get(id));
  return result?.value ?? null;
};

/**
 * Clears all wallet data from IndexedDB.
 * Used for wallet reset or logout operations.
 */
export const clearWalletData = async (): Promise<void> => {
  await withTransaction("readwrite", (store) => store.clear());
};
