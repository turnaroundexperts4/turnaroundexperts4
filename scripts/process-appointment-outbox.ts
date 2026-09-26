import "dotenv/config";
import { processAppointmentOutboxBatch } from "../src/lib/appointment-outbox";

async function main() {
  const processed = await processAppointmentOutboxBatch(25);
  console.info(`Appointment notification jobs processed: ${processed}`);
}

main().catch((error: unknown) => {
  const errorCode =
    error instanceof Error && /^[a-zA-Z0-9_-]{1,80}$/.test(error.name)
      ? error.name
      : "unknown";
  console.error("Appointment outbox batch failed", { errorCode });
  process.exitCode = 1;
});
