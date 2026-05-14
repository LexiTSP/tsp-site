"use client";

import { useEffect, useState } from "react";

/**
 * ChainVisualizer — animert SVG-kjede av TSP-envelopes.
 *
 * Viser blokker som lenkes sammen kryptografisk. Hver blokk har en hash
 * som peker på forrige. Pulserer for å vise at kjeden er "live".
 *
 * Bruksområder:
 *  - Hero på landing
 *  - /spec-side
 *  - Empty state i playground
 *
 * Props:
 *  blocks        — antall blokker (default 5)
 *  variant       — "light" for lys bakgrunn, "dark" for mørk
 *  tamperedIndex — indeks til blokk som er "brutt" (vises rød)
 */
interface Props {
  blocks?: number;
  variant?: "light" | "dark";
  tamperedIndex?: number | null;
  className?: string;
}

const HASH_CHARS = "0123456789abcdef";
function randHash(len = 8, seed = 0): string {
  let out = "";
  let s = seed || Math.random() * 1e9;
  for (let i = 0; i < len; i++) {
    s = (s * 9301 + 49297) % 233280;
    out += HASH_CHARS[Math.floor((s / 233280) * 16)];
  }
  return out;
}

export function ChainVisualizer({
  blocks = 5,
  variant = "light",
  tamperedIndex = null,
  className = "",
}: Props) {
  const [tick, setTick] = useState(0);
  const [hashes, setHashes] = useState<string[]>(() =>
    Array.from({ length: blocks }, (_, i) => randHash(8, i * 1000 + 1)),
  );

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  // On tick, rotate hashes — simuler ny aktivitet
  useEffect(() => {
    setHashes((hs) => {
      // Replace last block's hash each tick (simulerer nyeste svar)
      const next = [...hs];
      next[next.length - 1] = randHash(8, tick * 7 + 13);
      return next;
    });
  }, [tick]);

  const W = 640;
  const H = 200;
  const BLOCK_W = 90;
  const BLOCK_H = 90;
  const GAP = (W - blocks * BLOCK_W) / (blocks + 1);
  const Y = (H - BLOCK_H) / 2;

  const isDark = variant === "dark";
  const palette = isDark
    ? {
        bg: "transparent",
        stroke: "rgba(212,212,212,0.35)",
        fill: "rgba(255,255,255,0.04)",
        text: "#E5E5E5",
        hashText: "rgba(229,229,229,0.85)",
        link: "rgba(212,212,212,0.5)",
        tamper: "#B91C1C",
        tamperFill: "rgba(185,28,28,0.18)",
      }
    : {
        bg: "transparent",
        stroke: "rgba(30,58,95,0.4)",
        fill: "rgba(30,58,95,0.03)",
        text: "#0C0C0C",
        hashText: "rgba(30,58,95,0.85)",
        link: "rgba(30,58,95,0.5)",
        tamper: "#B91C1C",
        tamperFill: "rgba(185,28,28,0.08)",
      };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: "100%", height: "auto" }}
      role="img"
      aria-label="TSP signaturkjede — animert"
    >
      <defs>
        {/* No filters/gradients — flat utilitarian aesthetic per v3 design system */}
      </defs>

      {/* Connecting lines */}
      {Array.from({ length: blocks - 1 }).map((_, i) => {
        const x1 = GAP + (i + 1) * BLOCK_W + i * GAP;
        const x2 = x1 + GAP;
        const y = Y + BLOCK_H / 2;
        const broken = tamperedIndex === i + 1;
        return (
          <g key={`link-${i}`}>
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={broken ? palette.tamper : palette.link}
              strokeWidth="2"
              strokeDasharray={broken ? "4 3" : "0"}
              strokeLinecap="round"
            />
            {/* Traveling pulse */}
            {!broken && (
              <circle r="2.5" fill={isDark ? "#E5E5E5" : "#1E3A5F"}>
                <animate
                  attributeName="cx"
                  values={`${x1};${x2}`}
                  dur="1.8s"
                  repeatCount="indefinite"
                  begin={`${i * 0.35}s`}
                />
                <animate
                  attributeName="cy"
                  values={`${y};${y}`}
                  dur="1.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="1.8s"
                  repeatCount="indefinite"
                  begin={`${i * 0.35}s`}
                />
              </circle>
            )}
          </g>
        );
      })}

      {/* Blocks */}
      {Array.from({ length: blocks }).map((_, i) => {
        const x = GAP + i * (BLOCK_W + GAP);
        const broken = tamperedIndex === i;
        const hash = hashes[i] ?? randHash(8, i);
        return (
          <g key={`block-${i}`}>
            <rect
              x={x}
              y={Y}
              width={BLOCK_W}
              height={BLOCK_H}
              rx="2"
              ry="2"
              fill={broken ? palette.tamperFill : palette.fill}
              stroke={broken ? palette.tamper : palette.stroke}
              strokeWidth={broken ? "2" : "1.5"}
            >
              {!broken && i === blocks - 1 && (
                <animate
                  attributeName="stroke-opacity"
                  values="0.3;1;0.3"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              )}
            </rect>
            {/* Header strip */}
            <rect
              x={x}
              y={Y}
              width={BLOCK_W}
              height="18"
              rx="2"
              ry="2"
              fill={broken ? palette.tamper : isDark ? "rgba(255,255,255,0.06)" : "rgba(30,58,95,0.08)"}
            />
            <text
              x={x + BLOCK_W / 2}
              y={Y + 12}
              textAnchor="middle"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              fontWeight="700"
              fill={broken ? "#fff" : palette.hashText}
            >
              #{String(i + 1).padStart(3, "0")}
            </text>
            {/* Content placeholder lines */}
            <rect x={x + 10} y={Y + 28} width={BLOCK_W - 20} height="3" rx="1.5" fill={palette.text} fillOpacity="0.25" />
            <rect x={x + 10} y={Y + 36} width={BLOCK_W - 30} height="3" rx="1.5" fill={palette.text} fillOpacity="0.2" />
            <rect x={x + 10} y={Y + 44} width={BLOCK_W - 25} height="3" rx="1.5" fill={palette.text} fillOpacity="0.15" />
            {/* Hash */}
            <text
              x={x + BLOCK_W / 2}
              y={Y + BLOCK_H - 14}
              textAnchor="middle"
              fontSize="8"
              fontFamily="ui-monospace, monospace"
              fill={palette.hashText}
              letterSpacing="0.5"
            >
              {broken ? "!!! BROKEN" : hash}
            </text>
            <text
              x={x + BLOCK_W / 2}
              y={Y + BLOCK_H - 4}
              textAnchor="middle"
              fontSize="6"
              fontFamily="ui-monospace, monospace"
              fill={palette.text}
              fillOpacity="0.5"
              letterSpacing="0.8"
            >
              SHA-256
            </text>
          </g>
        );
      })}

      {/* Top ribbon */}
      <text
        x={W / 2}
        y={16}
        textAnchor="middle"
        fontSize="10"
        fontFamily="ui-monospace, monospace"
        fontWeight="600"
        fill={palette.text}
        fillOpacity="0.55"
        letterSpacing="3"
      >
        TRUST · STANDARD · PROTOCOL
      </text>
    </svg>
  );
}
