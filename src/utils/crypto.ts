export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function encryptMnemonic(
  mnemonic: string,
  hashedPassword: string
): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(hashedPassword),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    keyMaterial,
    encoder.encode(mnemonic)
  );
  return `${btoa(String.fromCharCode(...iv))}.${btoa(
    String.fromCharCode(...new Uint8Array(encrypted))
  )}`;
}

export async function decryptMnemonic(
  encryptedData: string,
  hashedPassword: string
): Promise<string> {
  const [ivB64, dataB64] = encryptedData.split(".");
  if (!ivB64 || !dataB64) throw new Error("Invalid encrypted format");
  const iv = new Uint8Array(
    atob(ivB64)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  const encryptedBytes = new Uint8Array(
    atob(dataB64)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(hashedPassword),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    keyMaterial,
    encryptedBytes
  );
  return new TextDecoder().decode(decrypted);
}
