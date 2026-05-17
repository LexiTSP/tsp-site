import { Link } from "@/i18n/navigation";
import { Package, Scale, Eye, Archive, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { V2BoundaryNote, V2CanonicalStrip, V2PageHero } from "./V2ProofSurface";

/**
 * ModuleLayout — felles skall for /core, /risk, /oversight, /evidence.
 *
 * Hero-header, sticky sidenav med alle moduler, og content-område.
 * Modul-navn/tagline leses fra messages.moduleLayout.modules.{slug}.
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
// Tekst (name/tagline) hentes fra translations.
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
  const locale = useLocale();
  const isEn = locale === "en";
  const mod = TSP_MODULE_META.find((m) => m.slug === moduleSlug)!;
  const name = t(`modules.${moduleSlug}.name`);
  const tagline = t(`modules.${moduleSlug}.tagline`);
  const moduleLabel = moduleSlug === "core"
    ? (isEn ? "Open protocol core" : "Åpen protokollkjerne")
    : (isEn ? "Optional operations layer" : "Valgfritt operasjonelt lag");
  const boundaryCopy = moduleSlug === "core"
    ? (isEn
      ? "Core is the protocol primitive: envelope structure, signing surface, canonicalization, hash chain, and verification. It is not a governance dashboard and does not replace legal assessment."
      : "Core er protokollprimitiven: envelope-struktur, signeringsflate, kanonisering, hash-kjede og verifikasjon. Det er ikke et governance-dashboard og erstatter ikke juridisk vurdering.")
    : (isEn
      ? "This module sits above the open protocol. It can help teams operate evidence, risk, or review workflows, but it is not required to create or verify a valid TSP receipt."
      : "Denne modulen ligger over den åpne protokollen. Den kan hjelpe team med bevis-, risiko- eller review-workflows, men kreves ikke for å lage eller verifisere en gyldig TSP-kvittering.");

  return (
    <div>
      <V2PageHero
        eyebrow={`${moduleLabel} · TSP ${name}`}
        title={
          isEn
            ? `TSP ${name}: proof-first infrastructure, not another dashboard.`
            : `TSP ${name}: bevis først, ikke enda et dashboard.`
        }
        lead={tagline}
        primaryCta={{
          href: moduleSlug === "core" ? "/verify" : "/eu-ai-act",
          label: moduleSlug === "core"
            ? (isEn ? "Verify a receipt" : "Verifiser kvittering")
            : (isEn ? "See evidence map" : "Se bevismapping"),
        }}
        secondaryCta={{
          href: moduleSlug === "core" ? "/spec" : "/core",
          label: moduleSlug === "core"
            ? (isEn ? "Read the spec" : "Les spec")
            : (isEn ? "Open protocol core" : "Åpen protokollkjerne"),
        }}
        proofItems={[
          { label: isEn ? "Layer" : "Lag", value: moduleLabel },
          { label: isEn ? "Surface" : "Flate", value: moduleSlug === "core" ? "MIT / TrustEnvelope v3" : isEn ? "Pilot operations module" : "Pilotmodul for drift" },
          { label: isEn ? "Boundary" : "Grense", value: moduleSlug === "core" ? "Required for TSP receipts" : "Optional above Core" },
        ]}
      />
      <V2CanonicalStrip locale={locale} />

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

          <article className="max-w-3xl space-y-12">
            <V2BoundaryNote title={isEn ? "What this layer means" : "Hva dette laget betyr"}>
              {boundaryCopy}
            </V2BoundaryNote>
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
