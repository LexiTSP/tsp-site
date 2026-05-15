import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ExternalLink, Github } from "lucide-react";
import { FingerprintBand } from "./FingerprintBand";

export function TspFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-paper mt-24">
      {/* Fingerprint-bånd som identitets-åpning på footeren */}
      <FingerprintBand className="border-t-0" />

      <div className="tsp-container py-14 grid md:grid-cols-5 gap-10 text-sm">
        {/* Brand-kolonne */}
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-medium text-ink tracking-tight text-2xl">
              TSP
            </span>
            <span className="font-mono text-xs text-muted">Trust Standard Protocol</span>
          </div>
          <div className="mb-5">
            <span className="tsp-accent-pill text-xs">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              {t("stamp")}
            </span>
          </div>
          <p className="text-muted leading-relaxed max-w-md mb-5">
            {t("tagline")}
          </p>
          <div className="flex gap-2 flex-wrap text-xxs">
            <span className="tsp-pill">v3.0.0-alpha.6</span>
            <span className="tsp-pill tsp-pill--warn">{t("alpha")}</span>
            <span className="tsp-pill">Free standard</span>
          </div>
        </div>

        {/* Moduler */}
        <div>
          <div className="tsp-eyebrow mb-3">{t("modules")}</div>
          <ul className="space-y-1.5 text-muted">
            <FooterLink href="/core" label="Core" />
            <FooterLink href="/risk" label="Risk" />
            <FooterLink href="/oversight" label="Oversight" />
            <FooterLink href="/evidence" label="Evidence" />
          </ul>
        </div>

        {/* Compliance */}
        <div>
          <div className="tsp-eyebrow mb-3">{t("compliance")}</div>
          <ul className="space-y-1.5 text-muted">
            <FooterLink href="/eu-ai-act" label="EU AI Act" strong />
            <FooterLink href="/eu-ai-act/article-9" label="— Art. 9 Risk" subtle />
            <FooterLink href="/eu-ai-act/article-12" label="— Art. 12 Records" subtle />
            <FooterLink href="/eu-ai-act/article-13" label="— Art. 13 Transparency" subtle />
            <FooterLink href="/eu-ai-act/article-14" label="— Art. 14 Oversight" subtle />
            <FooterLink href="/eu-ai-act/article-15" label="— Art. 15 Accuracy" subtle />
            <FooterLink href="/eu-ai-act/article-17" label="— Art. 17 QMS" subtle />
            <FooterLink href="/iso-42001" label="ISO 42001" />
          </ul>
        </div>

        {/* Utviklere */}
        <div>
          <div className="tsp-eyebrow mb-3">{t("developers")}</div>
          <ul className="space-y-1.5 text-muted">
            <FooterLink href="/spec" label="Spec v3.0" />
            <FooterLink href="/docs" label={t("linkApiDocs")} />
            <FooterLink href="/playground" label={t("linkPlayground")} />
            <FooterLink href="/verify" label={t("linkVerify")} />
            <FooterLink href="/whitepaper" label={t("linkWhitepaper")} />
            <FooterLink href="/sammenligning" label={t("linkVsAlternatives")} />
            <FooterLink href="/endringer" label={t("linkChanges")} />
            <FooterLink href="/priser" label={t("linkPricing")} />
            <FooterLink href="/personvern" label={t("linkPrivacy")} />
            <FooterLink href="/kontakt" label={t("linkContact")} strong />
            <li>
              <a
                href="https://github.com/LexiTSP"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink inline-flex items-center gap-1.5 no-underline"
              >
                GitHub <Github className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://lexico.no"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink inline-flex items-center gap-1.5 no-underline"
              >
                {t("linkLexiCo")} <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="tsp-container py-4 text-xxs text-muted font-mono flex flex-wrap gap-x-6 gap-y-1 justify-between items-center">
          <span>
            {t.rich("rightsLine", {
              specLink: (chunks) => (
                <Link href="/spec" className="hover:text-ink">
                  {chunks}
                </Link>
              ),
            })}
          </span>
          <span>{t("copyright")}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  strong,
  subtle,
}: {
  href: string;
  label: string;
  strong?: boolean;
  subtle?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={
          "no-underline hover:text-ink transition-colors " +
          (strong ? "text-ink font-medium " : "") +
          (subtle ? "text-xxs " : "")
        }
      >
        {label}
      </Link>
    </li>
  );
}
