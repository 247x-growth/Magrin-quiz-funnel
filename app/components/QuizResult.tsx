"use client";

import BodyWithOrbs from "./BodyWithOrbs";
import type { LoopProfile, LoopType } from "../lib/quiz-data";

const LOOP_INDEX: Record<LoopType, number> = {
  forehead: 0,
  throat: 1,
  heart: 2,
  "solar-plexus": 3,
  navel: 4,
  pelvis: 5,
};

type Props = {
  profile: LoopProfile;
  leadName: string;
};

export default function QuizResult({ profile, leadName }: Props) {
  const stripeUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://andreamagrin.com/challenge-mindreset-cart";
  const orbIdx = LOOP_INDEX[profile.type];

  return (
    <section className="min-h-dvh py-16 md:py-24">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="font-display italic text-[var(--ink-tertiary)] text-base mb-4">
            Risultato per {leadName}
          </p>
          <h1 className="font-display text-[clamp(2rem,1rem+4vw,3.75rem)] font-bold leading-[1.05] tracking-tight">
            Il tuo loop principale è{" "}
            <em className="text-[var(--accent)] not-italic">{profile.bodyPointWithArticle}.</em>
          </h1>
          <p className="mt-5 text-[1.125rem] md:text-[1.25rem] text-[var(--ink-secondary)] leading-relaxed">
            <strong className="text-[var(--ink-deep)]">{profile.title}</strong>
            {", "}
            la tua tappa critica nel Metodo M.A.G.R.I.N. è <strong className="text-[var(--accent)]">{profile.step}</strong>.
          </p>
        </div>

        {/* Body + Diagnosis */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 items-center mb-16 md:mb-24">
          <div className="flex items-center justify-center">
            <BodyWithOrbs
              activeOrb={orbIdx}
              className="w-full max-w-[480px] mx-auto breathe-slow"
              showLabels
            />
          </div>

          <div className="flex flex-col gap-8">
            {/* Diagnosis */}
            <div>
              <h2 className="font-display text-[1.5rem] md:text-[1.75rem] font-bold leading-tight tracking-tight mb-3">
                La tua diagnosi
              </h2>
              <p className="font-display text-[1.125rem] md:text-[1.25rem] text-[var(--ink-secondary)] leading-snug">
                {profile.description}
              </p>
            </div>

            {/* Why it matters */}
            <div>
              <h2 className="font-display text-[1.5rem] md:text-[1.75rem] font-bold leading-tight tracking-tight mb-3">
                Perché finora non ha funzionato
              </h2>
              <p className="text-[var(--ink-secondary)] leading-relaxed">
                {profile.whyItMatters}
              </p>
            </div>

            {/* Resolution */}
            <div className="p-6 md:p-7 bg-[var(--bg-elevated)] border-l-2 border-[var(--accent)] rounded-r-md">
              <h2 className="font-display text-[1.375rem] md:text-[1.5rem] font-bold leading-tight tracking-tight mb-2">
                <span className="text-[var(--accent)]">{profile.letter}.</span> La tua tappa critica: {profile.step}
              </h2>
              <p className="text-[var(--ink-primary)] leading-relaxed">
                {profile.resolutionPoint}
              </p>
            </div>
          </div>
        </div>

        {/* Offer block, sales-direct, amplified */}
        <div className="offer-frame relative max-w-3xl mx-auto rounded-2xl overflow-hidden">
          {/* Crimson aurora behind */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(45% 0.18 25 / 0.18), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, oklch(45% 0.18 25 / 0.12), transparent 70%)",
            }}
          />
          <div className="relative bg-[var(--bg-elevated)] border-2 border-[var(--accent)] rounded-2xl p-8 md:p-12 shadow-[0_0_60px_-10px_var(--accent-glow)]">
          <p className="font-display italic text-[var(--ink-tertiary)] text-base mb-4 text-center">
            La soluzione specifica per il tuo loop
          </p>
          <h2 className="font-display text-[clamp(1.75rem,1rem+2vw,2.5rem)] font-bold text-center leading-tight tracking-tight mb-4">
            MindReset Challenge
            <br />
            <span className="text-[var(--accent)]">7 giorni · {profile.step} è il giorno {profile.letter === "M" ? "1-2" : profile.letter === "A" ? "2-3" : profile.letter === "G" ? "3-4" : profile.letter === "R" ? "4-5" : profile.letter === "I" ? "5-6" : "6-7"}</span>
          </h2>
          <p className="text-center text-[var(--ink-secondary)] leading-relaxed mb-8 max-w-xl mx-auto">
            Video-corso interattivo di 7 giorni. Ogni giorno una tappa M.A.G.R.I.N., il tuo punto specifico viene affrontato in profondità.
            {" "}
            <strong className="text-[var(--ink-deep)]">Quindici minuti al giorno.</strong> Niente meditazione. Niente affermazioni.
          </p>

          {/* Bullets */}
          <ul className="flex flex-col gap-2.5 mb-8 max-w-md mx-auto">
            <li className="flex items-start gap-3 text-[var(--ink-secondary)]">
              <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
              <span>7 video da 15 minuti · uno al giorno</span>
            </li>
            <li className="flex items-start gap-3 text-[var(--ink-secondary)]">
              <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
              <span>Esercizi corporei concreti specifici per il tuo punto</span>
            </li>
            <li className="flex items-start gap-3 text-[var(--ink-secondary)]">
              <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
              <span>Tutor in chat se ti blocchi</span>
            </li>
            <li className="flex items-start gap-3 text-[var(--ink-secondary)]">
              <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
              <span>Doppia garanzia: rimborso integrale + tieni i materiali</span>
            </li>
          </ul>

          {/* Price + CTA, dramatic — light card on dark page for pop */}
          <div className="bg-white text-[#0F1024] rounded-xl p-6 md:p-10 -mx-2 md:mx-0">
            <div className="flex items-end justify-center gap-4 mb-1">
              <span className="text-[#D63A47] text-3xl md:text-5xl font-bold line-through decoration-[#D63A47] decoration-[3px] pb-2">
                197€
              </span>
              <span className="font-display text-[3.5rem] md:text-[5rem] text-[#1F7A3A] font-bold leading-none tracking-tight">
                27 euro
              </span>
            </div>
            <p className="text-center font-display italic text-[#5C6080] text-sm md:text-base mb-6">
              Risparmi 170€ · Solo per le prossime 24 ore
            </p>

            <a
              href={stripeUrl}
              className="cta-pulse group flex items-center justify-center gap-3 w-full bg-[#EA5D35] text-white font-bold text-lg md:text-2xl leading-tight px-6 md:px-10 py-5 md:py-7 rounded-xl transition-all hover:bg-[#FC7951] hover:translate-y-[-2px] text-center"
            >
              <span className="text-balance">Inizia ORA il corso e diventa la migliore versione di te stesso</span>
              <svg className="shrink-0 transition-transform group-hover:translate-x-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>

            <p className="text-sm text-[#5C6080] mt-5 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-center">
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#EA5D35]"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Pagamento sicuro Stripe
              </span>
              <span aria-hidden="true">·</span>
              <span>Visa · Apple Pay · Google Pay</span>
              <span aria-hidden="true">·</span>
              <span>Garanzia 7 giorni</span>
            </p>
          </div>
          </div>
        </div>

        {/* Bottom trust */}
        <p className="text-center utility-text text-xs text-[var(--ink-tertiary)] mt-12 max-w-xl mx-auto">
          Andrea Magrin opera ai sensi della L. 4/2013. Non è medico né psicologo. Il Metodo non sostituisce terapie mediche.
          {" "}
          40.000+ persone l&apos;hanno applicato. 100.000 copie di libri vendute. Brand attivo dal 2019.
        </p>

        {/* Spacer per evitare che lo sticky CTA copra contenuto su mobile */}
        <div className="h-24 lg:hidden" aria-hidden="true" />
      </div>

      {/* STICKY MOBILE CTA, sempre visibile durante scroll */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-3 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent">
        <div className="bg-white rounded-xl shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Prices row */}
          <div className="flex items-center justify-center gap-3 px-4 pt-3 pb-2">
            <span className="text-[#D63A47] text-lg font-bold line-through decoration-[#D63A47] decoration-[2px]">197€</span>
            <span className="font-display text-[1.75rem] text-[#1F7A3A] font-bold leading-none">27 euro</span>
          </div>
          {/* CTA button */}
          <a
            href={stripeUrl}
            className="cta-pulse flex items-center justify-center gap-2 w-full bg-[#EA5D35] text-white font-bold text-sm leading-tight px-4 py-3 active:bg-[#FC7951]"
          >
            <span className="text-balance text-center">Inizia ORA il corso e diventa la migliore versione di te stesso</span>
            <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
