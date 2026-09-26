import { createHash } from "node:crypto";

const TIME_ZONE = "Asia/Kolkata";

type CalendarEvent = {
  id: string;
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: { entryPointType?: string; uri?: string }[];
  };
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`missing_${name.toLowerCase()}`);
  return value;
}

async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: requiredEnv("GOOGLE_CLIENT_ID"),
    client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
    refresh_token: requiredEnv("GOOGLE_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) {
    const result = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(
      response.status === 400 && result.error === "invalid_grant"
        ? "google_refresh_token_expired"
        : `google_token_http_${response.status}`,
    );
  }
  const result = (await response.json()) as { access_token?: string };
  if (!result.access_token) throw new Error("google_access_token_missing");
  return result.access_token;
}

function eventId(reference: string) {
  return `tae${createHash("sha256").update(reference).digest("hex").slice(0, 40)}`;
}

function conferenceRequestId(reference: string) {
  return createHash("sha256")
    .update(`tae-meet:${reference}`)
    .digest("hex")
    .slice(0, 32);
}

function toEndDateTime(date: string, time: string, durationMinutes: number) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const end = new Date(Date.UTC(year, month - 1, day, hour, minute + durationMinutes));
  const endDate = `${end.getUTCFullYear()}-${String(end.getUTCMonth() + 1).padStart(2, "0")}-${String(end.getUTCDate()).padStart(2, "0")}`;
  const endTime = `${String(end.getUTCHours()).padStart(2, "0")}:${String(end.getUTCMinutes()).padStart(2, "0")}:00`;
  return `${endDate}T${endTime}`;
}

function meetingUrl(event: CalendarEvent) {
  const url =
    event.hangoutLink ??
    event.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video",
    )?.uri;
  if (!url || !/^https:\/\/meet\.google\.com\/[a-z-]+$/i.test(url)) {
    throw new Error("google_meet_link_not_ready");
  }
  return url;
}

export async function ensureGoogleMeeting(input: {
  reference: string;
  customerName: string;
  email: string;
  requestedDate: string;
  requestedTime: string;
  durationMinutes: number;
}) {
  const token = await getAccessToken();
  const calendar = encodeURIComponent(
    process.env.GOOGLE_CALENDAR_ID?.trim() || "primary",
  );
  const id = eventId(input.reference);
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events/${id}?conferenceDataVersion=1`;
  const headers = {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };
  const existingResponse = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  const start = {
    dateTime: `${input.requestedDate}T${input.requestedTime}:00`,
    timeZone: TIME_ZONE,
  };
  const end = {
    dateTime: toEndDateTime(
      input.requestedDate,
      input.requestedTime,
      input.durationMinutes,
    ),
    timeZone: TIME_ZONE,
  };
  const conferenceData = {
    createRequest: { requestId: conferenceRequestId(input.reference) },
  };

  let event: CalendarEvent;
  if (existingResponse.ok) {
    const existing = (await existingResponse.json()) as CalendarEvent;
    const updateResponse = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ start, end }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!updateResponse.ok) {
      throw new Error(`google_event_update_http_${updateResponse.status}`);
    }
    event = (await updateResponse.json()) as CalendarEvent;
    if (!event.hangoutLink && !existing.hangoutLink) {
      const conferenceResponse = await fetch(url, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ conferenceData }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      });
      if (!conferenceResponse.ok) {
        throw new Error(`google_meet_request_http_${conferenceResponse.status}`);
      }
      event = (await conferenceResponse.json()) as CalendarEvent;
    } else if (!event.hangoutLink) {
      event = existing;
    }
  } else if (existingResponse.status === 404) {
    const createResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events?conferenceDataVersion=1`,
      {
        method: "POST",
        headers: { ...headers, "x-goog-idempotency-key": id },
        body: JSON.stringify({
          id,
          summary: `TurnAround Experts consultation - ${input.customerName}`,
          description: [
            `Appointment reference: ${input.reference}`,
            `Customer email: ${input.email}`,
            "Scheduled by TurnAround Experts.",
          ].join("\n"),
          start,
          end,
          conferenceData,
          guestsCanInviteOthers: false,
          guestsCanModify: false,
          guestsCanSeeOtherGuests: false,
        }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      },
    );
    if (!createResponse.ok) {
      throw new Error(`google_event_create_http_${createResponse.status}`);
    }
    event = (await createResponse.json()) as CalendarEvent;
  } else {
    throw new Error(`google_event_lookup_http_${existingResponse.status}`);
  }
  return { googleEventId: event.id || id, googleMeetLink: meetingUrl(event) };
}

export async function cancelGoogleMeeting(googleEventId: string) {
  const token = await getAccessToken();
  const calendar = encodeURIComponent(
    process.env.GOOGLE_CALENDAR_ID?.trim() || "primary",
  );
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events/${encodeURIComponent(googleEventId)}`,
    {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    },
  );
  if (!response.ok && response.status !== 404 && response.status !== 410) {
    throw new Error(`google_event_cancel_http_${response.status}`);
  }
}
