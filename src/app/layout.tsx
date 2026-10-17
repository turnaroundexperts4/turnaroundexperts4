import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { UserAuthProvider } from "@/components/auth/user-auth-provider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TurnAround Experts — Turning Challenges into Profits",
    template: "%s · TurnAround Experts",
  },
  description:
    "TurnAround Experts helps businesses across Gujarat and India solve operational and growth problems through technology, digital services and consulting.",
  metadataBase: new URL("https://turnaroundexperts.in"),
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "48x48" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "TurnAround Experts",
    title: "TurnAround Experts — Turning Challenges into Profits",
    description:
      "Technology, digital services and consulting for businesses that want measurable growth.",
    images: [{ url: "/images/tae-logo.png" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TurnAround Experts",
    url: "https://turnaroundexperts.in",
    logo: "https://turnaroundexperts.in/images/tae-logo.webp",
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <UserAuthProvider>{children}</UserAuthProvider>
      </body>
    </html>
  );
}
