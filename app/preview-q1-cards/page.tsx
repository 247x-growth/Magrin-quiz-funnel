"use client";

/**
 * Mockup statico Q1 — variante CARD-BASED.
 * Ogni card mostra un mini-body con UN orb evidenziato nella zona specifica.
 * Niente hotspot precision-required: l'intera card è touch target.
 *
 * 1 immagine body + SVG overlay che sposta l'orb attivo per card.
 */

import { useState } from "react";

type ZoneId = "1a" | "1b" | "1c" | "1d" | "1e" | "1f" | "1g";

type Zone = {
  id: ZoneId;
  label: string;
  full: string;
  /** y % rispetto al body (1:1). x=50% sempre. undefined per "ovunque". */
  y?: number;
};

const ZONES: Zone[] = [
  { id: "1a", label: "Gola",       full: "Nella gola, come un nodo che non passa",      y: 24 },
  { id: "1b", label: "Petto",      full: "Al centro del petto, una pressione",          y: 33 },
  { id: "1c", label: "Diaframma",  full: "Tra petto e stomaco, una stretta al diaframma", y: 42 },
  { id: "1d", label: "Stomaco",    full: "Allo stomaco, un peso che mi accompagna",     y: 51 },
  { id: "1e", label: "Pancia",     full: "Nella pancia, una vibrazione di fondo",       y: 60 },
  { id: "1f", label: "Più giù",    full: "Più giù, una stanchezza che blocca",          y: 72 },
  { id: "1g", label: "Ovunque",    full: "Non lo so dire, è ovunque" },
];

export default function PreviewQ1Cards() {
  const [selected, setSelected] = useState<ZoneId | null>(null);

  return (
    <main className="min-h-dvh py-10 md:py-16">
      {/* Header */}
      <div className="container-wide mb-10 md:mb-14">
        <div className="flex items-center gap-2 mb-3 utility-text text-xs tracking-widest text-[var(--ink-tertiary)]">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
          MOCKUP STATICO · Q1 variante CARD
        </div>
        <p className="utility-text text-xs text-[var(--ink-quaternary)] tracking-wide max-w-3xl">
          Card cliccabili con mini-body + orb attivo per zona. Touch target = intera card (no precisione richiesta).
        </p>
      </div>

      {/* Question */}
      <div className="container-wide max-w-3xl mx-auto text-center mb-10 md:mb-14">
        <h2 className="font-display text-[clamp(1.5rem,1rem+2vw,2.25rem)] font-bold leading-tight tracking-tight">
          Quando un pensiero negativo arriva, dove lo senti per primo nel corpo?
        </h2>
        <p className="mt-3 text-[var(--ink-tertiary)] text-sm md:text-base italic">
          Scegli quella che riconosci di più in questo periodo.
        </p>
      </div>

      {/* Cards grid */}
      <div className="container-wide max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {ZONES.map((z) => {
            const isSelected = selected === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => setSelected(z.id)}
                aria-pressed={isSelected}
                className="group relative flex flex-col items-center text-center rounded-xl border bg-[var(--bg-elevated)] hover:bg-[var(--bg-warm)] p-3 md:p-4 transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  borderColor: isSelected ? "var(--accent)" : "var(--border)",
                  boxShadow: isSelected ? "0 0 32px -8px var(--accent-glow)" : "none",
                }}
              >
                {/* Mini body with positioned orb */}
                <div className="relative w-full aspect-square mb-2 md:mb-3 overflow-hidden rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/body-all.webp"
                    alt=""
                    aria-hidden="true"
                    className="block w-full h-full object-contain"
                    style={{
                      opacity: 0.35,
                      filter: "saturate(0.4)",
                    }}
                    draggable={false}
                  />
                  {/* SVG overlay: single orb at zone position, or multiple for "ovunque" */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    aria-hidden="true"
                  >
                    {z.y !== undefined ? (
                      <g>
                        {/* halo */}
                        <circle
                          cx="50"
                          cy={z.y}
                          r="9"
                          fill="var(--accent)"
                          opacity={isSelected ? 0.35 : 0.18}
                          style={{ transition: "opacity 0.2s ease" }}
                        />
                        <circle
                          cx="50"
                          cy={z.y}
                          r="5"
                          fill="var(--accent)"
                          opacity={isSelected ? 1 : 0.85}
                          style={{
                            filter: isSelected
                              ? "drop-shadow(0 0 8px var(--accent-glow))"
                              : "drop-shadow(0 0 4px var(--accent-glow))",
                            transition: "all 0.2s ease",
                          }}
                        />
                      </g>
                    ) : (
                      // "Ovunque": multiple soft orbs along the spine
                      [24, 33, 42, 51, 60, 72].map((y) => (
                        <circle
                          key={y}
                          cx="50"
                          cy={y}
                          r={isSelected ? "3.5" : "2.5"}
                          fill="var(--accent)"
                          opacity={isSelected ? 0.85 : 0.6}
                          style={{
                            filter: "drop-shadow(0 0 4px var(--accent-glow))",
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))
                    )}
                  </svg>
                </div>

                {/* Label */}
                <div className="flex flex-col items-center gap-0.5 w-full">
                  <span
                    className="font-display font-bold text-[0.9375rem] md:text-base leading-tight"
                    style={{ color: isSelected ? "var(--accent)" : "var(--ink-primary)" }}
                  >
                    {z.label}
                  </span>
                  <span className="utility-text text-[10px] md:text-[11px] tracking-wide text-[var(--ink-quaternary)] leading-snug line-clamp-2">
                    {z.full}
                  </span>
                </div>

                {/* Selected check */}
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-2 w-5 h-5 rounded-full grid place-items-center"
                    style={{ background: "var(--accent)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue button */}
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

        {/* Compare links */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 utility-text text-xs tracking-wider">
          <a href="/preview-q1" className="text-[var(--ink-tertiary)] hover:text-[var(--accent)] transition">
            ← variante hotspot sul body
          </a>
          <span className="text-[var(--ink-quaternary)]">·</span>
          <a href="/preview" className="text-[var(--ink-tertiary)] hover:text-[var(--accent)] transition">
            preview risultati →
          </a>
        </div>

        <p className="text-center utility-text text-xs text-[var(--ink-quaternary)] tracking-wider mt-4">
          MOCKUP · selezione non ancora collegata al quiz funnel
        </p>
      </div>
    </main>
  );
}
