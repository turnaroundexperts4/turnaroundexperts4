import {
  renderAppointmentEmail,
  type AppointmentEmailData,
} from "@/lib/appointment-email-template";

export async function sendAppointmentEmail(
  data: AppointmentEmailData,
  idempotencyKey: string,
) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.APPOINTMENT_EMAIL_FROM?.trim();
  const baseUrl = process.env.APP_BASE_URL?.trim();
  if (!apiKey) throw new Error("missing_resend_api_key");
  if (!from) throw new Error("missing_appointment_email_from");
  if (!baseUrl || !/^https:\/\//i.test(baseUrl)) {
    throw new Error("missing_or_invalid_app_base_url");
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error("invalid_appointment_email");
  }
  const message = renderAppointmentEmail(data, baseUrl);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "idempotency-key": idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: [data.email],
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`resend_http_${response.status}`);
  }
  const result = (await response.json()) as { id?: string };
  if (!result.id) throw new Error("resend_message_id_missing");
  return result.id;
}
