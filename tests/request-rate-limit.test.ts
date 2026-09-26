import { describe, expect, it } from "vitest";
import { checkRequestRateLimit } from "@/lib/request-rate-limit";

describe("request rate limiter", () => {
  it("allows requests under the configured limit and rejects the next one", () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    expect(checkRequestRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
    expect(checkRequestRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
    const blocked = checkRequestRateLimit(key, { limit: 2, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});
