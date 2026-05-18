/**
 * Quiz MindReset — classificazione per ProblemArea + IntensityBucket.
 *
 * Revisione 2026-05-17 dopo call con Aldo del 14 mag.
 *
 * KEY INSIGHT (Aldo): il loop NON è localizzato in modo fisso. La stessa persona
 * lo sente in gola un giorno, nel petto un altro. Quindi NO 6 archetipi geo-
 * localizzati come result page. Le 6 lettere M.A.G.R.I.N. sono le FASI del
 * metodo, non tipi di utente.
 *
 * Result page = 2 varianti aggregate per area-vita impattata:
 *   1. "relational"   — Loop relazionale-identitario (relazioni + autostima)
 *   2. "performative" — Loop performativo-energetico (lavoro + abbondanza + sonno/energia)
 *
 * Modulate da IntensityBucket (low 1-3 / mid 4-7 / high 8-10) per la headline.
 *
 * 9 domande (immutate dalla revisione del 17 mag per Aldo):
 *   Q1: dove lo senti nel corpo (rapport/engagement, NON drive result)
 *   Q2: trigger (concorre come fallback per Q7=tutto un po')
 *   Q3: frequenza (metadata)
 *   Q4: intensità 1-10 (scala, drive IntensityBucket)
 *   Q5: durata in anni (metadata)
 *   Q6: cosa hai provato (metadata setter)
 *   Q7: area di vita (drive ProblemArea)
 *   Q8: pattern azione (metadata)
 *   Q9: urgenza (qualifica follow-up)
 *
 * I body-zone scores nelle opzioni Q1-Q3-Q5-Q7-Q8 restano nella struttura dati
 * come METADATO GHL (zona corpo dominante per il setter), MA non determinano
 * più la result page mostrata all'utente.
 */

// =====================================================================
// Tipi metadati zone corpo (solo per GHL setter, NON drive result page)
// =====================================================================

export type BodyZone =
  | "forehead"
  | "throat"
  | "heart"
  | "solar-plexus"
  | "navel"
  | "pelvis";

export type Score = Partial<Record<BodyZone, number>>;

// =====================================================================
// Tipi result page
// =====================================================================

export type ProblemArea = "relational" | "performative";
export type IntensityBucket = "low" | "mid" | "high";

export type QuizResult = {
  problemArea: ProblemArea;
  intensityBucket: IntensityBucket;
  intensityScore: number | null;
  /** Zona corpo dominante, metadato per setter/GHL (NON guida la result page). */
  bodyZoneHint: BodyZone | null;
};

// =====================================================================
// Quiz schema
// =====================================================================

export type QuizOption = {
  id: string;
  label: string;
  score?: Score;
};

