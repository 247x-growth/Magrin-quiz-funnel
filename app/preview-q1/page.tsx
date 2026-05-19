"use client";

/**
 * Mockup statico per il pittogramma Q1.
 * Non è ancora wired al flow quiz reale — serve per validare design con stakeholder.
 *
 * Demo:
 *   - Desktop: body Vitruvian + hotspot cliccabili a sx, label panel a dx, sync bidirezionale
 *   - Mobile: body compatto + chip stack sotto, sync bidirezionale
 *   - Hover/tap stati per validare touch target sizing
 */

import { useState } from "react";

type ZoneId = "1a" | "1b" | "1c" | "1d" | "1e" | "1f" | "1g";

type Zone = {
  id: ZoneId;
  label: string;
  short: string;
  /** Coord % rispetto al body image (1:1). x=50% sempre (mediana). Solo y varia. */
  y?: number;
};

const ZONES: Zone[] = [
  { id: "1a", label: "Nella gola, come un nodo che non passa",      short: "Gola",       y: 24 },
  { id: "1b", label: "Al centro del petto, una pressione",          short: "Petto",      y: 33 },
  { id: "1c", label: "Tra petto e stomaco, una stretta al diaframma", short: "Diaframma", y: 42 },
  { id: "1d", label: "Allo stomaco, un peso che mi accompagna",     short: "Stomaco",    y: 51 },
  { id: "1e", label: "Nella pancia, una vibrazione di fondo",       short: "Pancia",     y: 60 },
  { id: "1f", label: "Più giù, una stanchezza che blocca",          short: "Più giù",    y: 72 },
  { id: "1g", label: "Non lo so dire, è ovunque",                   short: "Ovunque" },
];

