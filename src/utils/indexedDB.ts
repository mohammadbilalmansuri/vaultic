export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("cryptoWalletDB", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("walletStore")) {
        db.createObjectStore("walletStore");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Store data in IndexedDB
export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("walletStore", "readwrite");
      const store = tx.objectStore("walletStore");
      store.put(value, key);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("IndexedDB setItem Error:", error);
  }
};

// Retrieve data from IndexedDB
export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("walletStore", "readonly");
      const store = tx.objectStore("walletStore");
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result as T | null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB getItem Error:", error);
    return null;
  }
};

// Delete data from IndexedDB
export const deleteItem = async (key: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("walletStore", "readwrite");
      const store = tx.objectStore("walletStore");
      store.delete(key);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("IndexedDB deleteItem Error:", error);
  }
};
