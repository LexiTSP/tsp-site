import { Link } from "@/i18n/navigation";
import { Package, Scale, Eye, Archive, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/**
 * ModuleLayout — felles skall for /core, /risk, /oversight, /evidence.
 *
 * Hero-header med lisens/pricing, sticky sidenav med alle moduler, og content-område.
 * Modul-navn/tagline/pricing leses fra messages.moduleLayout.modules.{slug}.
 */

type ModuleSlug = "core" | "risk" | "oversight" | "evidence";

type ModuleMeta = {
  slug: ModuleSlug;
  license: "MIT" | "Commercial" | "MIT + Commercial";
  icon: React.ComponentType<{ className?: string }>;
  accent: "brand" | "verify" | "warn";
  star?: boolean;
};

// Strukturell metadata (lisens/ikon/aksent) — disse skal IKKE oversettes.
// Tekst (name/tagline/pricing) hentes fra translations.
export const TSP_MODULE_META: ModuleMeta[] = [
  { slug: "core", license: "MIT", icon: Package, accent: "brand" },
  { slug: "risk", license: "Commercial", icon: Scale, accent: "verify", star: true },
  { slug: "oversight", license: "Commercial", icon: Eye, accent: "brand" },
  { slug: "evidence", license: "Commercial", icon: Archive, accent: "verify" },
];

interface Props {
  moduleSlug: ModuleSlug;
  children: React.ReactNode;
}

export function ModuleLayout({ moduleSlug, children }: Props) {
  const t = useTranslations("moduleLayout");
  const mod = TSP_MODULE_META.find((m) => m.slug === moduleSlug)!;
  const Icon = mod.icon;
  const name = t(`modules.${moduleSlug}.name`);
  const tagline = t(`modules.${moduleSlug}.tagline`);
  const pricing = t(`modules.${moduleSlug}.pricing`);

  const numTone =
    mod.accent === "verify"
      ? "tsp-section-num--verify"
      : mod.accent === "warn"
        ? "tsp-section-num--warn"
        : "";

  const moduleNum = String(
    TSP_MODULE_META.findIndex((m) => m.slug === moduleSlug) + 1,
  ).padStart(2, "0");

  return (
    <div>
      {/* Hero strip */}
      <section className="tsp-hero-surface border-b border-border">
        <div className="tsp-container py-12 md:py-16">
          <nav className="tsp-section-marker mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-ink no-underline">
              TSP
            </Link>
            <span className="opacity-40">·</span>
            <span className="text-ink">{name}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
            <div>
              <div className="tsp-section-eyebrow mb-5">
                <span className={cn("tsp-section-num", numTone)}>{moduleNum}</span>
                <span className="tsp-section-label">{t("tspModule")}</span>
              </div>

              <div className="flex items-start gap-4 mb-5">
                <Icon className="w-9 h-9 text-ink shrink-0 mt-1.5" />
                <h1 className="flex-1">TSP {name}</h1>
              </div>

              <p className="text-lg text-ink max-w-2xl leading-relaxed mb-6">{tagline}</p>

              <div className="flex flex-wrap items-center gap-2.5">
                {mod.star && (
                  <span className="tsp-accent-pill">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    {t("coreSku")}
                  </span>
                )}
                <span className="tsp-pill">{mod.license}</span>
                <span className="tsp-section-marker">·</span>
                <span className="tsp-section-marker">{pricing}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="tsp-container py-12">
        <div className="grid lg:grid-cols-[220px_1fr] gap-10">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="tsp-eyebrow mb-3">{t("moduleStack")}</div>
            <nav className="space-y-0">
              {TSP_MODULE_META.map((m) => {
                const MIcon = m.icon;
                const isActive = m.slug === moduleSlug;
                const mName = t(`modules.${m.slug}.name`);
                return (
                  <Link
                    key={m.slug}
                    href={`/${m.slug}`}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 text-sm transition-colors border-l-2 no-underline",
                      isActive
                        ? "border-ink text-ink font-medium bg-elevated"
                        : "border-transparent text-muted hover:text-ink hover:bg-elevated/50",
                    )}
                  >
                    <MIcon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="flex-1">{mName}</span>
                    {m.star && <span className="text-accent-dark text-xs">★</span>}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pl-3 border-l-2 border-accent">
              <div className="tsp-eyebrow tsp-accent-text mb-1.5">{t("fullStack")}</div>
              <p className="text-xs text-muted leading-relaxed mb-2">
                {t("fullStackDesc")}
              </p>
              <Link
                href="/eu-ai-act"
                className="text-xs font-medium text-ink inline-flex items-center gap-1 hover:gap-2 transition-all no-underline"
              >
                {t("fullStackCta")} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          <article className="max-w-3xl space-y-12">{children}</article>
        </div>
      </div>
    </div>
  );
}
