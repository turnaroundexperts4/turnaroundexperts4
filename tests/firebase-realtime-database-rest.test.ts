import { afterEach, describe, expect, it, vi } from "vitest";

const { getGoogleAccessToken } = vi.hoisted(() => ({
  getGoogleAccessToken: vi.fn(),
}));

vi.mock("@/lib/google-access-token", () => ({ getGoogleAccessToken }));

import {
  getRealtimeDatabaseValue,
  setRealtimeDatabaseValue,
} from "@/lib/firebase-realtime-database-rest";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("Firebase Realtime Database REST client", () => {
  it("writes to the existing database path with service-account auth and silent response", async () => {
    vi.stubEnv("FIREBASE_DATABASE_URL", "https://example-default-rtdb.firebaseio.com/");
    getGoogleAccessToken.mockResolvedValue("access-token");
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await setRealtimeDatabaseValue("uploads/founders/photo-id", {
      contentType: "image/jpeg",
      dataUrl: "data:image/jpeg;base64,aGVsbG8=",
    });

    expect(getGoogleAccessToken).toHaveBeenCalledWith(
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example-default-rtdb.firebaseio.com/uploads/founders/photo-id.json?print=silent",
      expect.objectContaining({
        method: "PUT",
        headers: {
          Authorization: "Bearer access-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType: "image/jpeg",
          dataUrl: "data:image/jpeg;base64,aGVsbG8=",
        }),
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("reads existing media records and returns missing values as null", async () => {
    getGoogleAccessToken.mockResolvedValue("access-token");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ contentType: "image/png" }))
      .mockResolvedValueOnce(Response.json(null));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      getRealtimeDatabaseValue("uploads/founders/photo-id"),
    ).resolves.toEqual({ contentType: "image/png" });
    await expect(
      getRealtimeDatabaseValue("uploads/founders/missing"),
    ).resolves.toBeNull();
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://tae-lucky-509808-default-rtdb.firebaseio.com/uploads/founders/photo-id.json",
      expect.objectContaining({
        headers: { Authorization: "Bearer access-token" },
      }),
    );
  });

  it("rejects invalid paths before issuing a database request", async () => {
    await expect(
      getRealtimeDatabaseValue("uploads/../private"),
    ).rejects.toThrow("Invalid Firebase Realtime Database path.");
    expect(getGoogleAccessToken).not.toHaveBeenCalled();
  });

  it("surfaces database HTTP failures to the upload handler", async () => {
    getGoogleAccessToken.mockResolvedValue("access-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 503 })),
    );

    await expect(
      setRealtimeDatabaseValue("uploads/founders/photo-id", {}),
    ).rejects.toThrow(
      "Firebase Realtime Database request failed (HTTP 503).",
    );
  });
});
