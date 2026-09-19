"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { updateEnquiryStatus } from "@/lib/data";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(["new", "contacted", "in_progress", "closed"]),
});

export async function updateEnquiry(formData: FormData) {
  const parsed = Schema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;
  await updateEnquiryStatus(parsed.data.id, parsed.data.status);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}
