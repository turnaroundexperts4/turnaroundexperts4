import { afterEach, describe, expect, it, vi } from "vitest";

const { processBatch } = vi.hoisted(() => ({
  processBatch: vi.fn(),
}));

vi.mock("@/lib/appointment-outbox", () => ({
  processAppointmentOutboxBatch: processBatch,
}));

import notifierWorker from "../scripts/appointment-notifier-worker";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("appointment notification scheduled worker", () => {
  it("leaves the outbox untouched until all provider secrets are configured", () => {
    for (const name of [
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_PRIVATE_KEY",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_REFRESH_TOKEN",
      "GOOGLE_MAIL_REFRESH_TOKEN",
    ]) {
      vi.stubEnv(name, "");
    }
    const waitUntil = vi.fn();
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});

    notifierWorker.scheduled(
      { cron: "* * * * *" },
      {},
      { waitUntil },
    );

    expect(processBatch).not.toHaveBeenCalled();
    expect(waitUntil).not.toHaveBeenCalled();
    expect(errorLog).toHaveBeenCalledWith(
      "Appointment notification cron is missing required secrets",
      expect.objectContaining({
        missingSecrets: expect.arrayContaining([
          "FIREBASE_PRIVATE_KEY",
          "GOOGLE_MAIL_REFRESH_TOKEN",
        ]),
      }),
    );
    errorLog.mockRestore();
  });

  it("runs a bounded outbox batch and keeps it alive until completion", async () => {
    for (const name of [
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_PRIVATE_KEY",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_REFRESH_TOKEN",
      "GOOGLE_MAIL_REFRESH_TOKEN",
    ]) {
      vi.stubEnv(name, "configured");
    }
    processBatch.mockResolvedValue(3);
    const waitUntil = vi.fn();

    notifierWorker.scheduled(
      { cron: "* * * * *" },
      {},
      { waitUntil },
    );

    expect(processBatch).toHaveBeenCalledWith(5);
    expect(waitUntil).toHaveBeenCalledOnce();
    await waitUntil.mock.calls[0][0];
  });

  it("does not hide outbox failures from the Worker runtime", async () => {
    for (const name of [
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_PRIVATE_KEY",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_REFRESH_TOKEN",
      "GOOGLE_MAIL_REFRESH_TOKEN",
    ]) {
      vi.stubEnv(name, "configured");
    }
    const failure = new Error("outbox unavailable");
    processBatch.mockRejectedValue(failure);
    const waitUntil = vi.fn();

    notifierWorker.scheduled(
      { cron: "* * * * *" },
      {},
      { waitUntil },
    );

    await expect(waitUntil.mock.calls[0][0]).rejects.toBe(failure);
  });
});
