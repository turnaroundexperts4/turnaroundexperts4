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
    "TurnAround Experts (TAE) is a technology, digital services and consulting company helping businesses solve operational and growth problems across Gujarat and India.",
  metadataBase: new URL("https://turnaroundexperts.info"),
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
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink-900 antialiased">
        <UserAuthProvider>{children}</UserAuthProvider>
      </body>
    </html>
  );
}
