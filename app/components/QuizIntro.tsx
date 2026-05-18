"use client";

import BodyWithOrbs from "./BodyWithOrbs";

type Props = {
  onStart: () => void;
};

export default function QuizIntro({ onStart }: Props) {
  return (
    <section className="min-h-dvh flex items-center py-16 md:py-24">
      <div className="container-wide grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-center">
        {/* LEFT, narrative */}
        <div className="order-2 lg:order-1 flex flex-col gap-7 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/metodo-magrin-logo.png"
            alt="Metodo Magrin"
            className="block w-auto mx-auto lg:mx-0"
            style={{
              height: "clamp(56px, 6vw, 88px)",
              width: "auto",
              aspectRatio: "1200 / 345",
              objectFit: "contain",
            }}
            loading="eager"
            fetchPriority="high"
          />

          {/* H1 */}
          <h1 className="font-display text-[clamp(2.25rem,1rem+4.5vw,4.25rem)] leading-[1.05] tracking-tight">
            Misurare il tuo loop<br />
            <em className="text-[var(--accent)] font-bold not-italic">è il primo passo per scioglierlo.</em>
          </h1>

          {/* Subtitle — call-out specifico + promise concreta */}
          <p className="text-[1.125rem] md:text-[1.25rem] text-[var(--ink-secondary)] leading-relaxed">
            Se anche tu hai <strong className="text-[var(--ink-deep)]">pensieri negativi che continuano a tornare</strong> e ti tormentano, in 9 domande identifichi <strong className="text-[var(--accent)]">quanto è forte il tuo loop</strong> e la strategia per neutralizzarlo.
            <span className="block mt-3 text-sm text-[var(--ink-tertiary)] italic">9 domande, 90 secondi.</span>
          </p>

          {/* Bullets */}
          <ul className="flex flex-col gap-2.5 utility-text text-[var(--ink-secondary)]">
            <li className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
              <span>Misuri l&apos;intensità del tuo loop su scala 1-10</span>
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
              <span>Identifichi l&apos;area di vita più impattata</span>
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
              <span>Ricevi la strategia col Metodo M.A.G.R.I.N.</span>
            </li>
          </ul>

          {/* CTA */}
          <div>
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-3 bg-[var(--accent)] text-[var(--accent-fg)] font-semibold text-base md:text-lg px-7 md:px-9 py-4 md:py-5 rounded-md transition-all hover:bg-[var(--accent-hover)] hover:translate-y-[-1px] shadow-[0_0_32px_-8px_var(--accent-glow)]"
            >
              Misura il mio loop
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Trust */}
          <p className="utility-text text-[var(--ink-tertiary)] text-xs flex flex-wrap gap-x-3 gap-y-1 justify-center lg:justify-start">
            <span>40.000+ italiani</span>
            <span aria-hidden="true">·</span>
            <span>100.000 libri venduti</span>
            <span aria-hidden="true">·</span>
            <span>Privacy garantita · GDPR</span>
          </p>
        </div>

        {/* RIGHT, body all */}
        <div className="order-1 lg:order-2 flex items-center justify-center">
          <BodyWithOrbs
            activeOrb="all"
            className="w-full max-w-[520px] mx-auto breathe-slow"
          />
        </div>
      </div>
    </section>
  );
}
