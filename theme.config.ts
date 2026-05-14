/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TSP — TEMA-KONFIGURASJON
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  STANDARD-TEMAET. Du kan endre alt her, eller bruke det innebygde
 *  Tema-studioet (palette-ikon nede i høyre hjørne, eller Ctrl+Shift+T)
 *  for å redigere live på nettsiden.
 *
 *  Leses av:
 *   - tailwind.config.ts
 *   - src/lib/theme/context.tsx
 *   - src/lib/theme/presets.ts
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type Theme = {
  colors: {
    brand: string;
    brandDark: string;
    brandLight: string;
    accent: string;
    accentDark: string;
    verify: string;
    verifyDark: string;
    warn: string;
    danger: string;
    ink: string;
    paper: string;
    surface: string;
    elevated: string;
    muted: string;
    border: string;
    borderStrong: string;
  };
  font: {
    sans: string;
    mono: string;
    display: string;
    baseSize: string;
  };
  card: {
    radius: string;
    borderWidth: string;
    shadow: string;
    shadowHover: string;
  };
  button: {
    radius: string;
    paddingX: string;
    paddingY: string;
    fontWeight: string;
  };
  input: {
    radius: string;
    paddingX: string;
    paddingY: string;
    focusRingColor: string;
  };
  layout: {
    maxWidth: string;
    gutter: string;
  };
  motion: {
    durationFast: string;
    durationNormal: string;
    durationSlow: string;
    easing: string;
  };
};

