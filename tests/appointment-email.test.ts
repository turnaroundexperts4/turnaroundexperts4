import { afterEach, describe, expect, it, vi } from "vitest";
import { sendAppointmentEmail } from "../src/lib/appointment-email";
import type { AppointmentEmailData } from "../src/lib/appointment-email-template";

const emailData: AppointmentEmailData = {
  eventType: "booking_received",
  reference: "TAE-AB12-123456",
  customerName: "Taylor",
  email: "taylor@example.com",
  serviceTitle: "Consultation",
  requestedDate: "2026-06-16",
  requestedTime: "09:30",
  durationMinutes: 45,
  status: "pending",
  googleMeetLink: null,
  cancellationReason: null,
  previousDate: null,
  previousTime: null,
  proposedDate: null,
  proposedTime: null,
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("sendAppointmentEmail", () => {
  it("requires server-side provider configuration", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("APPOINTMENT_EMAIL_FROM", "appointments@example.com");
    vi.stubEnv("APP_BASE_URL", "https://turnaroundexperts.info");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendAppointmentEmail(emailData, "TAE-AB12-123456_1"))
      .rejects.toThrow("missing_resend_api_key");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses the outbox job id as the provider idempotency key", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("APPOINTMENT_EMAIL_FROM", "appointments@example.com");
    vi.stubEnv("APP_BASE_URL", "https://turnaroundexperts.info");
    const fetchMock = vi.fn(
      async (_url: string | URL | Request, _request?: RequestInit) =>
        Response.json({ id: "email-123" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendAppointmentEmail(emailData, "TAE-AB12-123456_1"))
      .resolves.toBe("email-123");
    const request = fetchMock.mock.calls[0]?.[1];
    expect(new Headers(request?.headers).get("idempotency-key"))
      .toBe("TAE-AB12-123456_1");
  });

  it("surfaces provider failures for outbox retry handling", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("APPOINTMENT_EMAIL_FROM", "appointments@example.com");
    vi.stubEnv("APP_BASE_URL", "https://turnaroundexperts.info");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 503 })));

    await expect(sendAppointmentEmail(emailData, "TAE-AB12-123456_1"))
      .rejects.toThrow("resend_http_503");
  });
});
