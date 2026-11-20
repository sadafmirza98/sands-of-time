import type { MetadataRoute } from "next";
import { wedding } from "@/config/wedding";
import { siteUrl } from "@/lib/site";

/** Indexing is disabled by default (private invitation): disallow all crawling. */
export default function robots(): MetadataRoute.Robots {
  if (!wedding.site.indexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" }, host: siteUrl };
}
