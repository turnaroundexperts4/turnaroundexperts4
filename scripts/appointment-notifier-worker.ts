import { processAppointmentOutboxBatch } from "@/lib/appointment-outbox";

const MAX_JOBS_PER_RUN = 5;
const REQUIRED_SECRETS = [
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_MAIL_REFRESH_TOKEN",
] as const;

type ScheduledController = { cron: string };
type ScheduledContext = { waitUntil(promise: Promise<unknown>): void };

const appointmentNotifierWorker = {
  async fetch() {
    return new Response("Not found.", { status: 404 });
  },

  scheduled(
    controller: ScheduledController,
    _env: unknown,
    context: ScheduledContext,
  ) {
    const missingSecrets = REQUIRED_SECRETS.filter(
      (name) => !process.env[name]?.trim(),
    );
    if (missingSecrets.length > 0) {
      console.error("Appointment notification cron is missing required secrets", {
        missingSecrets,
      });
      return;
    }

    context.waitUntil(
      processAppointmentOutboxBatch(MAX_JOBS_PER_RUN).then((processed) => {
        console.info("Appointment notification cron completed", {
          cron: controller.cron,
          processed,
        });
      }),
    );
  },
};

export default appointmentNotifierWorker;
