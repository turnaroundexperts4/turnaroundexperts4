ALTER TABLE "appointments"
  ADD COLUMN IF NOT EXISTS "duration_minutes" integer NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS "google_event_id" varchar(255),
  ADD COLUMN IF NOT EXISTS "google_meet_link" varchar(1000),
  ADD COLUMN IF NOT EXISTS "meeting_status" varchar(24) NOT NULL DEFAULT 'not_required',
  ADD COLUMN IF NOT EXISTS "cancellation_reason" text,
  ADD COLUMN IF NOT EXISTS "internal_note" text,
  ADD COLUMN IF NOT EXISTS "notification_version" integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "notification_status" varchar(24) NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS "last_notification_type" varchar(40),
  ADD COLUMN IF NOT EXISTS "last_notification_error" varchar(120);

CREATE TABLE IF NOT EXISTS "appointment_notification_jobs" (
  "id" varchar(300) PRIMARY KEY,
  "appointment_id" integer NOT NULL,
  "appointment_reference" varchar(32) NOT NULL,
  "event_type" varchar(40) NOT NULL,
  "version" integer NOT NULL,
  "previous_date" varchar(10),
  "previous_time" varchar(5),
  "status" varchar(24) NOT NULL DEFAULT 'pending',
  "attempts" integer NOT NULL DEFAULT 0,
  "next_attempt_at" timestamptz NOT NULL DEFAULT now(),
  "lease_until" timestamptz,
  "last_error_code" varchar(120),
  "provider_message_id" varchar(255),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "appointment_notification_jobs_version_unique"
    UNIQUE ("appointment_reference", "version")
);

CREATE INDEX IF NOT EXISTS "appointment_notification_jobs_pending_idx"
  ON "appointment_notification_jobs" ("status", "next_attempt_at");
