"use client";

import { useState, FormEvent } from "react";

type Props = {
  onSubmit: (name: string, email: string) => void;
};

export default function QuizEmailGate({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = name.trim().length >= 2 && isEmailValid && accepted;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    onSubmit(name.trim(), email.trim().toLowerCase());
  };

  return (
    <section className="min-h-dvh flex items-center py-16 md:py-24">
      <div className="container-narrow flex flex-col items-center text-center max-w-xl mx-auto">
        <h2 className="font-display text-[clamp(1.875rem,1rem+3vw,3rem)] font-bold leading-tight tracking-tight mb-5">
          La diagnosi è pronta.
        </h2>

        <p className="text-[var(--ink-secondary)] text-lg leading-relaxed mb-10 max-w-md">
          Riceverai la diagnosi personalizzata del tuo loop e una mappa M.A.G.R.I.N. del punto critico , 
          {" "}
          <strong className="text-[var(--ink-deep)]">subito</strong>, sulla prossima pagina.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-display text-sm text-[var(--ink-secondary)]">
              Il tuo nome
            </label>
            <input
              id="name"
              type="text"
              autoComplete="given-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md px-4 py-3 text-base text-[var(--ink-primary)] placeholder-[var(--ink-quaternary)] focus:border-[var(--accent)] focus:outline-none focus:shadow-[0_0_16px_-4px_var(--accent-glow)] transition"
              placeholder="Marco"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-display text-sm text-[var(--ink-secondary)]">
              Email per ricevere la diagnosi
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md px-4 py-3 text-base text-[var(--ink-primary)] placeholder-[var(--ink-quaternary)] focus:border-[var(--accent)] focus:outline-none focus:shadow-[0_0_16px_-4px_var(--accent-glow)] transition"
              placeholder="marco@email.it"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1.5 w-4 h-4 accent-[var(--accent)]"
              required
            />
            <span className="utility-text text-xs text-[var(--ink-tertiary)] leading-relaxed">
              Acconsento al trattamento dei dati per ricevere il risultato e comunicazioni del Metodo Magrin.
              {" "}
              <a href="/privacy" target="_blank" rel="noopener" className="underline hover:text-[var(--accent)] transition">
                Privacy policy
              </a>
            </span>
          </label>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="mt-4 inline-flex items-center justify-center gap-3 bg-[var(--accent)] text-[var(--accent-fg)] font-semibold text-base md:text-lg px-7 py-4 md:py-5 rounded-md transition-all hover:bg-[var(--accent-hover)] hover:translate-y-[-1px] shadow-[0_0_32px_-8px_var(--accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitting ? "Carico il risultato…" : "Mostrami il mio loop"}
            {!submitting && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            )}
          </button>

          <p className="utility-text text-xs text-[var(--ink-quaternary)] text-center mt-2">
            Niente spam. Cancellazione con un click. Mai venderemo i tuoi dati.
          </p>
        </form>
      </div>
    </section>
  );
}
