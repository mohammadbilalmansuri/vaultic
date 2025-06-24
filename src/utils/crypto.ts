const cryptoLib: SubtleCrypto = globalThis.crypto.subtle;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Converts byte array to hexadecimal string
const toHex = (buffer: Uint8Array) =>
  Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

// Converts hexadecimal string to byte array
const fromHex = (hex: string) =>
  new Uint8Array(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));

// Converts byte array to base64 string
const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

// Converts base64 string to byte array
const fromBase64 = (b64: string) =>
  new Uint8Array(
    atob(b64)
      .split("")
      .map((c) => c.charCodeAt(0))
  );

/**
 * Hashes a password using PBKDF2 with a random salt.
 * @param password - Plain text password to hash
 * @returns Promise resolving to salt:hash string format
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await cryptoLib.importKey(
      "raw",
      textEncoder.encode(password),
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

    return `${toHex(salt)}:${toHex(new Uint8Array(derivedKey))}`;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
};

/**
 * Verifies a password against a stored hash.
 * @param password - Plain text password to verify
 * @param storedHash - Previously hashed password in salt:hash format
 * @returns Promise resolving to true if password matches
 */
export const verifyPassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  try {
    const [saltHex, hashHex] = storedHash.split(":");
    const salt = fromHex(saltHex);

    const keyMaterial = await cryptoLib.importKey(
      "raw",
      textEncoder.encode(password),
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

    const computedHex = toHex(new Uint8Array(derivedKey));
    return computedHex === hashHex;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Failed to verify password");
  }
};

/**
 * Encrypts a mnemonic phrase using AES-GCM with password-derived key.
 * @param mnemonic - Plain text mnemonic phrase to encrypt
 * @param password - Password used for encryption key derivation
 * @returns Promise resolving to encrypted string in salt:iv:cipher format
 */
export const encryptMnemonic = async (
  mnemonic: string,
  password: string
): Promise<string> => {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await cryptoLib.importKey(
      "raw",
      textEncoder.encode(password),
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

    const encrypted = await cryptoLib.encrypt(
      { name: "AES-GCM", iv },
      key,
      textEncoder.encode(mnemonic)
    );

    return `${toBase64(salt)}:${toBase64(iv)}:${toBase64(
      new Uint8Array(encrypted)
    )}`;
  } catch (error) {
    console.error("Error encrypting mnemonic:", error);
    throw new Error("Failed to encrypt mnemonic");
  }
};

/**
 * Decrypts an encrypted mnemonic phrase.
 * @param encryptedMnemonic - Encrypted mnemonic in salt:iv:cipher format
 * @param password - Password used for decryption key derivation
 * @returns Promise resolving to decrypted mnemonic phrase
 */
export const decryptMnemonic = async (
  encryptedMnemonic: string,
  password: string
): Promise<string> => {
  try {
    const [saltB64, ivB64, cipherB64] = encryptedMnemonic.split(":");

    const salt = fromBase64(saltB64);
    const iv = fromBase64(ivB64);
    const encryptedData = fromBase64(cipherB64);

    const keyMaterial = await cryptoLib.importKey(
      "raw",
      textEncoder.encode(password),
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

    const decrypted = await cryptoLib.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
    );

    return textDecoder.decode(decrypted);
  } catch (error) {
    console.error("Error decrypting mnemonic:", error);
    throw new Error("Failed to decrypt mnemonic");
  }
};
