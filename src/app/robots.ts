import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_TSP_SITE_URL ?? "https://truststandardprotocol.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
