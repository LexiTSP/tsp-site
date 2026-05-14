import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_TSP_SITE_URL ?? "https://truststandardprotocol.org";

const ROUTES = [
  "",
  "/eu-ai-act",
  "/eu-ai-act/article-9",
  "/eu-ai-act/article-12",
  "/eu-ai-act/article-13",
  "/eu-ai-act/article-14",
  "/eu-ai-act/article-15",
  "/eu-ai-act/article-17",
  "/iso-42001",
  "/playground",
  "/docs",
  "/spec",
  "/verify",
  "/kontakt",
  "/priser",
  "/personvern",
  "/whitepaper",
  "/endringer",
  "/sammenligning",
  "/core",
  "/risk",
  "/risk/preview",
  "/oversight",
  "/evidence",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.flatMap((path) => {
    const noUrl = `${SITE_URL}${path}`;
    const enUrl = `${SITE_URL}/en${path}`;
    const priority = path === "" ? 1 : path.includes("eu-ai-act") ? 0.8 : 0.6;
    const changeFrequency = path === "" ? "weekly" as const : "monthly" as const;
    const alternates = {
      languages: {
        no: noUrl,
        en: enUrl,
        "x-default": noUrl,
      },
    };

    return [
      {
        url: noUrl,
        lastModified: now,
        changeFrequency,
        priority,
        alternates,
      },
      {
        url: enUrl,
        lastModified: now,
        changeFrequency,
        priority: priority * 0.9,
        alternates,
      },
    ];
  });
}
