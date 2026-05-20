"use client";

import { useEffect, useRef, useState } from "react";
import type { QuizResult as QResult, ResultProfile, Testimonial } from "../lib/quiz-data";

/** Fisher-Yates shuffle. Stable per session via useState lazy init. */
function shuffle<T>(pool: T[]): T[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Props = {
  result: QResult;
  profile: ResultProfile;
  leadName: string;
};

const INTENSITY_LABEL: Record<QResult["intensityBucket"], string> = {
  low: "Bassa",
  mid: "Media",
  high: "Alta",
};

export default function QuizResult({ result, profile, leadName }: Props) {
  const stripeUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://andreamagrin.com/challenge-mindreset-cart";
  const intensityHeadline = profile.headline[result.intensityBucket];

  // Stable shuffle of full testimonial pool per session.
  // QuizResult mounts only after email gate (client-only) → no SSR hydration mismatch.
  const [shownTestimonials] = useState<Testimonial[]>(() => shuffle(profile.testimonials));

  // Hide sticky mobile CTA when the main offer block enters viewport
  // (CTA already visible on screen → sticky becomes redundant).
  const offerBlockRef = useRef<HTMLDivElement | null>(null);
  const [offerInView, setOfferInView] = useState(false);
  useEffect(() => {
    const el = offerBlockRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setOfferInView(e.isIntersecting);
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Forza scroll al top al mount, override del browser scroll restoration
  // (su Android Chrome a volte la TYP apre già con uno scroll piccolo applicato).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <section className="min-h-dvh py-8 md:py-24">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="font-display italic text-[var(--ink-tertiary)] text-base mb-4">
            Risultato per {leadName}
          </p>
          <h1 className="font-display text-[clamp(2rem,1rem+4vw,3.5rem)] font-bold leading-[1.1] tracking-tight">
            {intensityHeadline}
          </h1>
          <p className="mt-5 text-[1.125rem] md:text-[1.25rem] text-[var(--ink-secondary)] leading-relaxed">
            {profile.subhead}
          </p>

          {/* Metric fact-box, editorial style */}
          <div className="mt-10 md:mt-12 max-w-md mx-auto">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center">
              {/* Intensity */}
              <div className="flex flex-col items-end text-right">
                <span className="utility-text text-[10px] md:text-[11px] tracking-[0.2em] text-[var(--ink-tertiary)] uppercase">
                  Intensità
                </span>
                <span
                  className="font-display font-bold leading-none mt-1.5 text-[var(--accent)]"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 2.75rem)",
                    textShadow: "0 0 24px var(--accent-glow)",
                  }}
                >
                  {result.intensityScore !== null ? `${result.intensityScore}/10` : INTENSITY_LABEL[result.intensityBucket]}
                </span>
                <span className="utility-text text-[11px] tracking-wide text-[var(--ink-quaternary)] mt-1">
                  {INTENSITY_LABEL[result.intensityBucket]}
                </span>
              </div>

              {/* Divider */}
              <div
                aria-hidden="true"
                className="h-14 md:h-16 w-px"
                style={{ background: "var(--border)" }}
              />

              {/* Area */}
              <div className="flex flex-col items-start text-left">
                <span className="utility-text text-[10px] md:text-[11px] tracking-[0.2em] text-[var(--ink-tertiary)] uppercase">
                  Area di vita
                </span>
                <span className="font-display font-bold leading-tight mt-1.5 text-[var(--ink-primary)] text-[1.125rem] md:text-[1.375rem]">
                  {profile.area === "relational" ? "Relazionale" : "Performativa"}
                </span>
                <span className="utility-text text-[11px] tracking-wide text-[var(--ink-quaternary)] mt-1">
                  {profile.area === "relational" ? "identitaria" : "energetica"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Solution lead-in — punchy, una sola frase chiave sopra il CTA */}
        <div className="max-w-2xl mx-auto mb-6 md:mb-8 text-center">
          <p className="text-[1.0625rem] md:text-[1.125rem] text-[var(--ink-secondary)] leading-relaxed">
            Per il tuo loop <strong className="text-[var(--ink-primary)]">{profile.area === "relational" ? "relazionale-identitario" : "performativo-energetico"}</strong> c&apos;è una soluzione precisa: <strong className="text-[var(--accent)]">MindReset Challenge</strong>, il video-corso di <strong className="text-[var(--ink-primary)]">7 giorni · 15 min al giorno</strong> col Metodo M.A.G.R.I.N.
          </p>
        </div>

        {/* Mini-CTA inline — sempre visibile (mobile + desktop). Sticky mobile si nasconde quando l'offer block è in viewport */}
        <div className="max-w-2xl mx-auto mb-14 md:mb-20">
          <a
            href={stripeUrl}
            className="group flex items-center justify-between gap-4 bg-white text-[#0F1024] rounded-xl px-5 md:px-7 py-4 md:py-5 transition-all hover:translate-y-[-1px] shadow-[0_0_40px_-10px_var(--accent-glow)] border-2 border-[var(--accent)]"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-[#D63A47] text-base md:text-lg font-bold line-through decoration-[#D63A47] decoration-[2px]">197€</span>
                <span className="font-display text-[1.5rem] md:text-[2rem] text-[#1F7A3A] font-bold leading-none">27 €</span>
              </div>
              <span className="text-[11px] md:text-xs text-[#5C6080] utility-text tracking-wide">MindReset Challenge · 7 giorni · Garanzia rimborso integrale</span>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 bg-[#EA5D35] text-white font-bold text-sm md:text-base px-4 md:px-6 py-3 md:py-3.5 rounded-lg transition group-hover:bg-[#FC7951]">
              Inizia ORA
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </a>
          <p className="text-center text-[var(--ink-secondary)] text-[11px] utility-text tracking-[0.2em] mt-4">
            ↓ &nbsp; scopri perché ti succede
          </p>
        </div>

        {/* Result copy */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-24 flex flex-col gap-10">
          <div>
            <h2 className="font-display text-[1.5rem] md:text-[1.75rem] font-bold leading-tight tracking-tight mb-3">
              Perché ti succede
            </h2>
            <p className="text-[1.0625rem] md:text-[1.125rem] text-[var(--ink-secondary)] leading-relaxed">
              {profile.description}
            </p>
          </div>

          <div>
            <h2 className="font-display text-[1.5rem] md:text-[1.75rem] font-bold leading-tight tracking-tight mb-3">
              Perché finora non ha funzionato
            </h2>
            <p className="text-[1.0625rem] md:text-[1.125rem] text-[var(--ink-secondary)] leading-relaxed">
              {profile.whyItMatters}
            </p>
          </div>

          <div className="p-6 md:p-7 bg-[var(--bg-elevated)] border-l-2 border-[var(--accent)] rounded-r-md">
            <h2 className="font-display text-[1.375rem] md:text-[1.5rem] font-bold leading-tight tracking-tight mb-3">
              Cosa cambia quando lo affronti
            </h2>
            <ul className="flex flex-col gap-2.5">
              {profile.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--ink-primary)] leading-relaxed">
                  <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-24">
          <h2 className="font-display text-[1.5rem] md:text-[2rem] font-bold leading-tight tracking-tight text-center mb-3">
            Persone come te che ce l&apos;hanno fatta
          </h2>
          <p className="text-center text-[var(--ink-tertiary)] text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Storie reali di chi aveva il tuo stesso loop e l&apos;ha sciolto col Metodo M.A.G.R.I.N.
          </p>

          <TestimonialCarousel items={shownTestimonials} />
        </div>

        {/* Offer block */}
        <div ref={offerBlockRef} className="offer-frame relative max-w-3xl mx-auto rounded-2xl overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(45% 0.18 25 / 0.18), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, oklch(45% 0.18 25 / 0.12), transparent 70%)",
            }}
          />
          <div className="relative bg-[var(--bg-elevated)] border md:border-2 border-[var(--accent)] rounded-2xl p-6 md:p-12 shadow-[0_0_40px_-12px_var(--accent-glow)] md:shadow-[0_0_60px_-10px_var(--accent-glow)]">
            <p className="font-display italic text-[var(--ink-tertiary)] text-base mb-4 text-center">
              La soluzione per il tuo loop
            </p>
            <h2 className="font-display text-[clamp(1.75rem,1rem+2vw,2.5rem)] font-bold text-center leading-tight tracking-tight mb-4">
              MindReset Challenge
              <br />
              <span className="text-[var(--accent)]">7 giorni · Metodo M.A.G.R.I.N. completo</span>
            </h2>
            <p className="text-center text-[var(--ink-secondary)] leading-relaxed mb-8 max-w-xl mx-auto">
              Video-corso interattivo di 7 giorni. Ogni giorno una tappa M.A.G.R.I.N., dall&apos;ascolto del loop fino alla sua neutralizzazione.
              {" "}
              <strong className="text-[var(--ink-deep)]">Quindici minuti al giorno.</strong> Niente meditazione. Niente affermazioni.
            </p>

            <ul className="flex flex-col gap-2.5 mb-8 max-w-md mx-auto">
              <li className="flex items-start gap-3 text-[var(--ink-secondary)]">
                <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
                <span>7 video da 15 minuti · uno al giorno</span>
              </li>
              <li className="flex items-start gap-3 text-[var(--ink-secondary)]">
                <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] shrink-0" />
                <span>Esercizi corporei concreti, niente teoria</span>
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

            <div className="bg-white text-[#0F1024] rounded-xl p-5 md:p-10">
              {/* Pricing: stack mobile / inline desktop */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-center md:gap-4 mb-1 text-center">
                <span className="text-[#D63A47] text-xl md:text-5xl font-bold line-through decoration-[#D63A47] decoration-[2px] md:decoration-[3px] md:pb-2 leading-none">
                  197€
                </span>
                <span className="font-display text-[2.75rem] md:text-[5rem] text-[#1F7A3A] font-bold leading-none tracking-tight whitespace-nowrap">
                  27 euro
                </span>
              </div>
              <p className="text-center font-display italic text-[#5C6080] text-sm md:text-base mt-2 mb-5 md:mb-6">
                Risparmi 170€ · Solo per le prossime 24 ore
              </p>

              <a
                href={stripeUrl}
                className="cta-pulse group flex items-center justify-center gap-3 w-full bg-[#EA5D35] text-white font-bold text-base md:text-2xl leading-tight px-5 md:px-10 py-4 md:py-7 rounded-xl transition-all hover:bg-[#FC7951] hover:translate-y-[-2px] text-center"
              >
                <span className="text-balance">Inizia ORA a sciogliere il tuo loop</span>
                <svg className="shrink-0 transition-transform group-hover:translate-x-1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>

              {/* Trust row: 2 righe ordinate mobile, 1 riga desktop */}
              <div className="mt-4 md:mt-5 text-xs md:text-sm text-[#5C6080] text-center leading-relaxed">
                <p className="inline-flex items-center justify-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#EA5D35] shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>Pagamento sicuro Stripe <span aria-hidden="true" className="mx-1">·</span> Garanzia rimborso</span>
                </p>
                <p className="mt-0.5">Visa · Apple Pay · Google Pay</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center utility-text text-xs text-[var(--ink-tertiary)] mt-12 max-w-xl mx-auto">
          Andrea Magrin opera ai sensi della L. 4/2013. Non è medico né psicologo. Il Metodo non sostituisce terapie mediche.
          {" "}
          40.000+ persone l&apos;hanno applicato. 100.000 copie di libri vendute. Brand attivo dal 2019.
        </p>

        <div className="h-24 lg:hidden" aria-hidden="true" />
      </div>

      {/* Sticky mobile CTA — si nasconde quando l'offer block principale è in viewport */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-3 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent transition-opacity duration-300"
        style={{
          opacity: offerInView ? 0 : 1,
          pointerEvents: offerInView ? "none" : "auto",
        }}
        aria-hidden={offerInView}
      >
        <div className="bg-white rounded-xl shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex items-center justify-center gap-3 px-4 pt-3 pb-2">
            <span className="text-[#D63A47] text-lg font-bold line-through decoration-[#D63A47] decoration-[2px]">197€</span>
            <span className="font-display text-[1.75rem] text-[#1F7A3A] font-bold leading-none">27 euro</span>
          </div>
          <a
            href={stripeUrl}
            className="cta-pulse flex items-center justify-center gap-2 w-full bg-[#EA5D35] text-white font-bold text-sm leading-tight px-4 py-3 active:bg-[#FC7951]"
          >
            <span className="text-balance text-center">Inizia ORA a sciogliere il tuo loop</span>
            <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Sticky desktop CTA, compact bottom-right */}
      <a
        href={stripeUrl}
        className="hidden lg:inline-flex group fixed bottom-6 right-6 z-50 items-center gap-3 bg-white text-[#0F1024] rounded-xl px-5 py-3 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.6),0_0_40px_-12px_var(--accent-glow)] border-2 border-[var(--accent)] transition-all hover:translate-y-[-1px]"
        aria-label="Inizia ORA il corso a 27 euro"
      >
        <span className="flex flex-col leading-tight">
          <span className="flex items-baseline gap-2">
            <span className="text-[#D63A47] text-sm font-bold line-through decoration-[#D63A47] decoration-[2px]">197€</span>
            <span className="font-display text-xl text-[#1F7A3A] font-bold leading-none">27 €</span>
          </span>
          <span className="text-[10px] text-[#5C6080] utility-text tracking-wide mt-0.5">Garanzia 7gg</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-[#EA5D35] text-white font-bold text-sm px-4 py-2.5 rounded-lg transition group-hover:bg-[#FC7951]">
          Inizia ORA
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      </a>
    </section>
  );
}

