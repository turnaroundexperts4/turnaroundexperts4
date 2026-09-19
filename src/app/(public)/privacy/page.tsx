import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal-pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How TurnAround Experts collects, uses and protects information shared with us through this website."
      backHref="/"
      backLabel="Home"
      sections={[
        {
          heading: "Information we collect",
          body: "We collect information you provide directly through forms on this site — including your name, contact details, business information and any message you submit. We also receive technical information (IP, browser, device) when you browse the site.",
        },
        {
          heading: "How we use information",
          body: "Information is used to respond to enquiries, deliver requested services, schedule appointments and improve the site. We do not sell personal information to third parties.",
        },
        {
          heading: "Where data is stored",
          body: "This website currently uses a managed database for application data (similar in protection to enterprise SaaS). If you have questions about residency or wish to request deletion of your data, please contact us.",
        },
        {
          heading: "Your rights",
          body: "You may request access, correction or deletion of your data at any time by emailing turnaroundexperts4@gmail.com.",
        },
      ]}
    />
  );
}
