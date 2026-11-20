import { wedding } from "@/config/wedding";

/**
 * Canonical base URL, resolved at build/request time on the server:
 *  1. wedding.site.url (config)
 *  2. NEXT_PUBLIC_SITE_URL
 *  3. Vercel: VERCEL_PROJECT_PRODUCTION_URL, then VERCEL_URL
 *  4. Netlify: URL (primary), then DEPLOY_PRIME_URL
 *  5. http://localhost:3000
 * No custom domain is ever assumed.
 */
function resolveSiteUrl(): string {
  const withProtocol = (host: string) => (host.startsWith("http") ? host : `https://${host}`);
  const candidates = [
    wedding.site.url,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
  ];
  const found = candidates.find((c): c is string => typeof c === "string" && c.trim().length > 0);
  return (found ? withProtocol(found.trim()) : "http://localhost:3000").replace(/\/+$/, "");
}

export const siteUrl = resolveSiteUrl();
