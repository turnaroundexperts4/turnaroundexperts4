import { getSetting } from "@/lib/data";
import { SettingsAdmin } from "@/app/admin/(protected)/settings/client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [company, social, seo, booking] = await Promise.all([
    getSetting("company", {
      name: "TurnAround Experts",
      short: "TAE",
      tagline: "Turning Challenges into Profits",
      phone: "+91 9512384715",
      email: "turnaroundexperts4@gmail.com",
      address: "Palanpur, Banaskantha, Gujarat, India",
      website: "https://turnaroundexperts.info",
      udyam: "UDYAM-GJ-04-0064063",
    }),
    getSetting("social", {
      linkedin: "",
      instagram: "",
      twitter: "",
      facebook: "",
    }),
    getSetting("seo", {
      title: "TurnAround Experts — Turning Challenges into Profits",
      description:
        "TAE helps businesses across India with technology, digital services and consulting.",
      keywords: [] as string[],
    }),
    getSetting("booking", { minLeadDays: 1, maxLeadDays: 60 }),
  ]);

  return (
    <SettingsAdmin
      company={company as Record<string, string>}
      social={social as Record<string, string>}
      seo={{
        ...(seo as { title: string; description: string; keywords: string[] }),
        keywords: ((seo as { keywords?: string[] }).keywords ?? []).join(", "),
      }}
      booking={booking as { minLeadDays: number; maxLeadDays: number }}
    />
  );
}
