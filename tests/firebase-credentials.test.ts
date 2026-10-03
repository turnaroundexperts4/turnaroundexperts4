import { describe, expect, it } from "vitest";
import { normalizeFirebasePrivateKey } from "../src/lib/firebase-credentials";

describe("normalizeFirebasePrivateKey", () => {
  const pem = [
    "-----BEGIN PRIVATE KEY-----",
    "YWJj",
    "-----END PRIVATE KEY-----",
  ].join("\n");

  it("decodes JSON-quoted PEM values and trims the trailing newline", () => {
    expect(normalizeFirebasePrivateKey(JSON.stringify(`${pem}\n`))).toBe(pem);
  });

  it("extracts the private key from a service-account JSON value", () => {
    expect(
      normalizeFirebasePrivateKey(
        JSON.stringify({ private_key: `${pem}\n` }),
      ),
    ).toBe(pem);
  });

  it("converts escaped newlines in raw environment values", () => {
    expect(normalizeFirebasePrivateKey(pem.replace(/\n/g, "\\n"))).toBe(pem);
  });

  it("leaves an unquoted PEM value unchanged", () => {
    expect(normalizeFirebasePrivateKey(pem)).toBe(pem);
  });

  it("treats empty values as unconfigured", () => {
    expect(normalizeFirebasePrivateKey("  ")).toBeUndefined();
  });
});
