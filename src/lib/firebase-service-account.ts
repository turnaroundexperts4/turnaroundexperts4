export function normalizeFirebasePrivateKey(value: string | undefined) {
  if (!value) return undefined;

  let privateKey = value.trim();
  if (privateKey.startsWith("{")) {
    const credentials: unknown = JSON.parse(privateKey);
    if (
      !credentials ||
      typeof credentials !== "object" ||
      !("private_key" in credentials) ||
      typeof credentials.private_key !== "string"
    ) {
      throw new Error(
        "FIREBASE_PRIVATE_KEY contains JSON without a string private_key field.",
      );
    }
    privateKey = credentials.private_key;
  }

  return privateKey
    .trim()
    .replace(/^(['"])([\s\S]*)\1$/, "$2")
    .replace(/\\+r/g, "\r")
    .replace(/\\+n/g, "\n");
}
