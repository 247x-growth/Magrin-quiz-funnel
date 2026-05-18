import { Metadata } from "next";
import Quiz from "./components/Quiz";

export const metadata: Metadata = {
  title: "Misura il tuo loop · Metodo Magrin",
  description:
    "Misurare il tuo loop è il primo passo per scioglierlo. Se hai pensieri negativi che continuano a tornare, in 9 domande identifichi quanto è forte e la strategia per scioglierlo.",
  openGraph: {
    title: "Misura il tuo loop in 90 secondi · Metodo Magrin",
    description:
      "Pensieri negativi che continuano a tornare? In 9 domande misuri il tuo loop e ricevi la strategia col Metodo M.A.G.R.I.N.",
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
