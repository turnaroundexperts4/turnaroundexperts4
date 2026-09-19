import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/app/admin/(protected)/admin-shell";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session.adminId) redirect("/admin/login");
  return (
    <AdminShell
      name={session.name ?? "Administrator"}
      email={session.email ?? ""}
    >
      {children}
    </AdminShell>
  );
}
