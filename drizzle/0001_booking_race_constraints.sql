-- Booking uniqueness is enforced by the database, not by a prior availability read.
-- uid is intentionally nullable so existing appointment rows remain migratable.
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "uid" varchar(200);

CREATE UNIQUE INDEX IF NOT EXISTS "appointments_active_uid_unique"
  ON "appointments" ("uid")
  WHERE "status" IN ('pending', 'approved', 'rescheduled') AND "uid" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "appointments_active_slot_unique"
  ON "appointments" ("requested_date", "requested_time")
  WHERE "status" IN ('pending', 'approved', 'rescheduled');
