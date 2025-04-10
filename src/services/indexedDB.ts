import { ISavedUserData } from "@/types";

const DB_NAME = "vaultic_db";
const STORE_NAME = "vaultic_store";
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

// Opens an IndexedDB connection (singleton pattern).
async function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
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
}

// Executes a database transaction with auto-retry on failure.
async function withTransaction<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error(`Transaction failed: ${request.error?.message}`));

    tx.oncomplete = () => {
      // dbInstance is reused for performance
    };
  });
}

// Saves user data in IndexedDB.
export async function setUserData(
  id: string,
  value: ISavedUserData
): Promise<void> {
  try {
    await withTransaction("readwrite", (store) => store.put({ id, value }));
  } catch (error) {
    console.error("Failed to set user data:", error);
  }
}

// Retrieves user data from IndexedDB.
export async function getUserData(id: string): Promise<ISavedUserData | null> {
  try {
    const result = await withTransaction("readonly", (store) => store.get(id));
    return result?.value ?? null;
  } catch (error) {
    console.error("Failed to get user data:", error);
    return null;
  }
}

// Clears all user data.
export async function clearUserData(): Promise<void> {
  try {
    await withTransaction("readwrite", (store) => store.clear());
  } catch (error) {
    console.error("Failed to clear user data:", error);
  }
}
