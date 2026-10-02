const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { spawnSync } = require("node:child_process");

const firebaseVariables = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
];
const requiredFirebaseVariables = firebaseVariables.slice(0, -1);
const wranglerPath = resolve(__dirname, "../wrangler.jsonc");
const wranglerConfig = JSON.parse(readFileSync(wranglerPath, "utf8"));
const buildEnvironment = { ...process.env };

for (const name of firebaseVariables) {
  if (buildEnvironment[name]) continue;

  const value = wranglerConfig.vars?.[name];
  if (typeof value === "string" && value) {
    buildEnvironment[name] = value;
  }
}

const missingVariables = requiredFirebaseVariables.filter(
  (name) => !buildEnvironment[name],
);
if (missingVariables.length > 0) {
  console.error(
    `Missing required Firebase build variables: ${missingVariables.join(", ")}`,
  );
  process.exit(1);
}

const nextCliPath = require.resolve("next/dist/bin/next");
const result = spawnSync(
  process.execPath,
  [nextCliPath, "build"],
  { env: buildEnvironment, stdio: "inherit" },
);

if (result.error) {
  console.error("Failed to start the Next.js production build:", result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