export default function PreviewQ1() {
  const [selected, setSelected] = useState<ZoneId | null>(null);
  const [hovered, setHovered] = useState<ZoneId | null>(null);

  const activeId = hovered ?? selected;

  return (
    <main className="min-h-dvh py-10 md:py-16">
      {/* Header */}
      <div className="container-wide mb-10 md:mb-14">
        <div className="flex items-center gap-2 mb-3 utility-text text-xs tracking-widest text-[var(--ink-tertiary)]">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
          MOCKUP STATICO · Q1 pittogramma cliccabile
        </div>
        <p className="utility-text text-xs text-[var(--ink-quaternary)] tracking-wide max-w-3xl">
          Validazione design prima di wireup al flow reale. Tap/click su hotspot o chip per testare touch target + sync visiva.
        </p>
      </div>

      {/* Question */}
      <div className="container-wide max-w-4xl mx-auto text-center mb-10 md:mb-14">
        <h2 className="font-display text-[clamp(1.5rem,1rem+2vw,2.25rem)] font-bold leading-tight tracking-tight">
          Quando un pensiero negativo arriva, dove lo senti per primo nel corpo?
        </h2>
        <p className="mt-3 text-[var(--ink-tertiary)] text-sm md:text-base italic">
          Chiudi gli occhi un secondo. Scegli quella che riconosci di più in questo periodo.
        </p>
      </div>

      {/* DESKTOP: 2-col body + panel ; MOBILE: stacked body small + chips */}
      <div className="container-wide max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-start">
          {/* LEFT — Body with hotspots */}
          <div className="relative mx-auto w-full max-w-[320px] lg:max-w-[460px] aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/body-all.webp"
              alt="Figura Vitruviana, punti energetici"
              className="block w-full h-full object-contain breathe-slow select-none"
              draggable={false}
            />

            {/* SVG hotspot overlay */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              {ZONES.filter((z) => typeof z.y === "number").map((z) => {
                const isActive = activeId === z.id;
                const isSelected = selected === z.id;
                return (
                  <g
                    key={z.id}
                    style={{ pointerEvents: "auto", cursor: "pointer" }}
                    onClick={() => setSelected(z.id)}
                    onMouseEnter={() => setHovered(z.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Touch target invisibile, grande (≥50px equiv su mobile) */}
                    <circle
                      cx="50"
                      cy={z.y!}
                      r="7"
                      fill="transparent"
                    />
                    {/* Visible halo on hover/selected */}
                    {(isActive || isSelected) && (
                      <circle
                        cx="50"
                        cy={z.y!}
                        r="4.5"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="0.5"
                        opacity="0.6"
                        style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
                      />
                    )}
                    {/* Inner dot */}
                    <circle
                      cx="50"
                      cy={z.y!}
                      r={isSelected ? "2.2" : "1.6"}
                      fill={isSelected ? "var(--accent)" : isActive ? "var(--accent)" : "rgba(255,255,255,0.55)"}
                      style={{
                        filter: isSelected ? "drop-shadow(0 0 8px var(--accent-glow))" : "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* RIGHT — Label panel desktop / chip stack mobile */}
          <div className="w-full">
            {/* Desktop: option list */}
            <ul className="hidden lg:flex flex-col gap-2.5">
              {ZONES.map((z) => {
                const isActive = activeId === z.id;
                const isSelected = selected === z.id;
                return (
                  <li key={z.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(z.id)}
                      onMouseEnter={() => setHovered(z.id)}
                      onMouseLeave={() => setHovered(null)}
                      className="group w-full text-left px-5 py-3.5 rounded-md border transition-all duration-200 hover:translate-y-[-1px]"
                      style={{
                        borderColor: isSelected ? "var(--accent)" : isActive ? "var(--ink-quaternary)" : "var(--border)",
                        background: "var(--bg-elevated)",
                        boxShadow: isSelected ? "0 0 24px -8px var(--accent-glow)" : "none",
                      }}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          aria-hidden="true"
                          className="shrink-0 w-5 h-5 rounded-full border-2 grid place-items-center transition-all"
                          style={{
                            borderColor: isSelected ? "var(--accent)" : "var(--ink-quaternary)",
                            background: isSelected ? "var(--accent)" : "transparent",
                          }}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                        <span className="text-[var(--ink-primary)] text-[0.9375rem] leading-snug font-medium">
                          {z.label}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Mobile: chip stack */}
            <div className="lg:hidden flex flex-wrap gap-2 justify-center mt-2">
              {ZONES.map((z) => {
                const isSelected = selected === z.id;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setSelected(z.id)}
                    className="px-4 py-2.5 rounded-full border text-sm transition-all min-h-[44px]"
                    style={{
                      borderColor: isSelected ? "var(--accent)" : "var(--border)",
                      background: isSelected ? "var(--accent)" : "var(--bg-elevated)",
                      color: isSelected ? "white" : "var(--ink-primary)",
                      boxShadow: isSelected ? "0 0 16px -4px var(--accent-glow)" : "none",
                    }}
                    aria-pressed={isSelected}
                  >
                    {z.short}
                  </button>
                );
              })}
            </div>

            {/* Mobile only: full label of selected/hovered */}
            <p className="lg:hidden text-center mt-6 text-[var(--ink-tertiary)] text-sm min-h-[2.5rem]">
              {activeId
                ? ZONES.find((z) => z.id === activeId)?.label
                : "Tocca una zona o un chip"}
            </p>
          </div>
        </div>

        {/* Continue button (mocked, no flow) */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <button
            type="button"
            disabled={!selected}
            className="inline-flex items-center justify-center gap-3 bg-[var(--accent)] text-[var(--accent-fg)] font-semibold text-base md:text-lg px-7 md:px-9 py-4 md:py-5 rounded-md transition-all hover:bg-[var(--accent-hover)] hover:translate-y-[-1px] shadow-[0_0_32px_-8px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continua
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Footnote */}
        <p className="text-center utility-text text-xs text-[var(--ink-quaternary)] tracking-wider mt-8">
          MOCKUP · selezione non ancora collegata al quiz funnel
        </p>
      </div>
    </main>
  );
}
