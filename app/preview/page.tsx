"use client";

import { useState } from "react";
import QuizResult from "../components/QuizResult";
import {
  RESULT_PROFILES,
  type ProblemArea,
  type IntensityBucket,
  type QuizResult as QResult,
} from "../lib/quiz-data";

/**
 * Preview route — non-production. Permette di vedere tutte le 6 varianti
 * di result page (2 area × 3 intensity) senza fare il quiz.
 * Accessibile via /preview.
 */

const AREAS: ProblemArea[] = ["relational", "performative"];
const INTENSITIES: IntensityBucket[] = ["low", "mid", "high"];

const INTENSITY_SCORE: Record<IntensityBucket, number> = {
  low: 2,
  mid: 6,
  high: 9,
};

const AREA_LABEL: Record<ProblemArea, string> = {
  relational: "Relazionale-identitaria",
  performative: "Performativa-energetica",
};

const INTENSITY_LABEL: Record<IntensityBucket, string> = {
  low: "Bassa (1-3)",
  mid: "Media (4-7)",
  high: "Alta (8-10)",
};

export default function PreviewPage() {
  const [area, setArea] = useState<ProblemArea>("relational");
  const [intensity, setIntensity] = useState<IntensityBucket>("mid");

  const mockResult: QResult = {
    problemArea: area,
    intensityBucket: intensity,
    intensityScore: INTENSITY_SCORE[intensity],
    bodyZoneHint: "solar-plexus",
  };

  return (
    <main className="min-h-dvh">
      {/* Preview toolbar — fixed top */}
      <div
        className="sticky top-0 z-[60] backdrop-blur-md"
        style={{
          background: "rgba(0, 0, 15, 0.85)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container-wide flex flex-wrap items-center gap-4 md:gap-6 py-3">
          <div className="flex items-center gap-2 utility-text text-xs tracking-widest text-[var(--ink-tertiary)]">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
            PREVIEW
          </div>

          {/* Area switcher */}
          <div className="flex items-center gap-2">
            <span className="utility-text text-xs text-[var(--ink-tertiary)] tracking-wider">AREA</span>
            <div className="inline-flex rounded-md overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              {AREAS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className="px-3 py-1.5 text-xs utility-text tracking-wide transition-colors"
                  style={{
                    background: area === a ? "var(--accent)" : "transparent",
                    color: area === a ? "white" : "var(--ink-secondary)",
                  }}
                >
                  {AREA_LABEL[a]}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity switcher */}
          <div className="flex items-center gap-2">
            <span className="utility-text text-xs text-[var(--ink-tertiary)] tracking-wider">INTENSITÀ</span>
            <div className="inline-flex rounded-md overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              {INTENSITIES.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIntensity(i)}
                  className="px-3 py-1.5 text-xs utility-text tracking-wide transition-colors"
                  style={{
                    background: intensity === i ? "var(--accent)" : "transparent",
                    color: intensity === i ? "white" : "var(--ink-secondary)",
                  }}
                >
                  {INTENSITY_LABEL[i]}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto utility-text text-[10px] tracking-widest text-[var(--ink-quaternary)]">
            COMBO {AREAS.indexOf(area) * 3 + INTENSITIES.indexOf(intensity) + 1} / 6
          </div>
        </div>
      </div>

      <QuizResult
        key={`${area}-${intensity}`}
        result={mockResult}
        profile={RESULT_PROFILES[area]}
        leadName="Luca"
      />
    </main>
  );
}
