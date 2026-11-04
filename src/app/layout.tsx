import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/config/site";
import { Analytics } from "@/components/Analytics";

const indexable = process.env.ALLOW_INDEXING === "true";
const title = "Debt Recovery Australia | Commercial & Consumer Debt Recovery";
const description = `Need help with overdue invoices or outstanding debts? Discuss commercial and consumer debt recovery options with ${site.agencyName}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title,
  description,
  keywords: ["debt recovery Australia", "commercial debt recovery", "consumer debt recovery", "debt collection services", "recover unpaid invoices", "construction debt recovery", "debt recovery for tradies", "unpaid invoices Australia"],
  alternates: { canonical: "/" },
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: "website", locale: "en_AU", title, description, siteName: site.agencyName, url: "/" },
  twitter: { card: "summary_large_image", title, description },
};
export const viewport: Viewport = { themeColor: "#050705", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-navy">Skip to content</a>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
