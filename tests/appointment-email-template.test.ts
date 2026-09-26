import { describe, expect, it } from "vitest";
import { renderAppointmentEmail } from "../src/lib/appointment-email-template";

const baseData = {
  eventType: "booking_received",
  reference: "TAE-AB12-123456",
  customerName: "Taylor <script>alert(1)</script>",
  email: "taylor@example.com",
  serviceTitle: "Planning & strategy",
  requestedDate: "2026-06-16",
  requestedTime: "09:30",
  durationMinutes: 45,
  status: "pending",
  googleMeetLink: "https://meet.google.com/abc-defg-hij",
  cancellationReason: null,
  previousDate: null,
  previousTime: null,
  proposedDate: null,
  proposedTime: null,
};

describe("renderAppointmentEmail", () => {
  it("marks booking as a request and omits Meet until approval", () => {
    const email = renderAppointmentEmail(baseData, "https://turnaroundexperts.info");

    expect(email.subject).toBe("We received your appointment request");
    expect(email.html).toContain("It is not confirmed yet.");
    expect(email.html).not.toContain("Join on Google Meet");
    expect(email.text).not.toContain("Google Meet:");
  });

  it("escapes user-provided content and includes an approved Meet link", () => {
    const email = renderAppointmentEmail(
      { ...baseData, eventType: "approved", status: "approved" },
      "https://turnaroundexperts.info",
    );

    expect(email.html).toContain("Taylor &lt;script&gt;alert(1)&lt;/script&gt;");
    expect(email.html).not.toContain("<script>alert(1)</script>");
    expect(email.html).toContain("Join on Google Meet");
    expect(email.text).toContain("Time: 9:30 am IST (Asia/Kolkata)");
    expect(email.text).toContain("Duration: 45 minutes");
  });

  it("does not include a meeting link in cancellation or proposal messages", () => {
    const cancelled = renderAppointmentEmail(
      {
        ...baseData,
        eventType: "cancelled",
        status: "cancelled",
        cancellationReason: "Schedule change",
      },
      "https://turnaroundexperts.info",
    );
    const proposed = renderAppointmentEmail(
      {
        ...baseData,
        eventType: "reschedule_proposed",
        status: "rescheduled",
        proposedDate: "2026-06-18",
        proposedTime: "11:00",
      },
      "https://turnaroundexperts.info",
    );

    expect(cancelled.html).toContain("Schedule change");
    expect(cancelled.html).not.toContain("Join on Google Meet");
    expect(proposed.html).toContain("Proposed new time");
    expect(proposed.text).toContain("Proposed new time: Thursday, 18 June 2026");
    expect(proposed.html).not.toContain("Join on Google Meet");
  });
});
