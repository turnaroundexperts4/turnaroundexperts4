import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadAdminImage } from "@/lib/admin-image-upload";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("uploadAdminImage", () => {
  it("sends the requested folder and returns the uploaded media URL", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json({ url: "/api/media?path=uploads%2Ffounders%2Fphoto" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      uploadAdminImage(new File(["photo"], "photo.jpg"), "founders"),
    ).resolves.toBe("/api/media?path=uploads%2Ffounders%2Fphoto");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/upload");
    expect(options?.method).toBe("POST");
    expect(options?.body).toBeInstanceOf(FormData);
    expect(options?.signal).toBeInstanceOf(AbortSignal);
    expect((options?.body as FormData).get("folder")).toBe("founders");
  });

  it("shows the server error for rejected uploads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ error: "Photo upload failed." }, { status: 500 })),
    );

    await expect(
      uploadAdminImage(new File(["photo"], "photo.jpg"), "founders"),
    ).rejects.toThrow("Photo upload failed.");
  });

  it("reports timeout failures clearly", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new DOMException("Timed out", "TimeoutError");
      }),
    );

    await expect(
      uploadAdminImage(new File(["photo"], "photo.jpg"), "founders"),
    ).rejects.toThrow(
      "Photo upload timed out. Please check your connection and try again.",
    );
  });
});
