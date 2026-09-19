"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { verifyAdminPassword } from "@/lib/data";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  const parsed = Schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }
  const verified = await verifyAdminPassword(
    parsed.data.email,
    parsed.data.password,
  );
  if (!verified) {
    return { error: "Invalid email or password." };
  }
  const session = await getSession();
  session.adminId = verified.id;
  session.email = verified.email;
  session.name = verified.name;
  await session.save();
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
