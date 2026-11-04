import { faqs, site } from "@/config/site";

/**
 * Structured data. Emitted only when indexing is enabled AND a real agency name is set,
 * so placeholders never reach search engines. Deliberately no LocalBusiness/address,
 * ratings or review markup (none supplied/verified).
 */
export function JsonLd() {
  if (process.env.ALLOW_INDEXING !== "true" || site.agencyName.startsWith("[")) return null;
  const data = [
    { "@context": "https://schema.org", "@type": "WebSite", name: site.agencyName, url: site.siteUrl, inLanguage: "en-AU" },
    {
      "@context": "https://schema.org", "@type": "Service", name: "Debt recovery services",
      serviceType: "Commercial and consumer debt recovery", areaServed: { "@type": "Country", name: "Australia" },
      provider: { "@type": "Organization", name: site.agencyName, url: site.siteUrl },
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
