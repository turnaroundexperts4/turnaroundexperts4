import { afterEach, describe, expect, it, vi } from "vitest";

const { getUser, getAdminDoc } = vi.hoisted(() => ({
  getUser: vi.fn(),
  getAdminDoc: vi.fn(),
}));

vi.mock("@/lib/firebase-admin", () => ({
  firebaseAdminConfigured: true,
  firebaseAuth: { getUser },
  firestore: {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({ get: getAdminDoc })),
    })),
  },
}));

import { verifyFirebasePassword } from "@/lib/firebase-auth";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("verifyFirebasePassword", () => {
  it("authenticates an admin document without a Firebase Admin user lookup", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "test-api-key");
    getAdminDoc.mockResolvedValue({ exists: true });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          localId: "firebase-uid",
          email: "admin@example.com",
          idToken: "firebase-id-token",
        }),
      ),
    );

    await expect(
      verifyFirebasePassword("admin@example.com", "valid-password"),
    ).resolves.toEqual({
      status: "authenticated",
      uid: "firebase-uid",
      email: "admin@example.com",
      name: "admin@example.com",
    });
    expect(getUser).not.toHaveBeenCalled();
  });

  it("preserves authorization by the Firebase admin custom claim", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "test-api-key");
    getAdminDoc.mockResolvedValue({ exists: false });
    getUser.mockResolvedValue({ customClaims: { admin: true }, email: "admin@example.com" });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          localId: "firebase-uid",
          email: "admin@example.com",
          idToken: "firebase-id-token",
        }),
      ),
    );

    await expect(
      verifyFirebasePassword("admin@example.com", "valid-password"),
    ).resolves.toMatchObject({
      status: "authenticated",
      uid: "firebase-uid",
    });
    expect(getUser).toHaveBeenCalledWith("firebase-uid");
  });
});
