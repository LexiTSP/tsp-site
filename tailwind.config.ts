import type { Config } from "tailwindcss";

/**
 * Alle farger bruker CSS-variabler fra theme.config.ts — live-redigering
 * via Tema-studioet virker uten sideoppdatering.
 *
 * Font-size-skalaen er custom: oppskalert ~30 % fra Tailwind-default
 * for bedre lesbarhet. xs gikk fra 12px → 14px, sm 14px → 16px, etc.
 * Vilkårlige verdier som text-[10px] er minimumshåndtert via `xxs`/`xxxs`
 * for de få stedene de trengs (badges, fine print).
 */
const rgbVar = (name: string) => `rgb(var(--color-${name}-rgb) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    fontSize: {
      // [10px → 12px] minste tillatte for badges/legends
      xxxs: ["0.75rem", { lineHeight: "1rem" }],
      // [11px → 13px]
      xxs: ["0.8125rem", { lineHeight: "1.125rem" }],
      // [12px → 14px] tidligere xs
      xs: ["0.875rem", { lineHeight: "1.25rem" }],
      // [14px → 16px] tidligere sm
      sm: ["1rem", { lineHeight: "1.5rem" }],
      // [16px → 18px] tidligere base
      base: ["1.125rem", { lineHeight: "1.75rem" }],
      // [18px → 20px] tidligere lg
      lg: ["1.25rem", { lineHeight: "1.875rem" }],
      // [20px → 22px] tidligere xl
      xl: ["1.375rem", { lineHeight: "2rem" }],
      // [24px → 26px] tidligere 2xl
      "2xl": ["1.625rem", { lineHeight: "2.25rem" }],
      // [30px → 32px] tidligere 3xl
      "3xl": ["2rem", { lineHeight: "2.5rem" }],
      // [36px → 40px] tidligere 4xl
      "4xl": ["2.5rem", { lineHeight: "3rem" }],
      // [48px → 56px] tidligere 5xl
      "5xl": ["3.5rem", { lineHeight: "1" }],
      // [60px → 72px] tidligere 6xl
      "6xl": ["4.5rem", { lineHeight: "1" }],
      // [72px → 84px] tidligere 7xl
      "7xl": ["5.25rem", { lineHeight: "1" }],
      // [96px → 108px]
      "8xl": ["6.75rem", { lineHeight: "1" }],
      // [128px → 144px]
      "9xl": ["9rem", { lineHeight: "1" }],
    },
    extend: {
      colors: {
        ink: rgbVar("ink"),
        paper: rgbVar("paper"),
        surface: rgbVar("surface"),
        elevated: rgbVar("elevated"),
        muted: rgbVar("muted"),
        border: rgbVar("border"),
        "border-strong": rgbVar("border-strong"),
        brand: {
          DEFAULT: rgbVar("brand"),
          dark: rgbVar("brand-dark"),
          light: rgbVar("brand-light"),
        },
        accent: {
          DEFAULT: rgbVar("accent"),
          dark: rgbVar("accent-dark"),
        },
        verify: {
          DEFAULT: rgbVar("verify"),
          dark: rgbVar("verify-dark"),
        },
        warn: rgbVar("warn"),
        danger: rgbVar("danger"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display-stack)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "var(--card-radius)",
        btn: "var(--button-radius)",
        input: "var(--input-radius)",
      },
      boxShadow: {
        card: "var(--card-shadow)",
        "card-hover": "var(--card-shadow-hover)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
