import type { MetadataRoute } from "next";
import { site } from "@/config/site";
export default function robots(): MetadataRoute.Robots {
  const allow = process.env.ALLOW_INDEXING === "true";
  return allow
    ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${site.siteUrl}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