export type QuizQuestion = {
  id: string;
  index: number; // 1-based
  question: string;
  helper?: string;
  /** "single" = scelta singola tra options. "scale" = slider 1-10. */
  type: "single" | "scale";
  options?: QuizOption[];
  scaleConfig?: {
    min: 1;
    max: 10;
    minLabel: string;
    maxLabel: string;
    target: "intensity";
  };
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1-localization",
    index: 1,
    type: "single",
    question: "Quando un pensiero negativo arriva, dove lo senti per primo nel corpo?",
    helper:
      "Chiudi gli occhi un secondo. La sensazione fisica precede sempre il pensiero. Non c'è una zona fissa: scegli quella che riconosci di più in questo periodo.",
    options: [
      { id: "1a", label: "Nella gola, come un nodo che non passa", score: { throat: 3 } },
      { id: "1b", label: "Al centro del petto, una pressione", score: { heart: 3, "solar-plexus": 1 } },
      { id: "1c", label: "Tra petto e stomaco, una stretta al diaframma", score: { "solar-plexus": 3 } },
      { id: "1d", label: "Allo stomaco, un peso che mi accompagna", score: { "solar-plexus": 3, navel: 1 } },
      { id: "1e", label: "Nella pancia, una vibrazione di fondo", score: { navel: 3 } },
      { id: "1f", label: "Più giù, una stanchezza che blocca", score: { pelvis: 3 } },
      { id: "1g", label: "Non lo so dire, è ovunque", score: { forehead: 1, "solar-plexus": 1, heart: 1 } },
    ],
  },
  {
    id: "q2-trigger",
    index: 2,
    type: "single",
    question: "Cosa fa scattare più spesso questo pattern?",
    options: [
      { id: "2a", label: "Pensare al futuro / al lavoro / a cose da fare", score: { forehead: 3, "solar-plexus": 1 } },
      { id: "2b", label: "Relazioni con partner, figli, genitori, familiari", score: { throat: 3 } },
      { id: "2c", label: "Una persona che mi ha ferito / una relazione", score: { heart: 3 } },
      { id: "2d", label: "Non sentirmi all'altezza / abbastanza / mancanza di autostima", score: { navel: 3 } },
      { id: "2e", label: "Il giudizio degli altri", score: { navel: 3, throat: 1 } },
      { id: "2f", label: "Nessun motivo apparente, torna e basta", score: { pelvis: 2, navel: 1 } },
    ],
  },
  {
    id: "q3-frequency",
    index: 3,
    type: "single",
    question: "Con che frequenza torna nella tua giornata?",
    options: [
      { id: "3a", label: "Più volte al giorno, anche quando non vorrei", score: { forehead: 2, "solar-plexus": 2 } },
      { id: "3b", label: "Ogni volta che incontro certe situazioni o persone", score: { heart: 2, throat: 2 } },
      { id: "3c", label: "Nei momenti di silenzio, quando sono solo", score: { navel: 2, pelvis: 1 } },
      { id: "3d", label: "Di notte, quando vorrei dormire", score: { forehead: 3 } },
      { id: "3e", label: "Quando mi sveglio al mattino", score: { forehead: 2, "solar-plexus": 1 } },
      { id: "3f", label: "Quando devo agire / decidere", score: { pelvis: 3, "solar-plexus": 1 } },
    ],
  },
  {
    id: "q4-intensity",
    index: 4,
    type: "scale",
    question: "Quando arriva, quanto forte lo senti? Da 1 (appena percettibile) a 10 (travolgente).",
    helper:
      "Questo è il primo passo del Metodo M.A.G.R.I.N.: Misurare l'intensità. L'obiettivo del lavoro è portarla a 0.",
    scaleConfig: {
      min: 1,
      max: 10,
      minLabel: "Appena percettibile",
      maxLabel: "Travolgente",
      target: "intensity",
    },
  },
  {
    id: "q5-duration",
    index: 5,
    type: "single",
    question: "Da quanti anni convivi con questo loop?",
    options: [
      { id: "5a", label: "Meno di 1 anno", score: { throat: 1, heart: 1 } },
      { id: "5b", label: "1-3 anni", score: { "solar-plexus": 1, forehead: 1 } },
      { id: "5c", label: "3-5 anni", score: { navel: 1, "solar-plexus": 1 } },
      { id: "5d", label: "Più di 5 anni / da sempre", score: { navel: 2, pelvis: 1 } },
    ],
  },
  {
    id: "q6-tried",
    index: 6,
    type: "single",
    question: "Cosa hai già provato per uscirne?",
    helper: "Scegli quella su cui hai investito di più.",
    options: [
      { id: "6a", label: "Meditazione / mindfulness", score: { forehead: 1 } },
      { id: "6b", label: "Psicologo / terapia", score: { heart: 1, navel: 1 } },
      { id: "6c", label: "Coaching / crescita personale / PNL", score: { navel: 1, pelvis: 1 } },
      { id: "6d", label: "Legge di attrazione / libri motivazionali", score: { forehead: 1, navel: 1 } },
      { id: "6e", label: "Sport / yoga / discipline corporee", score: { "solar-plexus": 1, pelvis: 1 } },
      { id: "6f", label: "Nulla, è la prima volta che cerco un metodo", score: {} },
    ],
  },
  {
    id: "q7-impact",
    index: 7,
    type: "single",
    question: "In quale area della tua vita pesa di più?",
    options: [
      { id: "7a", label: "Lavoro / produttività / decisioni", score: { "solar-plexus": 3, pelvis: 2 } },
      { id: "7b", label: "Relazioni / partner / famiglia", score: { heart: 3, throat: 1 } },
      { id: "7c", label: "Autostima / fiducia in me stesso", score: { navel: 3, throat: 1 } },
      { id: "7d", label: "Sonno / energia / corpo", score: { forehead: 2, "solar-plexus": 2 } },
      { id: "7e", label: "Abbondanza economica / finanziaria", score: { "solar-plexus": 2, pelvis: 2 } },
      { id: "7f", label: "Tutto un po', non riesco a isolare un'area", score: { forehead: 1, "solar-plexus": 1, navel: 1 } },
    ],
  },
  {
    id: "q8-action",
    index: 8,
    type: "single",
    question: "Quando provi ad agire (lavoro, relazioni, obiettivi), cosa succede?",
    options: [
      { id: "8a", label: "Procrastino, rimando, mi blocco", score: { pelvis: 3, "solar-plexus": 1 } },
      { id: "8b", label: "Mi sopra-attivo, faccio troppo, mi esaurisco", score: { "solar-plexus": 2, forehead: 2 } },
      { id: "8c", label: "Mi controllo, censuro, dico ciò che gli altri vogliono", score: { throat: 3 } },
      { id: "8d", label: "Ho ondate emotive che mi destabilizzano", score: { heart: 3 } },
      { id: "8e", label: "Mi sento un impostore, indegno di provarci", score: { navel: 3 } },
    ],
  },
  {
    id: "q9-urgency",
    index: 9,
    type: "single",
    question: "Quanto urgente è per te risolverlo?",
    helper: "Non contribuisce al risultato, qualifica solo per il follow-up.",
    options: [
      { id: "9a", label: "Ho bisogno di un cambio adesso", score: {} },
      { id: "9b", label: "Voglio capire prima di agire", score: {} },
      { id: "9c", label: "Curiosità, ne ho già provate tante", score: {} },
    ],
  },
];

