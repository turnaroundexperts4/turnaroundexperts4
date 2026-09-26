import { createHash } from "node:crypto";
import {
  renderAppointmentEmail,
  type AppointmentEmailData,
} from "@/lib/appointment-email-template";

const SENDER_EMAIL = "turnaroundexpertshp@gmail.com";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`missing_${name.toLowerCase()}`);
  return value;
}

async function getMailAccessToken() {
  const body = new URLSearchParams({
    client_id: requiredEnv("GOOGLE_CLIENT_ID"),
    client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
    refresh_token: requiredEnv("GOOGLE_MAIL_REFRESH_TOKEN"),
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
        : `google_mail_token_http_${response.status}`,
    );
  }
  const result = (await response.json()) as { access_token?: string };
  if (!result.access_token) throw new Error("google_mail_access_token_missing");
  return result.access_token;
}

function base64Lines(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/.{1,76}/g, "$&\r\n")
    .trimEnd();
}

function createRawMessage(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  idempotencyKey: string;
  messageDomain: string;
}) {
  const boundary = `tae_${createHash("sha256")
    .update(input.idempotencyKey)
    .digest("hex")
    .slice(0, 32)}`;
  const messageId = createHash("sha256")
    .update(input.idempotencyKey)
    .digest("hex");
  const encodedSubject = `=?UTF-8?B?${Buffer.from(input.subject, "utf8").toString("base64")}?=`;
  const parts = [
    `From: TurnAround Experts <${SENDER_EMAIL}>`,
    `To: ${input.to}`,
    `Subject: ${encodedSubject}`,
    `Message-ID: <${messageId}@${input.messageDomain}>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    base64Lines(input.text),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    base64Lines(input.html),
    `--${boundary}--`,
    "",
  ];
  return Buffer.from(parts.join("\r\n"), "utf8").toString("base64url");
}

export async function sendAppointmentEmail(
  data: AppointmentEmailData,
  idempotencyKey: string,
) {
  const baseUrl = process.env.APP_BASE_URL?.trim();
  if (!baseUrl || !/^https:\/\//i.test(baseUrl)) {
    throw new Error("missing_or_invalid_app_base_url");
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error("invalid_appointment_email");
  }
  const message = renderAppointmentEmail(data, baseUrl);
  const accessToken = await getMailAccessToken();
  const raw = createRawMessage({
    to: data.email,
    subject: message.subject,
    text: message.text,
    html: message.html,
    idempotencyKey,
    messageDomain: new URL(baseUrl).hostname,
  });
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        authorization: "Bearer ".concat(accessToken),
        "content-type": "application/json",
      },
      body: JSON.stringify({ raw }),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error(`google_mail_http_${response.status}`);
  }
  const result = (await response.json()) as { id?: string };
  if (!result.id) throw new Error("google_mail_message_id_missing");
  return result.id;
}
