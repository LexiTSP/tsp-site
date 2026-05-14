import type { DeepPartial, Theme } from "../../../theme.config";

export interface Preset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  overrides: DeepPartial<Theme>;
}

export const PRESETS: Preset[] = [
  {
    id: "indigo",
    name: "Indigo",
    description: "Standard — moderne og tillitsfull",
    emoji: "🟣",
    overrides: {
      colors: {
        brand: "#6366F1",
        brandDark: "#4F46E5",
        brandLight: "#818CF8",
        verify: "#10B981",
        verifyDark: "#059669",
        paper: "#FAFAFF",
        ink: "#0B0F19",
      },
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    description: "Helt grønn — \"trust first\"",
    emoji: "🟢",
    overrides: {
      colors: {
        brand: "#10B981",
        brandDark: "#059669",
        brandLight: "#6EE7B7",
        verify: "#14B8A6",
        verifyDark: "#0D9488",
        paper: "#F0FDF4",
        ink: "#052E16",
      },
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Mørk modus — for koding og kvelder",
    emoji: "🌙",
    overrides: {
      colors: {
        brand: "#818CF8",
        brandDark: "#6366F1",
        brandLight: "#A5B4FC",
        verify: "#34D399",
        verifyDark: "#10B981",
        paper: "#0B0F19",
        surface: "#111827",
        ink: "#F3F4F6",
        muted: "#9CA3AF",
        border: "#1F2937",
        borderStrong: "#374151",
      },
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon-pink + turkis — for techno-vibe",
    emoji: "💜",
    overrides: {
      colors: {
        brand: "#EC4899",
        brandDark: "#DB2777",
        brandLight: "#F472B6",
        verify: "#06B6D4",
        verifyDark: "#0891B2",
        paper: "#0A0118",
        surface: "#1A0B2E",
        ink: "#F5F3FF",
        muted: "#A78BFA",
        border: "#4C1D95",
        borderStrong: "#6D28D9",
      },
    },
  },
  {
    id: "monokrom",
    name: "Monokrom",
    description: "Kun svart og hvitt — for maksimal presisjon",
    emoji: "⬛",
    overrides: {
      colors: {
        brand: "#000000",
        brandDark: "#000000",
        brandLight: "#404040",
        verify: "#22C55E",
        verifyDark: "#15803D",
        paper: "#FFFFFF",
        ink: "#000000",
        muted: "#525252",
        border: "#000000",
        borderStrong: "#000000",
      },
      card: {
        radius: "0px",
        borderWidth: "2px",
        shadow: "none",
        shadowHover: "4px 4px 0 #000",
      },
      button: { radius: "0px" },
      input: { radius: "0px" },
    },
  },
  {
    id: "classic-blue",
    name: "Classic blue",
    description: "Seriøs og formell — for enterprise",
    emoji: "🔷",
    overrides: {
      colors: {
        brand: "#1E40AF",
        brandDark: "#1E3A8A",
        brandLight: "#3B82F6",
        verify: "#059669",
        verifyDark: "#047857",
        paper: "#F8FAFC",
        ink: "#0F172A",
      },
    },
  },
  {
    id: "sunrise",
    name: "Sunrise",
    description: "Varme farger — orange + gul",
    emoji: "🌅",
    overrides: {
      colors: {
        brand: "#F97316",
        brandDark: "#EA580C",
        brandLight: "#FB923C",
        verify: "#22C55E",
        verifyDark: "#16A34A",
        paper: "#FFFBEB",
        ink: "#451A03",
      },
    },
  },
];

export const FONT_FAMILIES = [
  { label: "Inter (standard)", value: "Inter, system-ui, -apple-system, sans-serif" },
  { label: "System (OS-native)", value: "system-ui, -apple-system, sans-serif" },
  { label: "JetBrains Mono (for kode-feel)", value: '"JetBrains Mono", ui-monospace, monospace' },
  { label: "Roboto", value: "Roboto, system-ui, sans-serif" },
  { label: "IBM Plex Sans", value: '"IBM Plex Sans", system-ui, sans-serif' },
  { label: "Space Grotesk (geometrisk)", value: '"Space Grotesk", system-ui, sans-serif' },
  { label: "Source Sans Pro", value: '"Source Sans Pro", system-ui, sans-serif' },
  { label: "Georgia (serif)", value: 'Georgia, "Times New Roman", serif' },
];
