import { generateKeyPairSync } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("getGoogleAccessToken", () => {
  it("shares a single token request between concurrent callers for the same scope", async () => {
    const { privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
      publicKeyEncoding: { type: "spki", format: "pem" },
    });
    vi.stubEnv("FIREBASE_CLIENT_EMAIL", "firebase@example.test");
    vi.stubEnv("FIREBASE_PRIVATE_KEY", privateKey);
    let resolveFetch: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { getGoogleAccessToken } = await import(
      "../src/lib/google-access-token"
    );
    const requests = [
      getGoogleAccessToken("https://www.googleapis.com/auth/datastore"),
      getGoogleAccessToken("https://www.googleapis.com/auth/datastore"),
      getGoogleAccessToken("https://www.googleapis.com/auth/datastore"),
    ];

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    resolveFetch?.(Response.json({ access_token: "shared-token", expires_in: 3600 }));

    await expect(Promise.all(requests)).resolves.toEqual([
      "shared-token",
      "shared-token",
      "shared-token",
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
