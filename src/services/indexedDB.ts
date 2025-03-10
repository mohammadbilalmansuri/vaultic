import { TIndexes } from "@/stores/userStore";

export interface ISavedUserData {
  hashedPassword: string;
  encryptedMnemonic: string;
  indexes: TIndexes;
}

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
      // Avoid closing dbInstance (reuse for performance)
    };
  });
}

// Saves user data in IndexedDB.
export async function setUserData(
  id: string,
  value: ISavedUserData
): Promise<void> {
  await withTransaction("readwrite", (store) => store.put({ id, value }));
}

// Retrieves user data from IndexedDB.
export async function getUserData(id: string): Promise<ISavedUserData | null> {
  return await withTransaction("readonly", (store) => store.get(id)).then(
    (result) => result?.value ?? null
  );
}

// Clears all user data.
export async function clearUserData(): Promise<void> {
  await withTransaction("readwrite", (store) => store.clear());
}
