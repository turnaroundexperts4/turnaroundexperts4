import { describe, expect, it, vi } from "vitest";
import { resolveAdminLogin } from "@/app/admin/login/actions";

describe("admin login fallback", () => {
  it("uses Firebase success without calling PostgreSQL", async () => {
    const legacy = vi.fn();
    const result = await resolveAdminLogin(
      { status: "authenticated", uid: "firebase-1", email: "a@example.com", name: "A" },
      legacy,
    );
    expect(result?.adminUid).toBe("firebase-1");
    expect(legacy).not.toHaveBeenCalled();
  });

  it("denies Firebase wrong password without calling PostgreSQL", async () => {
    const legacy = vi.fn();
    const result = await resolveAdminLogin({ status: "invalid_credentials" }, legacy);
    expect(result).toBeNull();
    expect(legacy).not.toHaveBeenCalled();
  });

  it("uses PostgreSQL only when Firebase is unavailable", async () => {
    const legacy = vi.fn().mockResolvedValue({
      id: 7,
      email: "legacy@example.com",
      name: "Legacy",
    });
    const result = await resolveAdminLogin(
      { status: "service_unavailable", reason: "timeout" },
      legacy,
    );
    expect(result?.adminId).toBe(7);
    expect(legacy).toHaveBeenCalledOnce();
  });

  it("denies when the PostgreSQL fallback also fails", async () => {
    const legacy = vi.fn().mockResolvedValue(null);
    const result = await resolveAdminLogin(
      { status: "service_unavailable", reason: "timeout" },
      legacy,
    );
    expect(result).toBeNull();
    expect(legacy).toHaveBeenCalledOnce();
  });
});
