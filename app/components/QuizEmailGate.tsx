"use client";

import { useState, FormEvent } from "react";

type Props = {
  onSubmit: (name: string, email: string, phone: string) => void;
};

/** Country prefixes — IT default, ordinati per rilevanza per audience italiana. */
const PHONE_PREFIXES: { code: string; label: string }[] = [
  { code: "+39", label: "🇮🇹 +39" },
  { code: "+41", label: "🇨🇭 +41" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+34", label: "🇪🇸 +34" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1",  label: "🇺🇸 +1"  },
  { code: "+43", label: "🇦🇹 +43" },
  { code: "+40", label: "🇷🇴 +40" },
  { code: "+32", label: "🇧🇪 +32" },
  { code: "+31", label: "🇳🇱 +31" },
  { code: "+351", label: "🇵🇹 +351" },
];

/** Valida il numero locale (senza prefisso): solo cifre/spazi/-/parentesi, 7-13 cifre. */
function isLocalNumberValid(raw: string): boolean {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  return /^[0-9]{7,13}$/.test(cleaned);
}

export default function QuizEmailGate({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+39");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = isLocalNumberValid(phoneLocal);
  const canSubmit = name.trim().length >= 2 && isEmailValid && phoneValid && accepted;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const fullPhone = `${phonePrefix} ${phoneLocal.trim()}`;
    onSubmit(name.trim(), email.trim().toLowerCase(), fullPhone);
  };

  return (
    <section className="min-h-dvh flex items-center py-16 md:py-24">
      <div className="container-narrow flex flex-col items-center text-center max-w-xl mx-auto">
        <h2 className="font-display text-[clamp(1.875rem,1rem+3vw,3rem)] font-bold leading-tight tracking-tight mb-5">
          Il tuo risultato è pronto.
        </h2>

        <p className="text-[var(--ink-secondary)] text-lg leading-relaxed mb-10 max-w-md">
          Riceverai l&apos;intensità del tuo loop, l&apos;area di vita più impattata e la strategia M.A.G.R.I.N. corrispondente,
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
              Email per ricevere il risultato
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

          <div className="flex flex-col gap-2">
            <label htmlFor="phone-local" className="font-display text-sm text-[var(--ink-secondary)]">
              Telefono <span className="text-[var(--ink-quaternary)] font-normal">(per priorità in lista)</span>
            </label>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  id="phone-prefix"
                  aria-label="Prefisso internazionale"
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  className="appearance-none bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md pl-3 pr-9 py-3 text-base text-[var(--ink-primary)] focus:border-[var(--accent)] focus:outline-none focus:shadow-[0_0_16px_-4px_var(--accent-glow)] transition cursor-pointer"
                  style={{ minWidth: "7.25rem" }}
                >
                  {PHONE_PREFIXES.map((p) => (
                    <option key={p.code} value={p.code} className="bg-[var(--bg-elevated)] text-[var(--ink-primary)]">
                      {p.label}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-tertiary)]"
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <input
                id="phone-local"
                type="tel"
                autoComplete="tel-national"
                required
                inputMode="tel"
                value={phoneLocal}
                onChange={(e) => setPhoneLocal(e.target.value)}
                className="flex-1 min-w-0 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md px-4 py-3 text-base text-[var(--ink-primary)] placeholder-[var(--ink-quaternary)] focus:border-[var(--accent)] focus:outline-none focus:shadow-[0_0_16px_-4px_var(--accent-glow)] transition"
                placeholder="333 1234567"
              />
            </div>
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
