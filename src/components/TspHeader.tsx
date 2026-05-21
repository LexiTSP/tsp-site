"use client";

import { useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, ArrowRight, BookOpen, ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function TspHeader() {
  const pathname = usePathname();
  const t = useTranslations("header");
  const locale = useLocale();
  const isNo = locale === "no";
  const copy = isNo ? NAV_COPY.no : NAV_COPY.en;
  const normalizedPathname = pathname.replace(/^\/(en|no)(?=\/|$)/, "") || "/";
  const nav = copy.nav;
  const exploreDetailsRef = useRef<HTMLDetailsElement>(null);
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);
  const closeMenus = () => {
    if (exploreDetailsRef.current) exploreDetailsRef.current.open = false;
    if (mobileDetailsRef.current) mobileDetailsRef.current.open = false;
  };

  const headerClass = "border-border bg-white/90 text-ink shadow-[0_1px_0_rgba(17,24,39,0.04)]";
  const mutedClass = "text-muted";
  const linkBase = "text-muted hover:border-ink/20 hover:bg-ink hover:text-white";
  const activeClass = "border-ink/25 bg-ink text-white";

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${headerClass}`}>
      <div className="tsp-container flex items-center justify-between h-14">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-ink no-underline hover:text-accent-dark"
        >
          <span
            className="tsp-live-dot"
            aria-label="Spec live (alpha)"
            role="img"
          />
          <span className="text-[1.05rem] font-semibold tracking-tight">LexiTSP</span>
          <span className={`hidden font-mono text-xs sm:inline ${mutedClass}`}>
            Trust Standard Protocol
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm lg:flex">
          <details ref={exploreDetailsRef} className="tsp-nav-details group relative">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 border border-transparent px-3 py-1.5 text-sm font-semibold text-muted transition-all duration-200 hover:border-ink/20 hover:bg-ink hover:text-white group-open:border-ink group-open:bg-ink group-open:text-white group-open:shadow-[0_14px_34px_rgba(17,24,39,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70">
              {copy.explore}
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="absolute left-1/2 top-full z-50 w-[760px] -translate-x-1/2 pt-3">
              <div className="overflow-hidden border border-ink bg-white shadow-[0_34px_95px_rgba(17,24,39,0.24)]">
                <div className="grid border-b border-white/10 bg-ink text-white lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
                    <div className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{copy.explorePanel.label}</div>
                    <div className="mt-3 text-xl font-semibold leading-tight">{copy.explorePanel.title}</div>
                    <p className="mt-3 text-sm leading-6 text-white/70">{copy.explorePanel.body}</p>
                  </div>
                  <div className="grid content-between gap-4 p-5">
                    <div className="grid grid-cols-3 gap-px border border-white/12 bg-white/12 font-mono text-[0.65rem] uppercase tracking-[0.13em] text-white/65">
                      <span className="bg-ink/80 px-3 py-2">Output</span>
                      <span className="bg-ink/80 px-3 py-2">Proof</span>
                      <span className="bg-ink/80 px-3 py-2">Review</span>
                    </div>
                    <Link href="/#scenarios" onClick={closeMenus}
                      className="group/link inline-flex items-center justify-between border border-accent bg-accent px-4 py-3 text-sm font-bold text-ink no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D97706] hover:bg-[#F59E0B]">
                      {copy.explorePanel.cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
                <div className="grid gap-3 bg-paper p-3">
                  {copy.exploreLinks.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenus}
                        className="group/item relative grid grid-cols-[auto_1fr_auto] items-start gap-3 overflow-hidden border border-border bg-white p-4 text-ink no-underline shadow-[0_10px_30px_rgba(17,24,39,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/55 hover:shadow-[0_18px_48px_rgba(17,24,39,0.12)]"
                      >
                        <span className="absolute inset-y-0 left-0 w-1 bg-accent opacity-0 transition-opacity duration-200 group-hover/item:opacity-100" />
                        <span className={cn("flex h-11 w-11 items-center justify-center border transition-all duration-200 group-hover/item:border-accent group-hover/item:bg-accent group-hover/item:text-ink", item.tone)}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="mb-1 block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-muted">0{index + 1}</span>
                          <span className="block font-semibold">{item.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-muted">{item.desc}</span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 text-accent-dark opacity-0 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </details>
          {nav.map((item) => {
            const active = normalizedPathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className={cn(
                  "border border-transparent px-3 py-1.5 font-medium no-underline transition-colors",
                  active ? activeClass : linkBase,
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 text-sm lg:flex">
          <span className="mr-1">
            <LocaleSwitcher />
          </span>
          <Link
            href="/verify"
            className={cn(
              "inline-flex items-center gap-2 border px-4 py-2 text-sm font-bold no-underline transition-all duration-200",
              "border-accent bg-accent text-ink shadow-[0_12px_30px_rgba(242,184,75,0.24)] hover:-translate-y-0.5 hover:border-[#D97706] hover:bg-[#F59E0B] hover:text-ink",
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            {t("verify")}
          </Link>
        </div>

        <details ref={mobileDetailsRef} className="tsp-mobile-menu-details lg:hidden">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
              "border-border bg-elevated text-ink hover:border-accent/50 hover:bg-accent/10",
            )}
            aria-label={t("menu")}
          >
            <Menu className="tsp-menu-icon-open h-5 w-5" />
            <X className="tsp-menu-icon-close hidden h-5 w-5" />
          </summary>

          <div
            className={cn(
              "fixed inset-x-0 top-14 border-t shadow-[0_24px_80px_rgba(0,0,0,0.22)]",
              "border-border bg-white text-ink",
            )}
          >
            <nav className="tsp-container flex flex-col gap-2 py-4">
              <div className="border border-border bg-paper p-3">
                <div className="font-mono text-xs uppercase tracking-[0.12em] text-accent-dark">{copy.explorePanel.label}</div>
                <div className="mt-1 text-sm font-semibold text-ink">{copy.explorePanel.title}</div>
                <Link
                  href="/#scenarios"
                  onClick={closeMenus}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent-dark no-underline"
                >
                  {copy.explorePanel.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className={cn(
                    "border px-3 py-3 text-sm font-semibold no-underline",
                    normalizedPathname === item.href ? activeClass : `border-transparent ${linkBase}`,
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
                <LocaleSwitcher />
                <Link
                  href="/verify"
                  onClick={closeMenus}
                  className={cn(
                    "inline-flex items-center gap-2 border px-4 py-2 text-sm font-bold no-underline",
                    "border-accent bg-accent text-ink hover:border-[#D97706] hover:bg-[#F59E0B]",
                  )}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {t("verify")}
                </Link>
              </div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

const NAV_COPY = {
  en: {
    explore: "Problems",
    explorePanel: {
      label: "Before vs TSP",
      title: "The painful question is always asked later.",
      body: "Was this exact output edited, sourced, reviewed, and signed? If the only answer is a dashboard, trust gets expensive.",
      cta: "See relatable cases",
    },
    exploreLinks: [
      { href: "/#scenarios", label: "Pain points", desc: "Screenshots, disputes, audits, and incident reconstruction.", icon: AlertTriangle, tone: "border-danger/30 bg-danger/10 text-danger" },
      { href: "/verify", label: "Proof loop", desc: "Load a signed receipt, tamper with it, verify failure.", icon: ShieldCheck, tone: "border-verify/30 bg-verify/10 text-verify" },
      { href: "/docs", label: "Implement", desc: "Wrap one output with the SDK and manifest.", icon: BookOpen, tone: "border-accent/40 bg-accent/[0.12] text-accent-dark" },
    ],
    nav: [
      { href: "/docs", label: "Docs" },
      { href: "/spec", label: "Spec" },
      { href: "/kontakt", label: "Contact" },
    ],
  },
  no: {
    explore: "Problemer",
    explorePanel: {
      label: "Før vs TSP",
      title: "Det vanskelige spørsmålet kommer alltid senere.",
      body: "Ble akkurat dette svaret endret, kildebundet, vurdert og signert? Hvis svaret bare er et dashboard, blir tillit dyrt.",
      cta: "Se gjenkjennelige case",
    },
    exploreLinks: [
      { href: "/#scenarios", label: "Problemområder", desc: "Skjermbilder, tvister, audit og hendelsesrekonstruksjon.", icon: AlertTriangle, tone: "border-danger/30 bg-danger/10 text-danger" },
      { href: "/verify", label: "Bevisløkken", desc: "Last signert kvittering, manipuler den, se verifisering feile.", icon: ShieldCheck, tone: "border-verify/30 bg-verify/10 text-verify" },
      { href: "/docs", label: "Implementer", desc: "Pakk inn ett output med SDK og manifest.", icon: BookOpen, tone: "border-accent/40 bg-accent/[0.12] text-accent-dark" },
    ],
    nav: [
      { href: "/docs", label: "Docs" },
      { href: "/spec", label: "Spec" },
      { href: "/kontakt", label: "Kontakt" },
    ],
  },
};
