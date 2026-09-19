import { LoginForm } from "@/app/admin/login/login-form";
import { BrandLogo } from "@/components/brand/logo";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session.adminId || session.adminUid) redirect("/admin/dashboard");
  return (
    <main className="grid min-h-screen place-items-center bg-navy-950 text-paper px-5">
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <BrandLogo size={52} withWordmark inverted />
        </div>
        <div className="rounded-2xl border border-paper/10 bg-navy-900 p-7 backdrop-blur">
          <h1 className="display-font text-[26px] font-medium leading-tight tracking-[-0.02em]">
            Sign in to manage TAE.
          </h1>
          <p className="mt-2 text-[13.5px] text-ink-300/85">
            Authorised team members only.
          </p>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-[12px] text-ink-300/60">
          For access, contact the site administrator.
        </p>
      </div>
    </main>
  );
}
