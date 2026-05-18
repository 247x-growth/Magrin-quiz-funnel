"use client";

import { useState, useEffect } from "react";
import type { QuizQuestion as QType } from "../lib/quiz-data";

type Props = {
  question: QType;
  currentIdx: number;
  total: number;
  selected?: string | number;
  onAnswer: (value: string | number) => void;
  onBack: () => void;
};

export default function QuizQuestion({
  question,
  currentIdx,
  total,
  selected,
  onAnswer,
  onBack,
}: Props) {
  const progress = ((currentIdx + 1) / total) * 100;

  return (
    <section className="min-h-dvh flex flex-col py-12 md:py-16">
      {/* Top bar, logo + progress */}
      <header className="container-default flex items-center justify-between gap-6 mb-8 md:mb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/metodo-magrin-logo.png"
          alt="Metodo Magrin"
          className="block w-auto"
          style={{ height: "clamp(40px, 4vw, 56px)", aspectRatio: "1200 / 345", objectFit: "contain" }}
        />
        <div className="utility-text text-xs text-[var(--ink-tertiary)] tracking-wider">
          {currentIdx + 1} / {total}
        </div>
      </header>

      {/* Progress bar */}
      <div className="container-default mb-12 md:mb-16">
        <div className="h-1 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 12px var(--accent-glow)",
            }}
            role="progressbar"
            aria-valuenow={currentIdx + 1}
            aria-valuemin={1}
            aria-valuemax={total}
          />
        </div>
      </div>

      {/* Question + options */}
      <div className="container-default flex-1 flex flex-col items-center justify-center max-w-3xl">
        <div className="w-full text-center mb-10 md:mb-14">
          <h2 className="font-display text-[clamp(1.625rem,1rem+2.5vw,2.5rem)] font-bold leading-tight tracking-tight">
            {question.question}
          </h2>
          {question.helper && (
            <p className="mt-4 text-[var(--ink-tertiary)] text-base md:text-lg italic">
              {question.helper}
            </p>
          )}
        </div>

        {question.type === "scale" && question.scaleConfig ? (
          <ScaleInput
            config={question.scaleConfig}
            selected={typeof selected === "number" ? selected : undefined}
            onAnswer={onAnswer}
          />
        ) : (
          <div className="w-full flex flex-col gap-3 md:gap-4">
            {(question.options ?? []).map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onAnswer(opt.id)}
                  className="group text-left relative w-full px-6 md:px-7 py-4 md:py-5 rounded-md border bg-[var(--bg-elevated)] hover:bg-[var(--bg-warm)] transition-all duration-200 hover:translate-y-[-1px]"
                  style={{
                    borderColor: isSelected ? "var(--accent)" : "var(--border)",
                    boxShadow: isSelected ? "0 0 24px var(--accent-glow)" : "none",
                  }}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="shrink-0 w-5 h-5 rounded-full border-2 grid place-items-center transition-all"
                      style={{
                        borderColor: isSelected ? "var(--accent)" : "var(--ink-quaternary)",
                        background: isSelected ? "var(--accent)" : "transparent",
                      }}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-[var(--ink-primary)] text-base md:text-lg leading-snug font-medium">
                      {opt.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Back button */}
        <div className="w-full mt-8 md:mt-12 flex justify-start">
          <button
            type="button"
            onClick={onBack}
            className="utility-text text-sm text-[var(--ink-tertiary)] hover:text-[var(--accent)] transition flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Indietro
          </button>
        </div>
      </div>
    </section>
  );
}

type ScaleConfig = NonNullable<QType["scaleConfig"]>;

function ScaleInput({
  config,
  selected,
  onAnswer,
}: {
  config: ScaleConfig;
  selected?: number;
  onAnswer: (value: number) => void;
}) {
  const [value, setValue] = useState<number>(selected ?? Math.round((config.min + config.max) / 2));

  useEffect(() => {
    if (typeof selected === "number") setValue(selected);
  }, [selected]);

  const pct = ((value - config.min) / (config.max - config.min)) * 100;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <div
          className="font-display font-bold leading-none"
          style={{
            fontSize: "clamp(4rem, 8vw, 7rem)",
            color: "var(--accent)",
            textShadow: "0 0 40px var(--accent-glow)",
          }}
        >
          {value}
        </div>
        <div className="utility-text text-xs text-[var(--ink-tertiary)] tracking-widest mt-2">
          / {config.max}
        </div>
      </div>

      <div className="w-full">
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={1}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          className="w-full appearance-none bg-transparent cursor-pointer"
          aria-label="Intensità del loop"
          style={{
            // Track + thumb styled via global CSS variables
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--bg-elevated) ${pct}%, var(--bg-elevated) 100%)`,
            height: "8px",
            borderRadius: "999px",
            outline: "none",
          }}
        />
        <div className="flex justify-between mt-3 text-xs text-[var(--ink-quaternary)] utility-text tracking-wider">
          <span>1 · {config.minLabel}</span>
          <span>{config.maxLabel} · {config.max}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAnswer(value)}
        className="mt-2 px-8 py-4 rounded-md border font-semibold transition-all duration-200 hover:translate-y-[-1px]"
        style={{
          borderColor: "var(--accent)",
          background: "var(--accent)",
          color: "white",
          boxShadow: "0 0 24px var(--accent-glow)",
        }}
      >
        Conferma
      </button>
    </div>
  );
}
