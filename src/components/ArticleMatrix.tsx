import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

/**
 * ArticleMatrix — visuell mapping mellom AI Act-artikler og TSP-moduler.
 *
 * Viser hvordan hver modul dekker hver artikkel, med dekningsgrad.
 * Klikkbar — hvert felt leder til artikkel-siden.
 */

type Coverage = "primary" | "partial" | "support" | "none";

interface Cell {
  module: "Core" | "Risk" | "Oversight" | "Evidence";
  coverage: Coverage;
}

interface ArticleRow {
  slug: string;
  number: string;
  name: string;
  description: string;
  coverage: number;
  cells: Cell[];
}

const ARTICLES: ArticleRow[] = [
  {
    slug: "article-12",
    number: "12",
    name: "Record-keeping",
    description: "Automatisk logging over hele livssyklusen med integritet.",
    coverage: 95,
    cells: [
      { module: "Core", coverage: "primary" },
      { module: "Risk", coverage: "support" },
      { module: "Oversight", coverage: "none" },
      { module: "Evidence", coverage: "support" },
    ],
  },
  {
    slug: "article-13",
    number: "13",
    name: "Transparency",
    description: "Brukeren forstår systemets formål, begrensninger, og nøyaktighet.",
    coverage: 90,
    cells: [
      { module: "Core", coverage: "primary" },
      { module: "Risk", coverage: "none" },
      { module: "Oversight", coverage: "primary" },
      { module: "Evidence", coverage: "none" },
    ],
  },
  {
    slug: "article-14",
    number: "14",
    name: "Human oversight",
    description: "Tilsyn av menneske med evne til å gripe inn når det trengs.",
    coverage: 75,
    cells: [
      { module: "Core", coverage: "support" },
      { module: "Risk", coverage: "support" },
      { module: "Oversight", coverage: "primary" },
      { module: "Evidence", coverage: "none" },
    ],
  },
  {
    slug: "article-15",
    number: "15",
    name: "Accuracy & robustness",
    description: "Nøyaktighet, robusthet og cybersikkerhet bevises kryptografisk.",
    coverage: 85,
    cells: [
      { module: "Core", coverage: "primary" },
      { module: "Risk", coverage: "partial" },
      { module: "Oversight", coverage: "none" },
      { module: "Evidence", coverage: "support" },
    ],
  },
  {
    slug: "article-9",
    number: "9",
    name: "Risk management",
    description: "Kontinuerlig risikostyring over systemets levetid.",
    coverage: 70,
    cells: [
      { module: "Core", coverage: "support" },
      { module: "Risk", coverage: "primary" },
      { module: "Oversight", coverage: "support" },
      { module: "Evidence", coverage: "support" },
    ],
  },
  {
    slug: "article-17",
    number: "17",
    name: "Quality management",
    description: "Helhetlig QMS for design, drift og kontinuerlig forbedring.",
    coverage: 40,
    cells: [
      { module: "Core", coverage: "support" },
      { module: "Risk", coverage: "support" },
      { module: "Oversight", coverage: "support" },
      { module: "Evidence", coverage: "primary" },
    ],
  },
];

const MODULES: Array<{ name: "Core" | "Risk" | "Oversight" | "Evidence"; href: string }> = [
  { name: "Core", href: "/core" },
  { name: "Risk", href: "/risk" },
  { name: "Oversight", href: "/oversight" },
  { name: "Evidence", href: "/evidence" },
];

export function ArticleMatrix() {
  return (
    <div className="tsp-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 tsp-eyebrow text-muted font-semibold sticky left-0 bg-gray-50 z-10 min-w-[260px]">
                Artikkel
              </th>
              {MODULES.map((m) => (
                <th key={m.name} className="p-3 tsp-eyebrow text-muted text-center font-semibold min-w-[80px]">
                  <Link href={m.href} className="hover:text-brand inline-flex items-center gap-1">
                    {m.name}
                  </Link>
                </th>
              ))}
              <th className="p-3 tsp-eyebrow text-muted text-center font-semibold min-w-[90px]">
                Dekning
              </th>
            </tr>
          </thead>
          <tbody>
            {ARTICLES.map((a) => (
              <tr key={a.slug} className="border-b hover:bg-brand/[0.02] group">
                <td className="p-3 sticky left-0 bg-white group-hover:bg-[#fafafa] z-10">
                  <Link href={`/eu-ai-act/${a.slug}`} className="block">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-muted">Art.</span>
                      <span className="font-bold text-ink group-hover:text-brand">{a.number}</span>
                      <span className="font-semibold text-ink group-hover:text-brand">{a.name}</span>
                    </div>
                    <div className="text-xs text-muted mt-0.5 leading-relaxed">{a.description}</div>
                  </Link>
                </td>
                {a.cells.map((cell, i) => (
                  <td key={i} className="p-3 text-center">
                    <CoverageDot coverage={cell.coverage} />
                  </td>
                ))}
                <td className="p-3">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          a.coverage >= 80
                            ? "bg-verify"
                            : a.coverage >= 50
                            ? "bg-brand"
                            : "bg-warn",
                        )}
                        style={{ width: `${a.coverage}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs tabular-nums font-semibold text-ink min-w-[32px] text-right">
                      {a.coverage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t bg-gray-50 px-3 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted">
        <span className="tsp-eyebrow opacity-70">Dekningstype:</span>
        <LegendItem coverage="primary" label="Primær" />
        <LegendItem coverage="partial" label="Delvis" />
        <LegendItem coverage="support" label="Støtte" />
        <LegendItem coverage="none" label="Ikke dekket" />
      </div>
    </div>
  );
}

function CoverageDot({ coverage }: { coverage: Coverage }) {
  if (coverage === "primary") {
    return (
      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-verify text-white">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    );
  }
  if (coverage === "partial") {
    return (
      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand/80 text-white">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    );
  }
  if (coverage === "support") {
    return (
      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand/20 text-brand">
        <Circle className="w-3 h-3 fill-current" />
      </div>
    );
  }
  return (
    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-300">
      <Circle className="w-3 h-3" />
    </div>
  );
}

function LegendItem({ coverage, label }: { coverage: Coverage; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <CoverageDot coverage={coverage} />
      <span>{label}</span>
    </span>
  );
}
