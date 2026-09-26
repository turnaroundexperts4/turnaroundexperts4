export type AppointmentEmailData = {
  eventType: string;
  reference: string;
  customerName: string;
  email: string;
  serviceTitle: string | null;
  requestedDate: string;
  requestedTime: string;
  durationMinutes: number;
  status: string;
  googleMeetLink: string | null;
  cancellationReason: string | null;
  previousDate: string | null;
  previousTime: string | null;
  proposedDate: string | null;
  proposedTime: string | null;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function formatDate(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const local = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(local);
}

function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(Date.UTC(2000, 0, 1, hour, minute)));
}

const COPY: Record<string, { subject: string; heading: string; intro: string }> = {
  booking_received: {
    subject: "We received your appointment request",
    heading: "Request received",
    intro: "Your appointment request is with our team for review. It is not confirmed yet.",
  },
  approved: {
    subject: "Your TAE appointment is confirmed",
    heading: "Appointment confirmed",
    intro: "Your appointment has been approved. We look forward to speaking with you.",
  },
  rejected: {
    subject: "An update about your TAE appointment",
    heading: "Appointment update",
    intro: "We are unable to confirm this appointment as requested. Please contact us if you would like help finding another time.",
  },
  reschedule_proposed: {
    subject: "A new time is proposed for your TAE appointment",
    heading: "Reschedule proposed",
    intro: "Our team has proposed a different time. Your current appointment is unchanged until you accept the proposal in your account.",
  },
  rescheduled_confirmed: {
    subject: "Your TAE appointment time has changed",
    heading: "Appointment rescheduled",
    intro: "Your proposed time has been accepted and your appointment details are now updated.",
  },
  cancelled: {
    subject: "Your TAE appointment has been cancelled",
    heading: "Appointment cancelled",
    intro: "This appointment has been cancelled. Please contact us if you would like to arrange another time.",
  },
};