export const theme: Theme = {
  /* ═════════════ FARGER — sub-prosjekt IV-design ═════════════
   * Palett-disiplin: mono + alvorlig aksent + funksjonelle status-farger.
   * Aksent er et nedtonet koks-blå, ikke "tech-startup"-blå.
   * Status-farger speiler @lexitsp/trustbadge-react sine tier-farger.
   */
  colors: {
    /** Aksent — alvorlig koks-blå. Brukes KUN for handling/lenker/aktiv-tilstand. */
    brand: "#1E3A5F",
    brandDark: "#152A47",
    brandLight: "#3D5A85",

    /** Editorial accent — varm oker. Brukes på menneske-flater, editorial pull-quotes,
     *  stempler, "humans approved this"-momenter. IKKE statussfarge. */
    accent: "#B5895A",
    accentDark: "#8E6940",

    /** Status: verified (TrustBadge-grønn, nedtonet) */
    verify: "#047857",
    verifyDark: "#065F46",

    /** Status: trust-tier feil — oransje, brukes på cert-utløp/revokert */
    warn: "#C2410C",
    /** Status: crypto-tier feil — rød, brukes ved manipulering / signature-mismatch */
    danger: "#B91C1C",

    /** Tekst og bakgrunn — tre-lags papir-estetikk */
    ink: "#0C0C0C",
    paper: "#F4F2EC",
    surface: "#FBFAF7",
    elevated: "#FFFFFF",
    muted: "#525252",
    border: "#D4D2CC",
    borderStrong: "#A3A19A",
  },

  /* ═════════════ TYPOGRAFI ═════════════
   * IBM Plex Sans + IBM Plex Mono via next/font/google. CSS-variabel-navn
   * defineres i layout.tsx. Disse fallbacks brukes hvis font ikke har lastet.
   */
  font: {
    sans: 'var(--font-plex-sans), system-ui, -apple-system, sans-serif',
    mono: 'var(--font-plex-mono), ui-monospace, "SF Mono", Menlo, monospace',
    display: 'var(--font-display), Georgia, "Source Serif Pro", serif',
    baseSize: "16px",
  },

  /* ═════════════ KORT — minimal, ingen skygger ═════════════ */
  card: {
    radius: "4px",
    borderWidth: "1px",
    shadow: "none",
    shadowHover: "none",
  },

  /* ═════════════ KNAPPER ═════════════ */
  button: {
    radius: "2px",
    paddingX: "20px",
    paddingY: "10px",
    fontWeight: "500",
  },

  /* ═════════════ INPUT ═════════════ */
  input: {
    radius: "2px",
    paddingX: "12px",
    paddingY: "10px",
    focusRingColor: "#1E3A5F",
  },

  /* ═════════════ LAYOUT — smalere kolonne, bedre lesbarhet ═════════════ */
  layout: {
    maxWidth: "1100px",
    gutter: "32px",
  },

  /* ═════════════ ANIMASJONER ═════════════ */
  motion: {
    durationFast: "150ms",
    durationNormal: "300ms",
    durationSlow: "500ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

/* ═══════════════════════════════════════════════════════════════════════
 *  Hjelper-funksjoner
 * ═════════════════════════════════════════════════════════════════════ */

export function hexToRgb(hex: string): string {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return "0 0 0";
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return "0 0 0";
  return `${(num >> 16) & 255} ${(num >> 8) & 255} ${num & 255}`;
}

export function themeToCssVars(t: Theme = theme): Record<string, string> {
  const c = t.colors;
  return {
    "--color-brand": c.brand,
    "--color-brand-rgb": hexToRgb(c.brand),
    "--color-brand-dark": c.brandDark,
    "--color-brand-dark-rgb": hexToRgb(c.brandDark),
    "--color-brand-light": c.brandLight,
    "--color-brand-light-rgb": hexToRgb(c.brandLight),
    "--color-accent": c.accent,
    "--color-accent-rgb": hexToRgb(c.accent),
    "--color-accent-dark": c.accentDark,
    "--color-accent-dark-rgb": hexToRgb(c.accentDark),
    "--color-verify": c.verify,
    "--color-verify-rgb": hexToRgb(c.verify),
    "--color-verify-dark": c.verifyDark,
    "--color-verify-dark-rgb": hexToRgb(c.verifyDark),
    "--color-warn": c.warn,
    "--color-warn-rgb": hexToRgb(c.warn),
    "--color-danger": c.danger,
    "--color-danger-rgb": hexToRgb(c.danger),
    "--color-ink": c.ink,
    "--color-ink-rgb": hexToRgb(c.ink),
    "--color-paper": c.paper,
    "--color-paper-rgb": hexToRgb(c.paper),
    "--color-surface": c.surface,
    "--color-surface-rgb": hexToRgb(c.surface),
    "--color-elevated": c.elevated,
    "--color-elevated-rgb": hexToRgb(c.elevated),
    "--color-muted": c.muted,
    "--color-muted-rgb": hexToRgb(c.muted),
    "--color-border": c.border,
    "--color-border-rgb": hexToRgb(c.border),
    "--color-border-strong": c.borderStrong,
    "--color-border-strong-rgb": hexToRgb(c.borderStrong),

    "--font-sans": t.font.sans,
    "--font-mono": t.font.mono,
    "--font-display-stack": t.font.display,
    "--font-size-base": t.font.baseSize,

    "--card-radius": t.card.radius,
    "--card-border-width": t.card.borderWidth,
    "--card-shadow": t.card.shadow,
    "--card-shadow-hover": t.card.shadowHover,

    "--button-radius": t.button.radius,
    "--button-padding-x": t.button.paddingX,
    "--button-padding-y": t.button.paddingY,
    "--button-weight": t.button.fontWeight,

    "--input-radius": t.input.radius,
    "--input-padding-x": t.input.paddingX,
    "--input-padding-y": t.input.paddingY,
    "--input-focus-ring": t.input.focusRingColor,
    "--input-focus-ring-rgb": hexToRgb(t.input.focusRingColor),

    "--layout-max-width": t.layout.maxWidth,
    "--layout-gutter": t.layout.gutter,

    "--motion-fast": t.motion.durationFast,
    "--motion-normal": t.motion.durationNormal,
    "--motion-slow": t.motion.durationSlow,
    "--motion-easing": t.motion.easing,
  };
}

export function mergeTheme(overrides: DeepPartial<Theme>): Theme {
  return {
    colors: { ...theme.colors, ...(overrides.colors ?? {}) },
    font: { ...theme.font, ...(overrides.font ?? {}) },
    card: { ...theme.card, ...(overrides.card ?? {}) },
    button: { ...theme.button, ...(overrides.button ?? {}) },
    input: { ...theme.input, ...(overrides.input ?? {}) },
    layout: { ...theme.layout, ...(overrides.layout ?? {}) },
    motion: { ...theme.motion, ...(overrides.motion ?? {}) },
  };
}

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