// =====================================================================
// Mapping → ProblemArea
// =====================================================================

/**
 * Mappa la risposta a Q7 (area di vita) sulla ProblemArea.
 * Se Q7 = "tutto un po'" usa Q2 trigger come fallback.
 */
const Q7_TO_AREA: Record<string, ProblemArea | "fallback"> = {
  "7a": "performative", // lavoro/produttività
  "7b": "relational",   // relazioni/partner/famiglia
  "7c": "relational",   // autostima
  "7d": "performative", // sonno/energia/corpo
  "7e": "performative", // abbondanza economica
  "7f": "fallback",     // tutto un po'
};

const Q2_FALLBACK_TO_AREA: Record<string, ProblemArea> = {
  "2a": "performative", // futuro/lavoro/cose da fare
  "2b": "relational",   // relazioni partner/figli
  "2c": "relational",   // persona che ferisce
  "2d": "relational",   // non sentirsi all'altezza
  "2e": "relational",   // giudizio altri
  "2f": "performative", // nessun motivo (freeze/procrastinazione)
};

// =====================================================================
// Result profiles (2 varianti)
// =====================================================================

export type Testimonial = {
  name: string;
  context: string;
  quote: string;
  /** YouTube video ID se disponibile — usato per thumbnail + link. */
  youtubeId?: string;
  /** URL articolo blog completo. */
  articleUrl?: string;
};

export type ResultProfile = {
  area: ProblemArea;
  /** Headline modulate per intensity bucket. */
  headline: Record<IntensityBucket, string>;
  subhead: string;
  description: string;
  whyItMatters: string;
  bullets: string[];
  testimonials: Testimonial[];
};

