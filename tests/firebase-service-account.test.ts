import { describe, expect, it } from "vitest";
import { normalizeFirebasePrivateKey } from "../src/lib/firebase-service-account";

describe("normalizeFirebasePrivateKey", () => {
  const pem = "-----BEGIN PRIVATE KEY-----\nkey-data\n-----END PRIVATE KEY-----";

  it("normalizes PEM values with escaped newlines", () => {
    expect(normalizeFirebasePrivateKey(pem.replace(/\n/g, "\\n"))).toBe(pem);
  });

  it("extracts the private key from service-account JSON", () => {
    expect(
      normalizeFirebasePrivateKey(
        JSON.stringify({ type: "service_account", private_key: pem }),
      ),
    ).toBe(pem);
  });

  it("rejects JSON without a private_key field", () => {
    expect(() =>
      normalizeFirebasePrivateKey(JSON.stringify({ type: "service_account" })),
    ).toThrow(
      "FIREBASE_PRIVATE_KEY contains JSON without a string private_key field.",
    );
  });

  it("leaves an unset key unset", () => {
    expect(normalizeFirebasePrivateKey(undefined)).toBeUndefined();
  });
});
