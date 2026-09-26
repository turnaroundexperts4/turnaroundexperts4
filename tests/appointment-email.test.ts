import { afterEach, describe, expect, it, vi } from "vitest";
import { sendAppointmentEmail } from "../src/lib/appointment-email";
import type { AppointmentEmailData } from "../src/lib/appointment-email-template";

const emailData: AppointmentEmailData = {
  eventType: "approved",
  reference: "TAE-AB12-123456",
  customerName: "Taylor",
  email: "taylor@example.com",
  serviceTitle: "Consultation",
  requestedDate: "2026-06-16",
  requestedTime: "09:30",
  durationMinutes: 45,
  status: "confirmed",
  googleMeetLink: "https://meet.google.com/abc-defg-hij",
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
    vi.stubEnv("APP_BASE_URL", "https://turnaroundexperts.info");
    vi.stubEnv("GOOGLE_CLIENT_ID", "client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "client-secret");
    vi.stubEnv("GOOGLE_MAIL_REFRESH_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendAppointmentEmail(emailData, "TAE-AB12-123456_1"))
      .rejects.toThrow("missing_google_mail_refresh_token");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends from the configured Gmail account and uses a stable Message-ID", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "client-secret");
    vi.stubEnv("GOOGLE_MAIL_REFRESH_TOKEN", "mail-refresh-token");
    vi.stubEnv("APP_BASE_URL", "https://turnaroundexperts.info");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ access_token: "access-token" }))
      .mockResolvedValueOnce(Response.json({ id: "email-123" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendAppointmentEmail(emailData, "TAE-AB12-123456_1"))
      .resolves.toBe("email-123");
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    );
    const request = fetchMock.mock.calls[1]?.[1];
    expect(new Headers(request?.headers).get("authorization")).toBe("Bearer access-token");
    const raw = (
      JSON.parse(String(request?.body)) as { raw: string }
    ).raw;
    const mime = Buffer.from(raw, "base64url").toString("utf8");
    expect(mime).toContain("From: TurnAround Experts <turnaroundexpertshp@gmail.com>");
    expect(mime).toContain("Message-ID:");
    const htmlEncoded = mime
      .split('Content-Type: text/html; charset="UTF-8"')[1]
      ?.split("\r\n\r\n")[1]
      ?.split("\r\n--")[0];
    expect(htmlEncoded).toBeDefined();
    expect(
      Buffer.from(htmlEncoded?.replace(/\s/g, "") ?? "", "base64").toString("utf8"),
    ).toContain("Join on Google Meet");
  });

  it("surfaces provider failures for outbox retry handling", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "client-secret");
    vi.stubEnv("GOOGLE_MAIL_REFRESH_TOKEN", "mail-refresh-token");
    vi.stubEnv("APP_BASE_URL", "https://turnaroundexperts.info");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(Response.json({ access_token: "access-token" }))
        .mockResolvedValueOnce(new Response(null, { status: 503 })),
    );

    await expect(sendAppointmentEmail(emailData, "TAE-AB12-123456_1"))
      .rejects.toThrow("google_mail_http_503");
  });
});
