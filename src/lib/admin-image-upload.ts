"use client";

const UPLOAD_TIMEOUT_MS = 90_000;

type UploadResponse = {
  error?: unknown;
  url?: unknown;
};

function isUploadResponse(value: unknown): value is UploadResponse {
  return Boolean(value && typeof value === "object");
}

export async function uploadAdminImage(
  file: File,
  folder: "blog" | "founders" | "portfolio" | "team",
): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
    });
    const payload: unknown = await response.json().catch(() => null);
    const result = isUploadResponse(payload) ? payload : null;

    if (!response.ok) {
      throw new Error(
        typeof result?.error === "string"
          ? result.error
          : `Photo upload failed (HTTP ${response.status}).`,
      );
    }
    if (typeof result?.url !== "string") {
      throw new Error("The photo upload returned an invalid response.");
    }
    return result.url;
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error("Photo upload timed out. Please check your connection and try again.");
    }
    throw error;
  }
}
