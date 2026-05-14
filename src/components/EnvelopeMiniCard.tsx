"use client";

import { CheckCircle2, Database, Cpu, Scale, Hash, Clock } from "lucide-react";

/**
 * EnvelopeMiniCard — hero-kort som speiler v3.0 TrustEnvelope-strukturen.
 * Viser tre regulator-pliktige felter (Kilde-erklæring, Prosess-logg, Alignment-metadata)
 * pluss hash-kjede og TSA-tidsstempel — slik en TrustBadge ville rendret det.
 */
export function EnvelopeMiniCard() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/30 to-verify/20 blur-3xl" />
      <div
        className="rounded-2xl border-2 border-brand/30 bg-white/95 backdrop-blur p-5 shadow-xl max-w-sm"
        style={{ boxShadow: "0 20px 60px -20px rgba(99,102,241,0.35)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-xxxs uppercase tracking-widest text-muted font-mono font-semibold">
            TRUST ENVELOPE · v3.0
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-verify/40 bg-verify/10 text-verify px-2 py-0.5 text-xxxs font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            VERIFIED
          </span>
        </div>

        {/* Content preview */}
        <div className="rounded-lg bg-gray-50 border border-border p-3 text-sm text-ink leading-relaxed mb-3">
          <span className="text-muted text-xs italic">&ldquo;</span>
          Du har rett på arbeidsavklaringspenger (AAP) fordi arbeidsevnen er nedsatt&hellip;
          <span className="text-muted text-xs italic">&rdquo;</span>
        </div>

        {/* Three structured fields */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <Field
            icon={<Database className="w-3 h-3" />}
            label="Kilde"
            value="lovdata.no §11-5"
          />
          <Field
            icon={<Cpu className="w-3 h-3" />}
            label="Prosess"
            value="normistral@11b"
          />
          <Field
            icon={<Scale className="w-3 h-3" />}
            label="Alignment"
            value="default@1.0"
          />
        </div>

        {/* TSA + ledger */}
        <div className="flex items-center justify-between gap-2 text-xxxs font-mono text-muted border-t pt-2">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="opacity-70">RFC 3161</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Hash className="w-3 h-3" />
            <span className="text-brand font-semibold tracking-widest">a3f8&hellip;d91c</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-white p-2">
      <div className="flex items-center gap-1 text-muted text-xxxs uppercase tracking-wider font-semibold mb-0.5">
        {icon}
        {label}
      </div>
      <div className="text-xxxs font-medium text-ink truncate">{value}</div>
    </div>
  );
}
