import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["no", "en"],
  defaultLocale: "no",
  // Norske URL-er beholdes uendret (/risk, /spec). Engelsk får prefix (/en/risk).
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
