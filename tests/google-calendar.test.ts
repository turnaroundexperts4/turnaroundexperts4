import { afterEach, describe, expect, it, vi } from "vitest";
import { ensureGoogleMeeting } from "../src/lib/google-calendar";

const envKeys = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_CALENDAR_ID",
] as const;

const oldEnv = Object.fromEntries(
  envKeys.map((key) => [key, process.env[key]]),
);

afterEach(() => {
  for (const key of envKeys) {
    const oldValue = oldEnv[key];
    if (oldValue === undefined) delete process.env[key];
    else process.env[key] = oldValue;
  }
  vi.unstubAllGlobals();
});

describe("ensureGoogleMeeting", () => {
  it("reuses the deterministic event when processing the same appointment again", async () => {
    process.env.GOOGLE_CLIENT_ID = "client-id";
    process.env.GOOGLE_CLIENT_SECRET = "client-secret";
    process.env.GOOGLE_REFRESH_TOKEN = "refresh-token";
    process.env.GOOGLE_CALENDAR_ID = "primary";

    const event = {
      id: "stable-event-id",
      hangoutLink: "https://meet.google.com/abc-defg-hij",
    };
    let created = false;
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("oauth2.googleapis.com/token")) {
        return Response.json({ access_token: "access-token" });
      }
      if (init?.method === "POST") {
        created = true;
        return Response.json(event);
      }
      if (init?.method === "PATCH") return Response.json(event);
      if (created) return Response.json(event);
      return new Response(null, { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const appointment = {
      reference: "TAE-AB12-123456",
      customerName: "Taylor",
      email: "taylor@example.com",
      requestedDate: "2026-06-16",
      requestedTime: "09:30",
      durationMinutes: 45,
    };

    const first = await ensureGoogleMeeting(appointment);
    const second = await ensureGoogleMeeting(appointment);

    expect(first).toEqual(second);
    expect(
      fetchMock.mock.calls.filter(
        ([url, init]) =>
          String(url).includes("calendar/v3/calendars") &&
          init?.method === "POST",
      ),
    ).toHaveLength(1);
    const getCalls = fetchMock.mock.calls.filter(
      ([url, init]) =>
        String(url).includes("calendar/v3/calendars") &&
        !init?.method,
    );
    expect(getCalls.length).toBeGreaterThan(0);
    expect(
      getCalls.every(([url]) => !String(url).includes("conferenceDataVersion")),
    ).toBe(true);
    const createCall = fetchMock.mock.calls.find(
      ([url, init]) =>
        String(url).includes("calendar/v3/calendars") &&
        init?.method === "POST",
    );
    const eventBody = JSON.parse(String(createCall?.[1]?.body)) as {
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
    };
    expect(eventBody.start).toEqual({
      dateTime: "2026-06-16T09:30:00",
      timeZone: "Asia/Kolkata",
    });
    expect(eventBody.end).toEqual({
      dateTime: "2026-06-16T10:15:00",
      timeZone: "Asia/Kolkata",
    });
    expect(
      fetchMock.mock.calls.filter(([, init]) => init?.method === "PATCH"),
    ).toHaveLength(1);
  });

  it("waits for Calendar to finish creating the conference before returning a link", async () => {
    process.env.GOOGLE_CLIENT_ID = "client-id";
    process.env.GOOGLE_CLIENT_SECRET = "client-secret";
    process.env.GOOGLE_REFRESH_TOKEN = "refresh-token";
    process.env.GOOGLE_CALENDAR_ID = "primary";

    let eventReads = 0;
    const fetchMock = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("oauth2.googleapis.com/token")) {
          return Response.json({ access_token: "access-token" });
        }
        if (init?.method === "POST") {
          return Response.json({
            id: "stable-event-id",
            conferenceData: { createRequest: { status: { statusCode: "pending" } } },
          });
        }
        if (init?.method === "PATCH") {
          return Response.json({
            id: "stable-event-id",
            conferenceData: { createRequest: { status: { statusCode: "pending" } } },
          });
        }
        if (url.includes("calendar/v3/calendars")) {
          eventReads += 1;
          if (eventReads === 1) return new Response(null, { status: 404 });
          if (eventReads < 4) {
            return Response.json({
              id: "stable-event-id",
              conferenceData: {
                createRequest: { status: { statusCode: "pending" } },
              },
            });
          }
          return Response.json({
            id: "stable-event-id",
            hangoutLink: "https://meet.google.com/abc-defg-hij",
            conferenceData: {
              createRequest: { status: { statusCode: "success" } },
            },
          });
        }
        throw new Error(`Unexpected request: ${url}`);
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      ensureGoogleMeeting({
        reference: "TAE-AB12-123456",
        customerName: "Taylor",
        email: "taylor@example.com",
        requestedDate: "2026-06-16",
        requestedTime: "09:30",
        durationMinutes: 45,
      }),
    ).resolves.toEqual({
      googleEventId: "stable-event-id",
      googleMeetLink: "https://meet.google.com/abc-defg-hij",
    });
    expect(eventReads).toBe(4);
  });

  it("surfaces Calendar API outages without claiming a meeting was created", async () => {
    process.env.GOOGLE_CLIENT_ID = "client-id";
    process.env.GOOGLE_CLIENT_SECRET = "client-secret";
    process.env.GOOGLE_REFRESH_TOKEN = "refresh-token";
    process.env.GOOGLE_CALENDAR_ID = "primary";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 503 })),
    );

    await expect(
      ensureGoogleMeeting({
        reference: "TAE-AB12-123456",
        customerName: "Taylor",
        email: "taylor@example.com",
        requestedDate: "2026-06-16",
        requestedTime: "09:30",
        durationMinutes: 45,
      }),
    ).rejects.toThrow("google_token_http_503");
  });
});
