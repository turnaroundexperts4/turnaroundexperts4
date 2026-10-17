import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getSession, setRealtimeDatabaseValue } = vi.hoisted(() => ({
  getSession: vi.fn(),
  setRealtimeDatabaseValue: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ getSession }));
vi.mock("@/lib/firebase-realtime-database-rest", () => ({
  setRealtimeDatabaseValue,
}));
vi.mock("nanoid", () => ({ nanoid: () => "test-id" }));

import { POST } from "@/app/api/upload/route";

function createUploadRequest(file: File, folder = "team") {
  const form = new FormData();
  form.set("file", file);
  form.set("folder", folder);
  return new Request("http://localhost/api/upload", {
    method: "POST",
    body: form,
  });
}

function imageFile(size = 1, type = "image/jpeg") {
  return new File([new Uint8Array(size)], "photo.jpg", { type });
}

beforeEach(() => {
  getSession.mockResolvedValue({ adminUid: "admin-uid" });
  setRealtimeDatabaseValue.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("POST /api/upload", () => {
  it("rejects unauthenticated requests without accessing Firebase", async () => {
    getSession.mockResolvedValue({});

    const response = await POST(
      createUploadRequest(imageFile()),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(setRealtimeDatabaseValue).not.toHaveBeenCalled();
  });

  it("rejects unsupported file types without writing to Firebase", async () => {
    const response = await POST(
      createUploadRequest(imageFile(1, "text/plain")),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Unsupported file type. Use JPG, PNG, WEBP, GIF or SVG.",
    });
    expect(setRealtimeDatabaseValue).not.toHaveBeenCalled();
  });

  it("accepts an image at the 5 MiB limit and stores it in the requested folder", async () => {
    const response = await POST(
      createUploadRequest(imageFile(5 * 1024 * 1024), "team photos"),
    );

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result).toMatchObject({
      url: expect.stringMatching(/^\/api\/media\?path=/),
      name: expect.stringMatching(/^\d+-test-id$/),
      path: expect.stringMatching(/^uploads\/teamphotos\/\d+-test-id$/),
    });
    expect(setRealtimeDatabaseValue).toHaveBeenCalledWith(
      expect.stringMatching(/^uploads\/teamphotos\/\d+-test-id$/),
      expect.objectContaining({
        contentType: "image/jpeg",
        size: 5 * 1024 * 1024,
        dataUrl: expect.stringMatching(/^data:image\/jpeg;base64,/),
      }),
    );
  });

  it("rejects files above 5 MiB with the actual limit in its message", async () => {
    const response = await POST(
      createUploadRequest(imageFile(5 * 1024 * 1024 + 1)),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "File too large (max 5 MB).",
    });
    expect(setRealtimeDatabaseValue).not.toHaveBeenCalled();
  });

  it("returns a logged server error when Firebase storage fails", async () => {
    const storageError = new Error("Firebase unavailable");
    setRealtimeDatabaseValue.mockRejectedValue(storageError);
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(
      createUploadRequest(imageFile()),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Photo upload failed. Please try again.",
    });
    expect(errorLog).toHaveBeenCalledWith(
      "Admin photo upload failed:",
      storageError,
    );
  });
});