export function renderAppointmentEmail(
  data: AppointmentEmailData,
  baseUrl: string,
) {
  const copy = COPY[data.eventType] ?? COPY.booking_received;
  const name = escapeHtml(data.customerName);
  const reference = escapeHtml(data.reference);
  const service = escapeHtml(data.serviceTitle ?? "Consultation");
  const date = escapeHtml(formatDate(data.requestedDate, data.requestedTime));
  const time = escapeHtml(formatTime(data.requestedTime));
  const prior = data.previousDate && data.previousTime
    ? `${formatDate(data.previousDate, data.previousTime)} · ${formatTime(data.previousTime)} IST`
    : null;
  const meetLink =
    (data.eventType === "approved" ||
      data.eventType === "rescheduled_confirmed") &&
    data.googleMeetLink &&
    /^https:\/\/meet\.google\.com\/[a-z-]+$/i.test(data.googleMeetLink)
      ? data.googleMeetLink
      : null;
  const meet = meetLink
    ? `<a href="${escapeHtml(meetLink)}" style="display:inline-block;background:#15243a;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:28px;font-weight:600">Join on Google Meet</a>`
    : "";
  const meetSection = meetLink
    ? `<div style="padding:24px 0 4px;text-align:center">${meet}<p style="margin:12px 0 0;color:#667085;font-size:12px;line-height:1.5">If the button does not work, use this link:<br><a href="${escapeHtml(meetLink)}" style="color:#15243a;word-break:break-all">${escapeHtml(meetLink)}</a></p></div>`
    : "";
  const oldSlot = prior
    ? `<tr><td style="padding:8px 0;color:#667085">Previous time</td><td style="padding:8px 0;text-align:right;color:#15243a">${escapeHtml(prior)}</td></tr>`
    : "";
  const proposedSlot =
    data.eventType === "reschedule_proposed" &&
    data.proposedDate &&
    data.proposedTime
      ? `<tr><td style="padding:8px 0;color:#667085">Proposed new time</td><td style="padding:8px 0;text-align:right;color:#15243a">${escapeHtml(formatDate(data.proposedDate, data.proposedTime))} · ${escapeHtml(formatTime(data.proposedTime))} IST</td></tr>`
      : "";
  const cancellation = data.cancellationReason
    ? `<p style="margin:20px 0 0;color:#475467;line-height:1.6"><strong>Reason:</strong> ${escapeHtml(data.cancellationReason)}</p>`
    : "";
  const logo = `${baseUrl.replace(/\/$/, "")}/images/tae-logo.png`;
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head><body style="margin:0;background:#f4f2ed;color:#15243a;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(copy.intro)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f2ed;padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e7e5df;border-radius:16px;overflow:hidden"><tr><td style="padding:26px 32px;border-bottom:1px solid #eceae5"><img src="${escapeHtml(logo)}" width="172" alt="TurnAround Experts" style="display:block;width:172px;max-width:100%;height:auto"></td></tr><tr><td style="padding:32px"><p style="margin:0 0 10px;color:#667085;font-size:12px;letter-spacing:1.6px;text-transform:uppercase">Appointment ${escapeHtml(data.status)}</p><h1 style="margin:0;font-size:27px;line-height:1.25;font-weight:600;color:#15243a">${escapeHtml(copy.heading)}</h1><p style="margin:18px 0 0;color:#475467;font-size:15px;line-height:1.65">Hello ${name}, ${escapeHtml(copy.intro)}</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;background:#f8f7f4;border:1px solid #ebe9e3;border-radius:12px"><tr><td style="padding:20px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:8px 0;color:#667085">Date</td><td style="padding:8px 0;text-align:right;color:#15243a">${date}</td></tr><tr><td style="padding:8px 0;color:#667085">Time</td><td style="padding:8px 0;text-align:right;color:#15243a">${time} IST (Asia/Kolkata)</td></tr><tr><td style="padding:8px 0;color:#667085">Duration</td><td style="padding:8px 0;text-align:right;color:#15243a">${escapeHtml(String(data.durationMinutes))} minutes</td></tr>${oldSlot}${proposedSlot}<tr><td style="padding:8px 0;color:#667085">Meeting type</td><td style="padding:8px 0;text-align:right;color:#15243a">Online consultation</td></tr><tr><td style="padding:8px 0;color:#667085">Service</td><td style="padding:8px 0;text-align:right;color:#15243a">${service}</td></tr><tr><td style="padding:8px 0;color:#667085">Reference</td><td style="padding:8px 0;text-align:right;color:#15243a;font-family:monospace">${reference}</td></tr></table>${cancellation}</td></tr></table>${meetSection}<p style="margin:22px 0 0;color:#475467;font-size:14px;line-height:1.6">${data.eventType === "booking_received" ? "We will email you again when the team has reviewed your request." : "If you have questions, reply to this email or contact our team."}</p></td></tr><tr><td style="padding:22px 32px;background:#15243a;color:#ffffff"><p style="margin:0;font-size:14px;font-weight:600">TurnAround Experts</p><p style="margin:8px 0 0;color:#e6e8ec;font-size:12px;line-height:1.7">Palanpur, Banaskantha, Gujarat, India<br><a href="mailto:turnaroundexperts4@gmail.com" style="color:#ffffff">turnaroundexperts4@gmail.com</a> · +91 8401635015<br><a href="${escapeHtml(baseUrl)}" style="color:#ffffff">turnaroundexperts.info</a></p><p style="margin:14px 0 0;color:#c7ccd4;font-size:11px">This is an automated appointment update from TAE.</p></td></tr></table></td></tr></table></body></html>`;
  const text = [
    `Hello ${data.customerName},`,
    "",
    copy.intro,
    "",
    `Date: ${formatDate(data.requestedDate, data.requestedTime)}`,
    `Time: ${formatTime(data.requestedTime)} IST (Asia/Kolkata)`,
    ...(prior ? [`Previous time: ${prior}`] : []),
    `Service: ${data.serviceTitle ?? "Consultation"}`,
    `Status: ${data.status}`,
    `Reference: ${data.reference}`,
    ...(data.cancellationReason ? [`Reason: ${data.cancellationReason}`] : []),
    `Duration: ${data.durationMinutes} minutes`,
    ...(data.eventType === "reschedule_proposed" &&
    data.proposedDate &&
    data.proposedTime
      ? [
          `Proposed new time: ${formatDate(data.proposedDate, data.proposedTime)} · ${formatTime(data.proposedTime)} IST (Asia/Kolkata)`,
        ]
      : []),
    ...(meetLink ? [`Google Meet: ${meetLink}`] : []),
    "",
    "TurnAround Experts · turnaroundexperts4@gmail.com · +91 8401635015",
  ].join("\n");
  return { subject: copy.subject, html, text };
}
