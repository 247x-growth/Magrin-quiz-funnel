"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Mappa delle risposte",
  "Cross-reference somatico",
  "Identificazione del punto critico",
  "Risultato pronto",
];

export default function QuizCalculating() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-dvh flex items-center justify-center py-16">
      <div className="container-narrow text-center flex flex-col items-center gap-10 max-w-md">
        {/* X-Ray scan over Vitruvian body */}
        <div className="xray-frame relative w-56 md:w-64 aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/body-all.png"
            alt=""
            aria-hidden="true"
            width={1024}
            height={1024}
            className="w-full h-full object-contain xray-body"
            draggable={false}
          />

          {/* Scan beam, fast vertical sweep */}
          <span aria-hidden="true" className="xray-beam" />

          {/* Soft cyan tint overlay (X-ray vibe) */}
          <span aria-hidden="true" className="xray-tint" />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-3 items-center">
          <span className="font-display italic text-base text-[var(--ink-tertiary)]">
            Stiamo calcolando il tuo loop
          </span>
          <h2 className="font-display text-[1.25rem] md:text-[1.5rem] font-medium leading-tight tracking-tight text-[var(--ink-primary)]">
            {STEPS[stepIdx]}
          </h2>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="block w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: i <= stepIdx ? "var(--accent)" : "var(--ink-quaternary)",
                opacity: i <= stepIdx ? 1 : 0.4,
                boxShadow: i === stepIdx ? "0 0 8px var(--accent-glow)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .xray-frame {
          isolation: isolate;
        }
        .xray-body {
          opacity: 0.55;
          filter: brightness(1.05) contrast(1.1);
          animation: xray-breathe 3.4s ease-in-out infinite;
        }
        .xray-tint {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(90, 179, 217, 0.12) 0%,
            transparent 70%
          );
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .xray-beam {
          position: absolute;
          left: -4%;
          right: -4%;
          top: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(90, 179, 217, 0) 5%,
            rgba(90, 179, 217, 0.85) 25%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(90, 179, 217, 0.85) 75%,
            rgba(90, 179, 217, 0) 95%,
            transparent 100%
          );
          box-shadow:
            0 0 18px 2px rgba(90, 179, 217, 0.7),
            0 -8px 24px 0 rgba(90, 179, 217, 0.35),
            0 8px 24px 0 rgba(90, 179, 217, 0.35);
          filter: blur(0.5px);
          animation: xray-scan 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          pointer-events: none;
        }
        @keyframes xray-scan {
          0% {
            transform: translateY(0%);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100% * 56));
            opacity: 0;
          }
        }
        @keyframes xray-breathe {
          0%, 100% {
            opacity: 0.5;
            filter: brightness(1) contrast(1.05);
          }
          50% {
            opacity: 0.7;
            filter: brightness(1.12) contrast(1.15);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .xray-beam,
          .xray-body {
            animation: none;
          }
          .xray-beam { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
