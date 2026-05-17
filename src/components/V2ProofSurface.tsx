import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle2, Fingerprint, ShieldCheck } from "lucide-react";

type ProofItem = {
  label: string;
  value: string;
};

type Cta = {
  href: string;
  label: string;
};

export function V2PageHero({
  eyebrow,
  title,
  lead,
  proofItems,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  proofItems: ProofItem[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
}) {
  return (
    <section className="border-b border-border bg-[linear-gradient(180deg,#fff_0%,#f7f4ee_100%)]">
      <div className="tsp-container py-14 md:py-20">
        <div className="max-w-4xl">
          <div className="tsp-section-marker mb-5 inline-flex items-center gap-2">
            <Fingerprint className="h-3.5 w-3.5 text-brand" />
            <span>{eyebrow}</span>
          </div>
          <h1 className="mb-5 max-w-3xl">{title}</h1>
          <p className="mb-7 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>

          {(primaryCta || secondaryCta) && (
            <div className="mb-8 flex flex-wrap gap-3">
              {primaryCta && (
                <Link href={primaryCta.href} className="tsp-btn-primary">
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="tsp-btn-secondary">
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {proofItems.map((item) => (
            <div key={item.label} className="border border-border bg-white/80 p-4 shadow-sm">
              <div className="mb-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                {item.label}
              </div>
              <div className="text-sm font-semibold text-ink">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function V2CanonicalStrip({ locale }: { locale: string }) {
  const isEn = locale === "en";
  const items = isEn
    ? [
        "Canonical manifest: /.well-known/tsp-manifest.json",
        "Canonicalization: RFC 8785 / JCS",
        "Verification modes: verifyLocal() and verifyOnline()",
      ]
    : [
        "Kanonisk manifest: /.well-known/tsp-manifest.json",
        "Kanonisering: RFC 8785 / JCS",
        "Verifikasjon: verifyLocal() og verifyOnline()",
      ];

  return (
    <section className="border-y border-border bg-paper">
      <div className="tsp-container grid gap-3 py-5 md:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-muted">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verify" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function V2BoundaryNote({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-elevated p-5">
      <div className="mb-2 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-brand" />
        <h2 className="text-base font-semibold text-ink">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}
