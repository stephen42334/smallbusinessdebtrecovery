import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/config/site";
import { Analytics } from "@/components/Analytics";

const indexable = process.env.ALLOW_INDEXING === "true";
const title = "Builder Not Paying? Debt Recovery for NSW Tradies & Subcontractors";
const description = `Owed money by a builder or head contractor? ${site.agencyName} helps NSW tradies and subcontractors pursue unpaid invoices and progress claims. Commission-based.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title,
  description,
  keywords: ["builder not paying", "subcontractor unpaid invoice NSW", "debt recovery for tradies NSW", "construction debt recovery NSW", "security of payment NSW", "recover unpaid invoices", "unpaid progress claim", "head contractor not paying subcontractor"],
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
