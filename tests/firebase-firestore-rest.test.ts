import { afterEach, describe, expect, it, vi } from "vitest";
import { FirestoreRestClient } from "../src/lib/firebase-firestore-rest";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("FirestoreRestClient", () => {
  it("runs filtered REST queries and decodes document values", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json([
        {
          document: {
            name: "projects/test-project/databases/(default)/documents/services/7",
            fields: {
              slug: { stringValue: "strategy" },
              active: { booleanValue: true },
              createdAt: { timestampValue: "2026-10-02T10:00:00.000Z" },
            },
          },
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new FirestoreRestClient("test-project", async () => "token");
    const snapshot = await client
      .collection("services")
      .where("slug", "==", "strategy")
      .limit(1)
      .get();

    expect(snapshot.docs).toHaveLength(1);
    expect(snapshot.docs[0].id).toBe("7");
    expect(snapshot.docs[0].data()).toEqual({
      slug: "strategy",
      active: true,
      createdAt: new Date("2026-10-02T10:00:00.000Z"),
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://firestore.googleapis.com/v1/projects/test-project/databases/(default)/documents:runQuery",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "services" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "slug" },
                op: "EQUAL",
                value: { stringValue: "strategy" },
              },
            },
            limit: 1,
          },
        }),
      }),
    );
  });

  it("commits transaction writes with create preconditions", async () => {
    const fetchMock = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith(":beginTransaction")) {
          return Response.json({ transaction: "transaction-token" });
        }
        if (url.endsWith(":batchGet")) {
          return Response.json([{ missing: "appointment path" }]);
        }
        if (url.endsWith(":commit")) return Response.json({});
        throw new Error(`Unexpected Firestore REST request: ${url} ${init?.method}`);
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new FirestoreRestClient("test-project", async () => "token");
    const reference = client.collection("appointments").doc("7");
    await client.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(reference);
      expect(snapshot.exists).toBe(false);
      transaction.create(reference, {
        reference: "TAE-TEST",
        createdAt: new Date("2026-10-02T10:00:00.000Z"),
      });
    });

    const commitCall = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith(":commit"),
    );
    const batchGetCall = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith(":batchGet"),
    );
    expect(JSON.parse(String(batchGetCall?.[1]?.body))).toEqual({
      documents: [
        "projects/test-project/databases/(default)/documents/appointments/7",
      ],
      transaction: "transaction-token",
    });
    expect(JSON.parse(String(commitCall?.[1]?.body))).toEqual({
      transaction: "transaction-token",
      writes: [
        {
          update: {
            name: "https://firestore.googleapis.com/v1/projects/test-project/databases/(default)/documents/appointments/7",
            fields: {
              reference: { stringValue: "TAE-TEST" },
              createdAt: {
                timestampValue: "2026-10-02T10:00:00.000Z",
              },
            },
          },
          currentDocument: { exists: false },
        },
      ],
    });
  });

  it("surfaces Firestore REST errors with status and service code", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { error: { message: "Permission denied", status: "PERMISSION_DENIED" } },
          { status: 403 },
        ),
      ),
    );
    const client = new FirestoreRestClient("test-project", async () => "token");

    await expect(client.collection("services").get()).rejects.toMatchObject({
      name: "FirestoreRestError",
      message: "Permission denied",
      status: 403,
      code: "PERMISSION_DENIED",
    });
  });
});
