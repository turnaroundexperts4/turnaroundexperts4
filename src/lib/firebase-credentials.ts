export function normalizeFirebasePrivateKey(value?: string): string | undefined {
  if (!value?.trim()) return undefined;

  const trimmed = value.trim();
  let privateKey = trimmed;

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      const decoded: unknown = JSON.parse(trimmed);
      if (typeof decoded === "string") privateKey = decoded;
    } catch {
      privateKey = trimmed.slice(1, -1);
    }
  } else if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    privateKey = trimmed.slice(1, -1);
  }

  return privateKey
    .replace(/\\+r/g, "\r")
    .replace(/\\+n/g, "\n")
    .trim();
}
