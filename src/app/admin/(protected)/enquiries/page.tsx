import { listEnquiries } from "@/lib/data";
import { EnquiriesClient } from "@/app/admin/(protected)/enquiries/client";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const enquiries = await listEnquiries();
  const data = enquiries.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone,
    company: e.company,
    service: e.service,
    message: e.message,
    status: e.status,
    createdAt: formatDateTime(e.createdAt),
  }));
  return <EnquiriesClient initial={data} />;
}