export const RESULT_PROFILES: Record<ProblemArea, ResultProfile> = {
  relational: {
    area: "relational",
    headline: {
      low: "Le tue relazioni pesano più di quello che ti racconti.",
      mid: "Il tuo loop si nutre di relazioni e autostima. È più forte di quanto credi.",
      high: "Stai convivendo con un loop relazionale-identitario di intensità alta. È il momento di affrontarlo.",
    },
    subhead:
      "Loop relazionale-identitario: i tuoi pensieri negativi partono dalle relazioni (partner, figli, famiglia, giudizio), non dalle azioni.",
    description:
      "Il tuo loop non è generico. Si attiva quando c'è in mezzo qualcuno: una persona che ami, una che ti ferisce, una che ti giudica, o quella voce dentro che ti dice che non sei abbastanza. È il loop più antico, perché parte da come ti sei sentito visto fin da piccolo.",
    whyItMatters:
      "Terapia, coaching, libri motivazionali agiscono sul racconto. Ma il loop relazionale è prima di tutto somatico: il corpo memorizza l'esperienza relazionale e la rivive ogni volta. Per questo \"capire il problema\" non basta: devi scioglierlo nel corpo.",
    bullets: [
      "Smetti di vivere le relazioni come ostaggio della tua reattività",
      "Sciogli la voce interna del 'non basto' a livello somatico, non mentale",
      "Scegli chi vuoi accanto, non chi sei abituato a sopportare",
    ],
    testimonials: [
      {
        name: "Donatella",
        context: "23 anni di tecniche interiori, dolore amoroso",
        quote:
          "Per me amore era uguale a sofferenza e questo ha condizionato tutta la mia vita di relazione.",
        youtubeId: "JeCx6KBp3AM",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-donatella",
      },
      {
        name: "Nicolas",
        context: "22 anni, autostima e identità",
        quote:
          "A 22 anni avevo il terrore di guardarmi nello specchio. Sono arrivato a toccare il fondo.",
        youtubeId: "YW9unUPg2lc",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-nicolas",
      },
      {
        name: "Sandra",
        context: "Relazioni familiari, ruoli imposti",
        quote: "Ero costretta a casa da mia suocera sette giorni su sette.",
        youtubeId: "aALiBxOxQc0",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-sandra",
      },
      {
        name: "Claudia R",
        context: "Relazione tossica, manipolazione",
        quote:
          "Ero una persona che aveva bisogno della dose di stare male, qualsiasi cosa questa persona mi facesse a me andava bene.",
        youtubeId: "opHySyjj3Wg",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-claudia-r",
      },
      {
        name: "Alessandra",
        context: "40 anni di dolore relazionale, perdono",
        quote:
          "Fino a quel momento ero riuscita a rimanere a galla, tra sali, scendi, poi mi è crollato il mondo addosso.",
        youtubeId: "CO1NhYCU6RE",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-alessandra",
      },
      {
        name: "Enrico",
        context: "23 anni, paura della vita e dell'altro",
        quote:
          "Avevo paura di fare tutto, ordinare al bar, chiedere a una ragazza di uscire. Pensavo di essere rotto.",
        youtubeId: "98fkjchXmNI",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-enrico",
      },
      {
        name: "Ileana",
        context: "Rapporto malsano, dipendenza affettiva",
        quote: "Ero succube di un rapporto malsano e il dolore decideva per me e per la mia vita.",
        youtubeId: "mNqPt2EKGRY",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-ileana",
      },
      {
        name: "Tamara",
        context: "Traumi dell'infanzia, 40 anni di dolore",
        quote: "È stata un'infanzia che mi ha segnata e non trovavo una via d'uscita. Sono crollata.",
        youtubeId: "LzKCUPJQEFM",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-tamara",
      },
      {
        name: "Noemi",
        context: "Cantante, vergogna e approvazione altrui",
        quote:
          "Non mi era mai stato insegnato a mettermi al primo posto. Mi vergognavo. Vivevo per l'approvazione altrui.",
        youtubeId: "1nx2_gvJ1hc",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-noemi",
      },
      {
        name: "Mariangela",
        context: "Voleva cambiare il mondo, non vedeva i suoi limiti",
        quote:
          "Mai avrei pensato che la soluzione sarebbe passata per il corpo. Se hai un sogno il Metodo te lo ingrandisce ancora di più.",
        youtubeId: "8gBSPq8HGxU",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-mariangela",
      },
    ],
  },
  performative: {
    area: "performative",
    headline: {
      low: "Il tuo loop ti rallenta proprio dove conta.",
      mid: "Il tuo loop pesa su lavoro, soldi ed energia. Si vede nei risultati.",
      high: "Stai convivendo con un loop performativo-energetico di intensità alta. Il corpo sta dicendo basta.",
    },
    subhead:
      "Loop performativo-energetico: i tuoi pensieri negativi partono dalle azioni (lavoro, soldi, decisioni, stanchezza), non dalle relazioni.",
    description:
      "Il tuo loop si attiva davanti all'azione: dover decidere, dover produrre, dover incassare, dover semplicemente alzarti la mattina. Non è pigrizia. È un pattern biologico di freeze o sopra-attivazione: il corpo ti tira il freno (o accelera troppo) prima che la testa capisca cosa sta succedendo.",
    whyItMatters:
      "Disciplina, motivazione, app produttività non bastano perché il blocco è somatico. Sport e meditazione abbassano i sintomi temporaneamente ma il pattern torna, perché la causa è uno schema corporeo cristallizzato, non un problema di mindset.",
    bullets: [
      "Smetti di accumulare cose iniziate e mai chiuse",
      "Recuperi energia di base senza dipendere da caffè o spinte motivazionali",
      "Decidi senza rimandare e chiedi senza scusarti",
    ],
    testimonials: [
      {
        name: "Claudia",
        context: "Interior designer, 48 anni, lavoro e autonomia",
        quote:
          "Ero disoccupata dal 2018, senza sapere quale fosse la mia strada, dipendevo dalla mia famiglia. Mi sentivo un peso e senza libertà.",
        youtubeId: "AffvOzuPvbg",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-claudia",
      },
      {
        name: "Elena C",
        context: "Blocco economico → abbondanza",
        quote: "In tre settimane ho trovato i soldi che non avevo. E non mi sono più fermata.",
        youtubeId: "BMHLtjiraM4",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-elena",
      },
      {
        name: "Laura",
        context: "Rabbia cronica, svolta imprenditoriale",
        quote:
          "Per me era normale vivere arrabbiata. Pensavo di non funzionare più, perché non sentivo le sensazioni.",
        youtubeId: "bCfsks8mNNI",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-laura",
      },
      {
        name: "Simona S",
        context: "Imprenditrice internazionale, lutti e blocchi",
        quote:
          "Meditavo da anni, ma il dolore non spariva. Mi domandavo come mai la vita mi rispondesse in questo modo.",
        youtubeId: "bZ0Rtnfokiw",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-simona",
      },
      {
        name: "Monica",
        context: "Operatrice 118, stress e ansia da lavoro",
        quote:
          "Caos mentale e ansia costante. Sono andata avanti più di 10 anni e non ho mai trovato quello che cercavo.",
        youtubeId: "TtpPPzpptaw",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-monica",
      },
      {
        name: "Franca",
        context: "Ansia che svuotava il lavoro",
        quote:
          "Stavo rinunciando al mio lavoro con i ragazzi. Pensavo che eliminandoli l'ansia sarebbe sparita. Ma quella ce l'hai dentro.",
        youtubeId: "nAxvAcghNSQ",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-franca",
      },
      {
        name: "Antonella",
        context: "Traumi infanzia + problemi finanziari",
        quote:
          "Il mio vissuto ha creato le basi per infiniti disastri, è meglio non ricordare l'Antonella di prima.",
        youtubeId: "w-hXCpJhbW8",
        articleUrl: "https://andreamagrin.com/blog-caso-studio-antonella",
      },
    ],
  },
};

