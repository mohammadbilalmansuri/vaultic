const ALGORITHM = "AES-GCM";
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return `${Buffer.from(salt).toString("hex")}:${Buffer.from(
    hashBuffer
  ).toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [saltHex, storedHashHex] = storedHash.split(":");
  const salt = new Uint8Array(Buffer.from(saltHex, "hex"));
  const storedHashBuffer = Buffer.from(storedHashHex, "hex");

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const computedHashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return Buffer.from(computedHashBuffer).toString("hex") === storedHashHex;
}

async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMnemonic(
  mnemonic: string,
  password: string
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    new TextEncoder().encode(mnemonic)
  );

  return `${Buffer.from(salt).toString("hex")}:${Buffer.from(iv).toString(
    "hex"
  )}:${Buffer.from(encryptedBuffer).toString("hex")}`;
}

export async function decryptMnemonic(
  encryptedMnemonic: string,
  password: string
): Promise<string> {
  try {
    const [saltHex, ivHex, encryptedHex] = encryptedMnemonic.split(":");
    const salt = new Uint8Array(Buffer.from(saltHex, "hex"));
    const iv = new Uint8Array(Buffer.from(ivHex, "hex"));
    const encryptedBuffer = Buffer.from(encryptedHex, "hex");

    const key = await deriveKey(password, salt);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encryptedBuffer
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    return "";
  }
}
