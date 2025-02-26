export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );

  return JSON.stringify({
    salt: Array.from(salt),
    hash: Array.from(new Uint8Array(hashBuffer)),
  });
}

export async function verifyPassword(
  inputPassword: string,
  storedHash: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const { salt, hash } = JSON.parse(storedHash);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(inputPassword),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const inputHashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const inputHash = Array.from(new Uint8Array(inputHashBuffer));

  return inputHash.toString() === hash.toString();
}
