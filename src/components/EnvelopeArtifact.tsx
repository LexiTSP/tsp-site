"use client";

/**
 * EnvelopeArtifact
 * ────────────────────────────────────────────────────────────────────────
 * Den visuelle representasjonen av en TrustEnvelope. Viser strukturen
 * direkte: declaration / process / alignment / ledger / signature, alt
 * i mono, dokumentaktig. Ingen abstraksjon, ingen "feature card".
 *
 * Interaktiv modus: klikk "TAMPER" for å bytte ett tegn i innholdet.
 * Hash-en bryter, status-pillen blir rød, lenken til forrige envelope
 * markeres som mismatch. Klikk "RESTORE" for å reversere.
 *
 * Brukes i hero på landing og på /spec.
 */
import { useMemo, useState } from "react";
import { ShieldCheck, AlertOctagon, RotateCcw } from "lucide-react";

interface Props {
  /** Slå av tamper-knappen for ren visning (f.eks. på spec-side) */
  interactive?: boolean;
  className?: string;
}

// EU-vennlig demo-eksempel: passasjerrettigheter etter EU-forordning 261/2004.
// Klassifiseringen er en faktisk juridisk påstand, lett å tamper-invertere
// ("rett" ↔ "ikke rett"), og kilden er offentlig EUR-Lex — internasjonalt
// gjenkjennelig på tvers av medlemsstater.
const ORIGINAL_VALUE =
  "Du har rett på 600 € kompensasjon etter EU-forordning 261/2004 Art. 7(1)(c).";
const TAMPERED_VALUE =
  "Du har ikke rett på 600 € kompensasjon etter EU-forordning 261/2004 Art. 7(1)(c).";

const ORIGINAL_HASH = "a3f8b7c2e4d91c";
const TAMPERED_HASH = "9b41cc7f8a02e1";
const PREV_HASH = "e7b203…0f4a";

export function EnvelopeArtifact({ interactive = true, className = "" }: Props) {
  const [tampered, setTampered] = useState(false);

  const value = tampered ? TAMPERED_VALUE : ORIGINAL_VALUE;
  const hash = tampered ? TAMPERED_HASH : ORIGINAL_HASH;

  // Diff-fragmenter for innholds-feltet
  const valueRender = useMemo(() => {
    if (!tampered) return value;
    // Marker det innskutte "ikke "
    const pre = "Du har ";
    const ins = "ikke ";
    const post = "rett på 600 € kompensasjon etter EU-forordning 261/2004 Art. 7(1)(c).";
    return (
      <>
        {pre}
        <span className="tsp-tamper-changed">{ins}</span>
        {post}
      </>
    );
  }, [tampered, value]);

  return (
    <div className={`tsp-spec-card ${tampered ? "tsp-shake" : ""} ${className}`}>
      {/* Head — status-pill + interaktiv tamper-knapp side ved side */}
      <div className="tsp-spec-card-head">
        <span>TrustEnvelope · TSP/3.0</span>
        <div className="inline-flex items-center gap-2">
          {tampered ? (
            <span className="tsp-pill tsp-pill--danger inline-flex items-center gap-1">
              <AlertOctagon className="w-3 h-3" />
              Hash mismatch
            </span>
          ) : (
            <span className="tsp-pill tsp-pill--verified inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}
          {interactive && (
            <button
              onClick={() => setTampered((t) => !t)}
              className={`tsp-btn-tamper ${tampered ? "is-armed" : ""}`}
              type="button"
              aria-label={tampered ? "Gjenopprett original" : "Bryt signaturen — endre ett tegn"}
              title={tampered ? "Gjenopprett original" : "Klikk for å endre ett tegn og se kjeden bryte"}
            >
              {tampered ? (
                <>
                  <RotateCcw className="w-3 h-3" />
                  Gjenopprett
                </>
              ) : (
                <>
                  <AlertOctagon className="w-3 h-3" />
                  Bryt signaturen
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <dl className="m-0">
        <Row label="content">
          <span className="tsp-tamper-target">{valueRender}</span>
          <div className="text-muted mt-1 text-xxxs">
            sha256 ·{" "}
            <span className={tampered ? "tsp-hash-new" : ""}>{hash}…</span>
          </div>
        </Row>

        <Row label="declaration">
          eur-lex.europa.eu/eli/reg/2004/261/oj
          <div className="text-muted mt-1 text-xxxs">
            Regulation (EC) 261/2004 · retrieved 2026-04-30T10:00:00Z
          </div>
        </Row>

        <Row label="process">
          normistral 11b-warm-3-2026q1
          <div className="text-muted mt-1 text-xxxs">
            t=0.0 · ctx=8192 · provider:norwai-local
          </div>
        </Row>

        <Row label="alignment">
          uncertainty:[ ] · policy:default@1.0
          <div className="text-muted mt-1 text-xxxs">
            humanReviewRequired: false
          </div>
        </Row>

        <Row label="ledger">
          <span className={tampered ? "tsp-hash-broken" : ""}>← prevHash {PREV_HASH}</span>
          <div className="text-muted mt-1 text-xxxs">
            uuidv7 · 01HF8K3E5Q7M2X9Y0Z1A2B3C4D
          </div>
        </Row>

        <Row label="signature" last>
          ed25519 · MEUCIQDx7…vK4=
          <div className="text-muted mt-1 text-xxxs">
            keyRef · /.well-known/tsp/keys.json#i1
          </div>
        </Row>
      </dl>

      {/* Foot — RFC-tidsstempel + tilstandsmelding når tampered */}
      <div className="tsp-spec-card-foot">
        {tampered ? (
          <span className="text-danger font-medium">
            Verifisering vil feile · hash mismatch
          </span>
        ) : (
          <span>RFC 3161 · MIIEXTCCBC2gAwIB…</span>
        )}
        <span>2026-04-30T12:00:00Z</span>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="tsp-spec-card-row" style={last ? { borderBottom: "none" } : undefined}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
