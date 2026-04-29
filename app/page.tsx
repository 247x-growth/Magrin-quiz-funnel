import { Metadata } from "next";
import Quiz from "./components/Quiz";

export const metadata: Metadata = {
  title: "Misura il tuo loop · Metodo Magrin",
  description:
    "8 domande in 90 secondi per scoprire dove si annida il tuo loop nel corpo, e cosa serve per scioglierlo.",
  openGraph: {
    title: "Misura il tuo loop in 90 secondi · Metodo Magrin",
    description:
      "Il pensiero negativo è una sensazione fisica. Scopri il tuo punto specifico e come scioglierlo.",
    type: "website",
    locale: "it_IT",
    url: "https://andreamagrin.com/quiz",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function QuizLanding() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-[var(--ink-deep)] focus:text-[var(--bg-primary)] focus:px-4 focus:py-2 focus:rounded-md"
      >
        Vai al contenuto principale
      </a>

      <main id="main" className="min-h-dvh">
        <Quiz />
      </main>
    </>
  );
}
