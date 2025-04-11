const cryptoLib: SubtleCrypto = globalThis.crypto.subtle;

export const hashPassword = async (
  password: string
): Promise<string | null> => {
  try {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));

    const keyMaterial = await cryptoLib.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedKey = await cryptoLib.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    const hashHex = Array.from(new Uint8Array(derivedKey))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    const saltHex = Array.from(salt)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return `${saltHex}:${hashHex}`;
  } catch (error) {
    console.error("Password hashing failed:", error);
    return null;
  }
};

export const verifyPassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  try {
    const [saltHex, hashHex] = storedHash.split(":");
    const salt = new Uint8Array(
      saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    const encoder = new TextEncoder();
    const keyMaterial = await cryptoLib.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedKey = await cryptoLib.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    const computedHashHex = Array.from(new Uint8Array(derivedKey))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return computedHashHex === hashHex;
  } catch (error) {
    console.error("Password verification failed:", error);
    return false;
  }
};

export const encryptMnemonic = async (
  mnemonic: string,
  password: string
): Promise<string | null> => {
  try {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await cryptoLib.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await cryptoLib.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    const encryptedData = await cryptoLib.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoder.encode(mnemonic)
    );

    return `${btoa(String.fromCharCode(...salt))}:${btoa(
      String.fromCharCode(...iv)
    )}:${btoa(String.fromCharCode(...new Uint8Array(encryptedData)))}`;
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decryptMnemonic = async (
  encryptedMnemonic: string,
  password: string
): Promise<string | null> => {
  try {
    const [saltB64, ivB64, encryptedB64] = encryptedMnemonic.split(":");

    const salt = new Uint8Array(
      atob(saltB64)
        .split("")
        .map((c) => c.charCodeAt(0))
    );
    const iv = new Uint8Array(
      atob(ivB64)
        .split("")
        .map((c) => c.charCodeAt(0))
    );
    const encryptedData = new Uint8Array(
      atob(encryptedB64)
        .split("")
        .map((c) => c.charCodeAt(0))
    );

    const encoder = new TextEncoder();
    const keyMaterial = await cryptoLib.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await cryptoLib.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decryptedData = await cryptoLib.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
