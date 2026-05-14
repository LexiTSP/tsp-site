/**
 * HeroSeal — civic-stempel som geometrisk oker-form i hero.
 * Ingen gradient, kun konsentriske sirkler + radial tick-marks +
 * "VERIFIED · TSP/3.0"-tekst. Plassert absolutt, lavt opacity-anker.
 */
export function HeroSeal({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
      style={{ color: "var(--color-accent)", ...style }}
    >
      {/* Ytre ring */}
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Indre ring */}
      <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {/* Innerste ring */}
      <circle cx="60" cy="60" r="28" fill="none" stroke="currentColor" strokeWidth="0.6" />

      {/* Radial tick-marks mellom ytre og indre ring */}
      {ticks.map((deg) => (
        <line
          key={deg}
          x1="60"
          y1="6"
          x2="60"
          y2={deg % 90 === 0 ? "16" : "12"}
          stroke="currentColor"
          strokeWidth={deg % 90 === 0 ? "1.5" : "0.8"}
          transform={`rotate(${deg} 60 60)`}
        />
      ))}

      {/* Sentral checkmark */}
      <path
        d="M50 60 L57 67 L72 52"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* "TSP · 3.0 · VERIFIED" rundt sentrum (mellomring) */}
      <defs>
        <path id="hero-seal-arc-top" d="M 60 24 A 36 36 0 0 1 60 96" fill="none" />
        <path id="hero-seal-arc-bot" d="M 60 96 A 36 36 0 0 1 60 24" fill="none" />
      </defs>
      <text
        fontFamily="var(--font-mono), monospace"
        fontSize="6.2"
        letterSpacing="0.3"
        fill="currentColor"
        opacity="0.85"
      >
        <textPath href="#hero-seal-arc-top" startOffset="50%" textAnchor="middle">
          · TSP/3.0 · VERIFIABLE ·
        </textPath>
      </text>
      <text
        fontFamily="var(--font-mono), monospace"
        fontSize="5.6"
        letterSpacing="0.2"
        fill="currentColor"
        opacity="0.65"
      >
        <textPath href="#hero-seal-arc-bot" startOffset="50%" textAnchor="middle">
          ED25519 · RFC 8785 · RFC 3161
        </textPath>
      </text>
    </svg>
  );
}
