import type { ReactNode } from "react";
import { PublicNav } from "@/components/public/site-shell";
import { SiteFooter } from "@/components/public/site-footer";
import { getSetting } from "@/lib/data";

export const dynamic = "force-dynamic";

type Company = {
  name: string;
  short: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  udyam?: string;
};
type Social = {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
};

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [company, social] = await Promise.all([
    getSetting<Company>("company", {
      name: "TurnAround Experts",
      short: "TAE",
      tagline: "Turning Challenges into Profits",
      phone: "+91 9512384715",
      email: "turnaroundexperts4@gmail.com",
      address: "Palanpur, Banaskantha, Gujarat, India",
      website: "https://turnaroundexperts.info",
      udyam: "UDYAM-GJ-04-0064063",
    }),
    getSetting<Social>("social", {
      linkedin: "https://www.linkedin.com/",
    }),
  ]);

  return (
    <>
      <PublicNav />
      <main className="min-h-screen pt-20">{children}</main>
      <SiteFooter company={company} social={social} />
    </>
  );
}
