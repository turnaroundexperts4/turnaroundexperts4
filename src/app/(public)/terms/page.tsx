import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal-pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="Standard terms for using the TurnAround Experts public website."
      backHref="/"
      backLabel="Home"
      sections={[
        {
          heading: "Use of this website",
          body: "Content on this website is for general information. We may update or remove pages without notice.",
        },
        {
          heading: "Intellectual property",
          body: "Unless otherwise noted, all content, branding and code on this site is the property of TurnAround Experts.",
        },
        {
          heading: "Engagement terms",
          body: "Specific service engagements are governed by separate written agreements issued at the time of engagement.",
        },
        {
          heading: "Liability",
          body: "We are not liable for losses arising from use of this website beyond what is required by applicable law.",
        },
      ]}
    />
  );
}
