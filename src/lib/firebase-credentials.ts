export function normalizeFirebasePrivateKey(value?: string): string | undefined {
  if (!value?.trim()) return undefined;

  let privateKey = value.trim();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
      privateKey = privateKey.slice(1, -1);
      continue;
    }
    if (
      !(
        (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
        (privateKey.startsWith("{") && privateKey.endsWith("}"))
      )
    ) {
      break;
    }

    try {
      const decoded: unknown = JSON.parse(privateKey);
      if (typeof decoded === "string") {
        privateKey = decoded;
        continue;
      }
      if (
        decoded &&
        typeof decoded === "object" &&
        "private_key" in decoded &&
        typeof decoded.private_key === "string"
      ) {
        privateKey = decoded.private_key;
        continue;
      }
    } catch {
    }
    break;
  }

  const normalized = privateKey
    .replace(/\\+r/g, "\r")
    .replace(/\\+n/g, "\n")
    .trim();
  const pemStart = normalized.indexOf("-----BEGIN PRIVATE KEY-----");
  const pemEnd = normalized.indexOf("-----END PRIVATE KEY-----", pemStart);
  if (pemStart < 0 || pemEnd < 0) return normalized;
  return normalized.slice(pemStart, pemEnd + "-----END PRIVATE KEY-----".length);
}
