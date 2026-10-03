export function normalizeFirebasePrivateKey(value?: string): string | undefined {
  if (!value?.trim()) return undefined;

  const trimmed = value.trim();
  let privateKey = trimmed;

  const isJsonString = trimmed.startsWith('"') && trimmed.endsWith('"');
  const isJsonObject = trimmed.startsWith("{") && trimmed.endsWith("}");

  if (isJsonString || isJsonObject) {
    try {
      const decoded: unknown = JSON.parse(trimmed);
      if (typeof decoded === "string") privateKey = decoded;
      else if (
        decoded &&
        typeof decoded === "object" &&
        "private_key" in decoded &&
        typeof decoded.private_key === "string"
      ) {
        privateKey = decoded.private_key;
      }
    } catch {
      if (isJsonString) privateKey = trimmed.slice(1, -1);
    }
  } else if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    privateKey = trimmed.slice(1, -1);
  }

  return privateKey
    .replace(/\\+r/g, "\r")
    .replace(/\\+n/g, "\n")
    .trim();
}