// =====================================================================
// Calcolo result
// =====================================================================

export function getIntensityScore(answers: Record<string, string | number>): number | null {
  for (const q of QUESTIONS) {
    if (q.type !== "scale" || q.scaleConfig?.target !== "intensity") continue;
    const v = answers[q.id];
    if (typeof v === "number" && v >= 1 && v <= 10) return v;
    return null;
  }
  return null;
}

export function getIntensityBucket(score: number | null): IntensityBucket {
  if (score === null) return "mid";
  if (score <= 3) return "low";
  if (score <= 7) return "mid";
  return "high";
}

export function getProblemArea(answers: Record<string, string | number>): ProblemArea {
  const q7 = answers["q7-impact"];
  if (typeof q7 === "string") {
    const mapped = Q7_TO_AREA[q7];
    if (mapped === "relational" || mapped === "performative") return mapped;
  }
  // Fallback su Q2 trigger
  const q2 = answers["q2-trigger"];
  if (typeof q2 === "string") {
    const fallback = Q2_FALLBACK_TO_AREA[q2];
    if (fallback) return fallback;
  }
  // Default safe
  return "relational";
}

/**
 * Zona corpo dominante (metadata per setter/GHL).
 * Somma score per zona da tutte le risposte single. Tiebreaker fisso M→A→G→R→I→N.
 * NB: NON guida la result page mostrata all'utente.
 */
export function getBodyZoneHint(answers: Record<string, string | number>): BodyZone | null {
  const totals: Record<BodyZone, number> = {
    forehead: 0,
    throat: 0,
    heart: 0,
    "solar-plexus": 0,
    navel: 0,
    pelvis: 0,
  };
  let anyScore = false;
  for (const q of QUESTIONS) {
    if (q.type !== "single" || !q.options) continue;
    const answerId = answers[q.id];
    if (typeof answerId !== "string") continue;
    const opt = q.options.find((o) => o.id === answerId);
    if (!opt || !opt.score) continue;
    for (const [k, v] of Object.entries(opt.score)) {
      totals[k as BodyZone] += v as number;
      anyScore = true;
    }
  }
  if (!anyScore) return null;
  const order: BodyZone[] = ["forehead", "throat", "heart", "solar-plexus", "navel", "pelvis"];
  let winner: BodyZone = "forehead";
  let max = -1;
  for (const t of order) {
    if (totals[t] > max) {
      max = totals[t];
      winner = t;
    }
  }
  return winner;
}

export function calculateResult(answers: Record<string, string | number>): QuizResult {
  const intensityScore = getIntensityScore(answers);
  return {
    problemArea: getProblemArea(answers),
    intensityBucket: getIntensityBucket(intensityScore),
    intensityScore,
    bodyZoneHint: getBodyZoneHint(answers),
  };
}
