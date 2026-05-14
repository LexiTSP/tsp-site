/**
 * FingerprintBand
 * ────────────────────────────────────────────────────────────────────────
 * Slank, full-bredde rute som lekker krypto-primitiver mellom seksjoner.
 * Tekstur, ikke dekorasjon — protokollens "feel" i typografi.
 *
 * Statisk (ingen animasjon) — på smale viewports kuttes høyre kant
 * av overflow-hidden. Det er greit; båndet er identitet, ikke innhold.
 */

interface Props {
  className?: string;
}

const TOKENS = [
  "ED25519",
  "7c4f2a1d…b89e",
  "RFC 3161",
  "2026-04-30T10:00:00Z",
  "SHA-256",
  "a3f8b7c2…d91c",
  "UUIDv7",
  "01HF8K3E5Q7M",
  "X.509",
  "ed25519-2025-03",
  "JCS",
  "RFC 8785",
  "DANE",
  "_truststandardprotocol.org",
  "TSA",
  "freetsa.org/tsr",
];

export function FingerprintBand({ className = "" }: Props) {
  return (
    <div className={`tsp-fingerprint-band ${className}`} aria-hidden="true">
      <div className="tsp-container">
        <div className="tsp-fingerprint-track">
          {TOKENS.map((t, i) => (
            <span key={i} className="flex items-center gap-6">
              <span>{t}</span>
              {i < TOKENS.length - 1 && (
                <span className="tsp-fingerprint-sep">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
