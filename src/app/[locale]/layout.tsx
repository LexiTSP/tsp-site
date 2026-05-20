import type { Metadata } from "next";
import { Fira_Code, Roboto, Roboto_Slab } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import "../globals.css";
import { TspHeader } from "@/components/TspHeader";
import { TspFooter } from "@/components/TspFooter";
import { ThemeProvider } from "@/lib/theme/context";
import { themeToCssVars } from "../../../theme.config";
import { routing } from "@/i18n/routing";

const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-fira-code",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL =
  process.env.NEXT_PUBLIC_TSP_SITE_URL ?? "https://truststandardprotocol.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  // Per-side hreflang: les pathname fra proxy-injisert request-header.
  // Strip locale-prefiks så samme normaliserte path mappes til /<path> + /en/<path>.
  const headerList = await headers();
  const rawPath = headerList.get("x-pathname") ?? "/";
  const normalizedPath =
    rawPath === "/en" || rawPath === "/no"
      ? "/"
      : rawPath.startsWith("/en/")
        ? rawPath.slice(3)
        : rawPath.startsWith("/no/")
          ? rawPath.slice(3)
          : rawPath;
  const noPath = normalizedPath === "/" ? "/" : normalizedPath;
  const enPath = normalizedPath === "/" ? "/en" : `/en${normalizedPath}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "no" ? noPath : enPath,
      languages: {
        no: noPath,
        en: enPath,
        "x-default": noPath,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "no" ? "nb_NO" : "en_US",
      alternateLocale: locale === "no" ? "en_US" : "nb_NO",
    },
  };
}

function renderDefaultThemeCss(): string {
  const vars = themeToCssVars();
  return `:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(";")}}`;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${roboto.variable} ${firaCode.variable} ${robotoSlab.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: renderDefaultThemeCss() }}
        />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <TspHeader />
            <main className="flex-1">{children}</main>
            <TspFooter />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
