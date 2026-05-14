import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle2, FileCheck2, ReceiptText, ShieldAlert, XCircle } from "lucide-react";
import { EnvelopeArtifact } from "@/components/EnvelopeArtifact";
import { FingerprintBand } from "@/components/FingerprintBand";
import { HeroSeal } from "@/components/HeroSeal";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const isEn = locale === "en";

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-border tsp-hero-surface relative overflow-hidden">
        <HeroSeal
          className="hidden md:block absolute pointer-events-none select-none"
          style={{
            bottom: "-40px",
            left: "-40px",
            width: "240px",
            height: "240px",
            opacity: 0.32,
            transform: "rotate(-8deg)",
          }}
        />
        <div className="tsp-container py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-[1fr_540px] gap-10 lg:gap-14 items-start">
            <div>
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                <span className="tsp-stamp">
                  <span
                    className="tsp-stamp-dot"
                    aria-label="Spec live (alpha)"
                    role="img"
                  />
                  {t("hero.specStamp")}
                </span>
                <span className="tsp-section-marker">{t("hero.openStandardMit")}</span>
              </div>

              <SectionEyebrow num="01" label={t("hero.eyebrow")} tone="accent" />
              <h1 className="mb-6">{t("hero.h1")}</h1>
              <p className="text-lg text-ink max-w-xl mb-4 leading-relaxed">
                {t.rich("hero.lead", {
                  kilde: (c) => <strong>{c}</strong>,
                  model: (c) => <strong>{c}</strong>,
                  time: (c) => <strong>{c}</strong>,
                })}
              </p>
              <p className="text-sm text-muted max-w-xl mb-10 leading-relaxed">
                {t.rich("hero.leadTechnical", {
                  code: (c) => <code className="tsp-code">{c}</code>,
                })}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/playground" className="tsp-btn-primary-lg">
                  {t("hero.ctaPrimary")} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/spec" className="tsp-btn-secondary-lg">
                  {t("hero.ctaSecondary")}
                </Link>
              </div>
            </div>

            <div>
              <EnvelopeArtifact />
            </div>
          </div>
        </div>

        {/* Spec-metadata-strip */}
        <div className="border-t border-border bg-surface">
          <div className="tsp-container">
            <dl className="grid grid-cols-2 md:grid-cols-5 divide-x divide-border border-x-0">
              <SpecCell term={t("hero.specCellSpec")} value={t("hero.specCellSpecValue")} />
              <SpecCell term={t("hero.specCellPackages")} value={t("hero.specCellPackagesValue")} />
              <SpecCell term={t("hero.specCellTests")} value={t("hero.specCellTestsValue")} verified />
              <SpecCell term={t("hero.specCellCompliance")} value={t("hero.specCellComplianceValue")} />
              <SpecCell term={t("hero.specCellCrypto")} value={t("hero.specCellCryptoValue")} />
            </dl>
          </div>
        </div>
      </section>

      {/* CORE DEMO */}
      <section className="border-b border-border bg-paper">
        <div className="tsp-container py-14 md:py-18">
          <SectionEyebrow
            num="02"
            label={isEn ? "The product in one loop" : "Produktet i én loop"}
            tone="verify"
          />
          <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-10 lg:gap-14 items-start">
            <div>
              <h2 className="mb-4">
                {isEn
                  ? "TSP turns an AI answer into a signed receipt."
                  : "TSP gjør et AI-svar om til en signert kvittering."}
              </h2>
              <p className="text-muted leading-relaxed mb-5">
                {isEn
                  ? "The receipt records where the answer came from, how it was made, when it was signed, and whether the bytes still match. Change one character afterwards and verification fails."
                  : "Kvitteringen sier hvor svaret kom fra, hvordan det ble laget, når det ble signert, og om byte-innholdet fortsatt stemmer. Endrer noen ett tegn etterpå, feiler verifiseringen."}
              </p>
              <Link href="/playground" className="tsp-btn-primary">
                {isEn ? "Run the tamper demo" : "Kjør tamper-demoen"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-border-strong border border-border-strong">
              <DemoStep
                icon={<ReceiptText className="w-5 h-5" />}
                title={isEn ? "1. Answer" : "1. Svar"}
                body={isEn ? "An AI output is produced." : "Et AI-svar blir produsert."}
              />
              <DemoStep
                icon={<FileCheck2 className="w-5 h-5" />}
                title={isEn ? "2. Receipt" : "2. Kvittering"}
                body={isEn ? "TSP signs source, model, time and hash." : "TSP signerer kilde, modell, tid og hash."}
              />
              <DemoStep
                icon={<ShieldAlert className="w-5 h-5" />}
                title={isEn ? "3. Tamper caught" : "3. Endring fanges"}
                body={isEn ? "Any later edit breaks verification." : "Enhver senere endring bryter verifisering."}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABSTRACT */}
      <section className="border-b border-border">
        <div className="tsp-container py-16 md:py-20">
          <SectionEyebrow num="03" label={t("abstract.eyebrow")} />
          <div className="tsp-prose">
            <p className="text-lg leading-relaxed mb-5">
              {t.rich("abstract.p1", { em: (c) => <em>{c}</em> })}
            </p>
            <p className="text-base leading-relaxed mb-5">
              {t.rich("abstract.p2", {
                em: (c) => <em>{c}</em>,
                code: (c) => <code className="tsp-code">{c}</code>,
                strong: (c) => <strong>{c}</strong>,
              })}
            </p>
            <p className="text-base leading-relaxed">{t("abstract.p3")}</p>
          </div>
        </div>
      </section>

      {/* MANIFEST */}
      <section className="tsp-inverse border-b border-border-strong">
        <div className="tsp-container py-14 md:py-18 relative">
          <SectionEyebrow num="04" label={t("manifest.eyebrow")} tone="accent" />
          <h2 className="mb-10 max-w-2xl">{t("manifest.h2")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            <div>
              <div className="tsp-stat-num">{t("manifest.stat1Num")}</div>
              <div className="tsp-stat-label">{t("manifest.stat1Label")}</div>
            </div>
            <div className="md:tsp-stat-divider md:pl-8">
              <div className="tsp-stat-num">{t("manifest.stat2Num")}</div>
              <div className="tsp-stat-label">{t("manifest.stat2Label")}</div>
            </div>
            <div className="md:tsp-stat-divider md:pl-8">
              <div className="tsp-stat-num">{t("manifest.stat3Num")}</div>
              <div className="tsp-stat-label">{t("manifest.stat3Label")}</div>
            </div>
            <div className="md:tsp-stat-divider md:pl-8">
              <div className="tsp-stat-num">{t("manifest.stat4Num")}</div>
              <div className="tsp-stat-label">{t("manifest.stat4Label")}</div>
            </div>
          </div>
          <p className="mt-12 max-w-2xl text-base leading-relaxed text-white/75">
            {t.rich("manifest.claim", {
              strong: (c) => <em className="text-white not-italic font-medium">{c}</em>,
            })}
          </p>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="border-b border-border bg-paper">
        <div className="tsp-container py-16 md:py-20">
          <SectionEyebrow num="05" label={t("audience.eyebrow")} tone="verify" />
          <h2 className="mb-3">{t("audience.h2")}</h2>
          <p className="text-muted text-base max-w-2xl mb-10">{t("audience.lead")}</p>
          <div className="grid md:grid-cols-3 gap-px bg-border-strong border border-border-strong">
            <AudienceFrame
              role={t("audience.complianceRole")}
              concern={t("audience.complianceConcern")}
              what={t("audience.complianceWhat")}
              cta={t("audience.complianceCta")}
              ctaHref="/eu-ai-act"
            />
            <AudienceFrame
              role={t("audience.devRole")}
              concern={t("audience.devConcern")}
              what={t("audience.devWhat")}
              cta={t("audience.devCta")}
              ctaHref="/docs"
            />
            <AudienceFrame
              role={t("audience.leaderRole")}
              concern={t("audience.leaderConcern")}
              what={t("audience.leaderWhat")}
              cta={t("audience.leaderCta")}
              ctaHref="/priser"
            />
          </div>
        </div>
      </section>

      <FingerprintBand />

      {/* STANDARD */}
      <section className="border-b border-border">
        <div className="tsp-container py-16 md:py-20">
          <SectionEyebrow num="06" label={t("standard.eyebrow")} />
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            <div>
              <h2 className="mb-3">{t("standard.h2")}</h2>
              <p className="text-muted mb-2">{t("standard.lead")}</p>
              <p className="text-muted text-sm">{t("standard.subLead")}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-border-strong border border-border-strong">
              <ModuleCell
                href="/core"
                pkg="@lexitsp/sdk"
                version="v3.0.0-alpha.5"
                desc={t("standard.moduleSdkDesc")}
                license="MIT"
                covers="Art. 12, 13, 15"
              />
              <ModuleCell
                href="/oversight"
                pkg="@lexitsp/trustbadge-react"
                version="v0.2.1"
                desc={t("standard.moduleBadgeDesc")}
                license="MIT"
                covers="UX"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="border-b border-border bg-surface">
        <div className="tsp-container py-16 md:py-20">
          <SectionEyebrow num="07" label={t("platform.eyebrow")} tone="warn" />
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            <div>
              <h2 className="mb-3">{t("platform.h2")}</h2>
              <p className="text-muted mb-2">{t("platform.lead")}</p>
              <p className="text-muted text-sm">{t("platform.subLead")}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-px bg-border-strong border border-border-strong">
              <ModuleCell
                href="/risk"
                pkg="@lexitsp/risk-server"
                version="v0.1.0-alpha.1"
                desc={t("platform.moduleRiskDesc")}
                license="Commercial"
                covers="Art. 9"
              />
              <ModuleCell
                href="/evidence"
                pkg="@lexitsp/evidence-server"
                version="v0.1.0-alpha.0"
                desc={t("platform.moduleEvidenceDesc")}
                license="Commercial"
                covers="Art. 17"
              />
              <ModuleCell
                href="/oversight"
                pkg="@lexitsp/oversight-server"
                version="v0.1.0-alpha.0"
                desc={t("platform.moduleOversightDesc")}
                license="Commercial"
                covers="Art. 14"
              />
            </div>
          </div>
        </div>
      </section>

      <FingerprintBand />

      {/* ENVELOPE */}
      <section className="border-b border-border">
        <div className="tsp-container py-16 md:py-20">
          <SectionEyebrow num="08" label={t("envelope.eyebrow")} />
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 lg:items-start">
            <div className="lg:sticky lg:top-20 lg:self-start">
              <h2 className="mb-4">{t("envelope.h2")}</h2>
              <p className="text-muted text-base mb-5">{t("envelope.lead")}</p>
              <dl className="space-y-5">
                <FieldDef field={t("envelope.fieldDeclaration")} desc={t("envelope.fieldDeclarationDesc")} />
                <FieldDef field={t("envelope.fieldProcess")} desc={t("envelope.fieldProcessDesc")} />
                <FieldDef field={t("envelope.fieldAlignment")} desc={t("envelope.fieldAlignmentDesc")} />
                <FieldDef field={t("envelope.fieldTimestamp")} desc={t("envelope.fieldTimestampDesc")} />
              </dl>
              <Link href="/spec" className="inline-flex items-center gap-1 text-sm mt-6">
                {t("envelope.readFullSchema")} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div>
              <div className="tsp-eyebrow mb-3">{t("envelope.wireRepresentation")}</div>
              <pre className="text-xs leading-relaxed font-mono bg-surface border border-border p-5 overflow-x-auto">
{`{
  "tsp": "3.0",
  "content": {
    "type": "text",
    "value": "${locale === "en" ? "You qualify for €600 compensation…" : "Du har rett på 600 € kompensasjon…"}",
    "hash": "a3f8…d91c"
  },
  "declaration": {
    "primarySource": {
      "type": "legal-database",
      "url": "https://eur-lex.europa.eu/eli/reg/2004/261/oj",
      "title": "Regulation (EC) 261/2004",
      "retrieved": "2026-04-30T10:00:00Z"
    },
    "citations": [ /* … */ ]
  },
  "process": {
    "model": {
      "name": "claude-sonnet-4-6",
      "version": "20251001",
      "provider": "anthropic-eu",
      "temperature": 0.0,
      "contextWindow": 200000
    },
    "systemPrompt": { "hash": "0…", "text": "…" }
  },
  "alignment": {
    "uncertainty": [],
    "policy": { "id": "default", "version": "1.0" },
    "humanReviewRequired": false
  },
  "timestamp": {
    "claimed": "2026-04-30T12:00:00Z",
    "tsaToken": "MII…",
    "tsaUrl": "https://freetsa.org/tsr"
  },
  "ledger": {
    "id": "01HF…",
    "prevHash": "e7b2…0f4a",
    "hash": "a3f8…d91c"
  },
  "signatures": [{
    "role": "instance",
    "algorithm": "ed25519",
    "keyRef": "https://acme.no/.well-known/tsp/keys.json#i1",
    "signature": "MEU…",
    "certChain": ["…"]
  }]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* NOT */}
      <section className="border-b border-border bg-surface">
        <div className="tsp-container py-16 md:py-20">
          <SectionEyebrow
            num="09"
            label={isEn ? "Negative-space positioning" : "Hva TSP ikke er"}
            tone="warn"
          />
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16">
            <div>
              <h2 className="mb-4">
                {isEn ? "A narrow protocol beats a vague platform." : "En smal protokoll slår en vag plattform."}
              </h2>
              <p className="text-muted leading-relaxed">
                {isEn
                  ? "TSP should be easy to reject when it is the wrong tool. It does one thing: turns AI output from a claim into a verifiable artifact."
                  : "TSP skal være lett å avvise når det er feil verktøy. Det gjør én ting: gjør AI-output fra en påstand til et verifiserbart artefakt."}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <NotCard text={isEn ? "Not an AI model" : "Ikke en AI-modell"} />
              <NotCard text={isEn ? "Not an eval suite" : "Ikke en eval-suite"} />
              <NotCard text={isEn ? "Not a policy engine" : "Ikke en policy-motor"} />
              <NotCard text={isEn ? "Not a dashboard pretending to be compliance" : "Ikke et dashboard som later som det er compliance"} />
              <div className="sm:col-span-2 border border-verify/30 bg-verify/5 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-verify shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-ink mb-1">
                      {isEn ? "It is a signed provenance protocol." : "Det er en signert proveniens-protokoll."}
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {isEn
                        ? "The core artifact is the receipt. Risk, Evidence and Oversight are optional operational modules built on top."
                        : "Kjerneartefaktet er kvitteringen. Risk, Evidence og Oversight er valgfrie driftsmoduler bygget oppå."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT */}
      <section>
        <div className="tsp-container py-16 md:py-20">
          <SectionEyebrow num="10" label={t("next.eyebrow")} tone="accent" />
          <h2 className="mb-10">{t("next.h2")}</h2>
          <div className="grid sm:grid-cols-3 gap-px bg-border-strong border border-border-strong">
            <AudienceCell
              href="/playground"
              audience={t("next.tryAudience")}
              title={t("next.tryTitle")}
              body={t("next.tryBody")}
            />
            <AudienceCell
              href="/sammenligning"
              audience={t("next.compareAudience")}
              title={t("next.compareTitle")}
              body={t("next.compareBody")}
            />
            <AudienceCell
              href="/kontakt"
              audience={t("next.contactAudience")}
              title={t("next.contactTitle")}
              body={t("next.contactBody")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function DemoStep({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-surface p-6">
      <div className="w-10 h-10 border border-border bg-paper text-brand flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="font-semibold text-ink mb-2">{title}</div>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function NotCard({ text }: { text: string }) {
  return (
    <div className="border border-border bg-paper p-4 flex items-center gap-3">
      <XCircle className="w-4 h-4 text-warn shrink-0" />
      <span className="text-sm font-medium text-ink">{text}</span>
    </div>
  );
}

function SectionEyebrow({
  num,
  label,
  tone,
}: {
  num: string;
  label: string;
  tone?: "verify" | "warn" | "accent";
}) {
  const numClass =
    tone === "verify"
      ? "tsp-section-num tsp-section-num--verify"
      : tone === "warn"
        ? "tsp-section-num tsp-section-num--warn"
        : tone === "accent"
          ? "tsp-section-num tsp-section-num--accent"
          : "tsp-section-num";
  return (
    <div className="tsp-section-eyebrow mb-4">
      <span className={numClass}>{num}</span>
      <span className="tsp-section-label">{label}</span>
    </div>
  );
}

function SpecCell({
  term,
  value,
  verified,
}: {
  term: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <div className="px-5 py-4">
      <div className="tsp-eyebrow mb-1.5 flex items-center gap-1.5">
        {verified && (
          <span
            className="tsp-live-dot"
            aria-label="Tests passing"
            role="img"
          />
        )}
        {term}
      </div>
      <div className="font-mono text-xs text-ink leading-snug">{value}</div>
    </div>
  );
}

function ModuleCell({
  href,
  pkg,
  version,
  desc,
  license,
  covers,
}: {
  href: string;
  pkg: string;
  version: string;
  desc: string;
  license: string;
  covers: string;
}) {
  return (
    <Link
      href={href}
      className="tsp-cell-lift block bg-surface p-5 hover:bg-paper group no-underline"
    >
      <div className="flex items-baseline justify-between mb-2 gap-2">
        <code className="text-sm font-medium text-ink truncate">{pkg}</code>
        <span className="tsp-section-marker shrink-0">{version}</span>
      </div>
      <p className="text-sm text-muted leading-snug mb-4">{desc}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="tsp-pill">{license}</span>
        <span className="tsp-section-marker">{covers}</span>
      </div>
    </Link>
  );
}

function FieldDef({ field, desc }: { field: string; desc: string }) {
  return (
    <div>
      <dt className="font-mono text-sm text-ink mb-1">{field}</dt>
      <dd className="text-sm text-muted leading-relaxed">{desc}</dd>
    </div>
  );
}

function AudienceCell({
  href,
  audience,
  title,
  body,
}: {
  href: string;
  audience: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="tsp-cell-lift block bg-surface p-6 hover:bg-paper group no-underline"
    >
      <div className="tsp-section-marker mb-3">{audience}</div>
      <div className="font-medium text-ink text-lg mb-2">{title}</div>
      <p className="text-sm text-muted leading-relaxed mb-4">{body}</p>
      <span className="text-sm text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}

function AudienceFrame({
  role,
  concern,
  what,
  cta,
  ctaHref,
}: {
  role: string;
  concern: string;
  what: string;
  cta: string;
  ctaHref: string;
}) {
  return (
    <div className="tsp-cell-lift bg-surface p-6 flex flex-col group">
      <div className="tsp-section-marker mb-3">{role}</div>
      <div className="text-sm text-ink mb-3 leading-relaxed font-medium">
        &laquo; {concern} &raquo;
      </div>
      <p className="text-sm text-muted leading-relaxed mb-5 flex-1">{what}</p>
      <Link
        href={ctaHref}
        className="text-sm text-brand inline-flex items-center gap-1 no-underline hover:underline group-hover:gap-2 transition-all"
      >
        {cta} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