function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  // Detect mobile vs desktop una sola volta al mount (no listener perché un viewport
  // switch a runtime è raro e il refresh ricalcola comunque).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
  }, []);

  if (items.length === 0) return null;

  if (isMobile) return <TestimonialCarouselMobile items={items} />;
  return <TestimonialCarouselDesktop items={items} />;
}

function TestimonialCarouselMobile({ items }: { items: Testimonial[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = containerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };

  useEffect(() => {
    updateEdges();
  }, []);

  const step = (dir: -1 | 1) => {
    const el = containerRef.current;
    if (!el) return;
    // Card width effettiva = clientWidth * 0.75 (card 75vw) + gap 16px
    const stride = el.clientWidth * 0.75 + 16;
    el.scrollBy({ left: dir * stride, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={updateEdges}
        className="overflow-x-auto testimonial-mobile-scroll flex gap-4 snap-x snap-mandatory px-4 -mx-4 pb-2"
        role="region"
        aria-label="Testimonianze, scorri orizzontalmente o usa le frecce"
      >
        {items.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="shrink-0 w-[75vw] max-w-[300px] h-[24rem] snap-start"
          >
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>

      {/* Frecce navigazione */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Testimonianza precedente"
          className="w-11 h-11 rounded-full grid place-items-center bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--ink-primary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Testimonianza successiva"
          className="w-11 h-11 rounded-full grid place-items-center bg-[var(--accent)] text-[var(--accent-fg)] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-[0_0_16px_-4px_var(--accent-glow)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .testimonial-mobile-scroll {
          scroll-padding-left: 1rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .testimonial-mobile-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function TestimonialCarouselDesktop({ items }: { items: Testimonial[] }) {
  // Desktop: auto-scroll marquee come prima, pause-on-hover via CSS.
  const loop = [...items, ...items];
  const durationSec = Math.max(items.length * 9, 30);

  return (
    <div
      className="relative overflow-hidden testimonial-carousel-mask"
      role="region"
      aria-label="Testimonianze, scorrimento automatico, passa sopra per fermare"
    >
      <div
        className="flex gap-6 testimonial-carousel-track"
        style={{ ["--marquee-duration" as string]: `${durationSec}s` }}
      >
        {loop.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="shrink-0 w-[400px] h-[28rem]"
            aria-hidden={i >= items.length}
          >
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .testimonial-carousel-mask {
          mask-image: linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%);
        }
        .testimonial-carousel-track {
          width: max-content;
          animation: tcarousel var(--marquee-duration) linear infinite;
          will-change: transform;
        }
        .testimonial-carousel-mask:hover .testimonial-carousel-track,
        .testimonial-carousel-mask:focus-within .testimonial-carousel-track {
          animation-play-state: paused;
        }
        @keyframes tcarousel {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .testimonial-carousel-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const thumb = t.youtubeId ? `https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg` : null;
  const watchUrl = t.youtubeId ? `https://www.youtube.com/watch?v=${t.youtubeId}` : null;
  const primaryUrl = watchUrl || t.articleUrl;

  return (
    <article
      className="group relative flex flex-col h-full rounded-xl overflow-hidden border bg-[var(--bg-elevated)] transition-all duration-200 hover:translate-y-[-2px]"
      style={{ borderColor: "var(--border)" }}
    >
      {thumb && primaryUrl && (
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-video bg-[var(--bg-deep)] overflow-hidden"
          aria-label={`Guarda la storia di ${t.name}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={`${t.name}, testimonianza video`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 group-hover:bg-black/15">
            <span
              className="w-14 h-14 rounded-full grid place-items-center"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 24px var(--accent-glow)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </a>
      )}
      <div className="flex-1 p-5 md:p-6 flex flex-col gap-3">
        <blockquote className="text-[var(--ink-primary)] text-[0.9375rem] md:text-base leading-relaxed">
          <span aria-hidden="true" className="text-[var(--accent)] font-display text-xl leading-none mr-1">&ldquo;</span>
          {t.quote}
          <span aria-hidden="true" className="text-[var(--accent)] font-display text-xl leading-none ml-1">&rdquo;</span>
        </blockquote>
        <div className="mt-auto pt-2 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="font-display font-bold text-[var(--ink-primary)] text-base">{t.name}</div>
          <div className="utility-text text-xs text-[var(--ink-tertiary)] tracking-wide mt-0.5">{t.context}</div>
          {primaryUrl && (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs utility-text tracking-wider text-[var(--accent)] hover:underline"
            >
              {watchUrl ? "Guarda la storia" : "Leggi il caso"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
