/**
 * Quiz MindReset, diagnostic loop type
 *
 * 8 domande, ogni risposta assegna 0-3 punti a uno o più loop type.
 * Il loop type con punteggio più alto → result page personalizzata.
 *
 * 6 loop types mappati ai 6 punti M.A.G.R.I.N.:
 *   1. forehead    , Loop mentale (overthinking, ansia anticipatoria)
 *   2. throat      , Loop espressivo (silenzio forzato, autocensura, blocco)
 *   3. heart       , Loop emotivo (ferite relazionali, lutto, tradimento)
 *   4. solar-plexus, Loop di tensione (controllo, panico, paura)
 *   5. navel       , Loop di radice (autostima, vergogna, identità)
 *   6. pelvis      , Loop di blocco (procrastinazione, dipendenze, fame)
 */

export type LoopType =
  | "forehead"
  | "throat"
  | "heart"
  | "solar-plexus"
  | "navel"
  | "pelvis";

export type Score = Partial<Record<LoopType, number>>;

export type QuizOption = {
  id: string;
  label: string;
  score: Score;
};

export type QuizQuestion = {
  id: string;
  index: number; // 1-based
  question: string;
  helper?: string;
  options: QuizOption[];
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1-localization",
    index: 1,
    question: "Quando un pensiero negativo arriva, dove lo senti per primo nel corpo?",
    helper: "Chiudi gli occhi un secondo. La sensazione fisica precede sempre il pensiero.",
    options: [
      { id: "1a", label: "Tra le sopracciglia, nella testa, dietro gli occhi", score: { forehead: 3 } },
      { id: "1b", label: "Nella gola, come un nodo che non passa",            score: { throat: 3 } },
      { id: "1c", label: "Al centro del petto, una pressione",                score: { heart: 3, "solar-plexus": 1 } },
      { id: "1d", label: "Allo stomaco, un peso che mi accompagna",           score: { "solar-plexus": 3, navel: 1 } },
      { id: "1e", label: "Nella pancia, una vibrazione di fondo",             score: { navel: 3 } },
      { id: "1f", label: "Più giù, una stanchezza che blocca",                score: { pelvis: 3 } },
      { id: "1g", label: "Non lo so dire, è ovunque",                        score: { forehead: 1, "solar-plexus": 1, heart: 1 } },
    ],
  },
  {
    id: "q2-trigger",
    index: 2,
    question: "Cosa fa scattare più spesso questo pattern?",
    options: [
      { id: "2a", label: "Pensare al futuro / al lavoro / a cose da fare",     score: { forehead: 3, "solar-plexus": 1 } },
      { id: "2b", label: "Conversazioni difficili / dover dire qualcosa",       score: { throat: 3 } },
      { id: "2c", label: "Una persona che mi ha ferito / una relazione",         score: { heart: 3 } },
      { id: "2d", label: "Sentirmi in pericolo / fuori controllo",                score: { "solar-plexus": 3 } },
      { id: "2e", label: "Il giudizio degli altri / sentirmi non abbastanza",     score: { navel: 3, throat: 1 } },
      { id: "2f", label: "Nessun motivo apparente, torna e basta",                score: { pelvis: 2, navel: 1 } },
    ],
  },
  {
    id: "q3-frequency",
    index: 3,
    question: "Con che frequenza torna nella tua giornata?",
    options: [
      { id: "3a", label: "Più volte al giorno, anche quando non vorrei",         score: { forehead: 2, "solar-plexus": 2 } },
      { id: "3b", label: "Ogni volta che incontro certe situazioni o persone",   score: { heart: 2, throat: 2 } },
      { id: "3c", label: "Nei momenti di silenzio, quando sono solo",            score: { navel: 2, pelvis: 1 } },
      { id: "3d", label: "Di notte, quando vorrei dormire",                      score: { forehead: 3 } },
      { id: "3e", label: "Quando devo agire / decidere",                         score: { pelvis: 3, "solar-plexus": 1 } },
    ],
  },
  {
    id: "q4-duration",
    index: 4,
    question: "Da quanto tempo convivi con questo loop?",
    options: [
      { id: "4a", label: "Da sempre, è parte di chi sono",                      score: { navel: 2, pelvis: 1 } },
      { id: "4b", label: "Da un evento specifico (separazione, lutto, perdita)", score: { heart: 3 } },
      { id: "4c", label: "Da quando lavoro / produco / mi prendo responsabilità", score: { "solar-plexus": 2, forehead: 2 } },
      { id: "4d", label: "Da poco, ma è già diventato un peso",                  score: { forehead: 1, throat: 1, heart: 1 } },
    ],
  },
  {
    id: "q5-tried",
    index: 5,
    question: "Cosa hai già provato per uscirne?",
    helper: "Più di una se necessario.",
    options: [
      { id: "5a", label: "Meditazione / mindfulness",                            score: { forehead: 1 } },
      { id: "5b", label: "Psicologo / terapia",                                  score: { heart: 1, navel: 1 } },
      { id: "5c", label: "Coaching / corsi di crescita personale",                score: { navel: 1, pelvis: 1 } },
      { id: "5d", label: "Legge di attrazione / libri motivazionali",            score: { forehead: 1, navel: 1 } },
      { id: "5e", label: "Sport / yoga / discipline corporee",                   score: { "solar-plexus": 1, pelvis: 1 } },
      { id: "5f", label: "Nulla, è la prima volta che cerco un metodo",          score: {} },
    ],
  },
  {
    id: "q6-impact",
    index: 6,
    question: "In quale area della tua vita pesa di più?",
    options: [
      { id: "6a", label: "Lavoro / produttività / decisioni",                    score: { "solar-plexus": 3, pelvis: 2 } },
      { id: "6b", label: "Relazioni / partner / famiglia",                       score: { heart: 3, throat: 1 } },
      { id: "6c", label: "Autostima / fiducia in me stesso",                     score: { navel: 3, throat: 1 } },
      { id: "6d", label: "Sonno / energia / corpo",                              score: { forehead: 2, "solar-plexus": 2 } },
      { id: "6e", label: "Tutto un po', non riesco a isolare un'area",            score: { forehead: 1, "solar-plexus": 1, navel: 1 } },
    ],
  },
  {
    id: "q7-action",
    index: 7,
    question: "Quando provi ad agire (lavoro, relazioni, obiettivi), cosa succede?",
    options: [
      { id: "7a", label: "Procrastino, rimando, mi blocco",                       score: { pelvis: 3, "solar-plexus": 1 } },
      { id: "7b", label: "Mi sopra-attivo, faccio troppo, mi esaurisco",         score: { "solar-plexus": 2, forehead: 2 } },
      { id: "7c", label: "Mi controllo, censuro, dico ciò che gli altri vogliono", score: { throat: 3 } },
      { id: "7d", label: "Ho ondate emotive che mi destabilizzano",              score: { heart: 3 } },
      { id: "7e", label: "Mi sento un impostore, indegno di provarci",           score: { navel: 3 } },
    ],
  },
  {
    id: "q8-urgency",
    index: 8,
    question: "Quanto urgente è per te risolverlo?",
    options: [
      { id: "8a", label: "Ho bisogno di un cambio adesso", score: {} },
      { id: "8b", label: "Voglio capire prima di agire",   score: {} },
      { id: "8c", label: "Curiosità, ne ho già provate tante", score: {} },
    ],
  },
];

export type LoopProfile = {
  type: LoopType;
  letter: "M" | "A" | "G" | "R" | "I" | "N";
  step: string;                    // step name M.A.G.R.I.N.
  bodyPoint: string;                // anatomical label (capitalized)
  bodyPointWithArticle: string;     // proper Italian phrasing: "nella gola", "nel cuore", etc.
  imageSrc: string;                 // image to show on result
  title: string;                    // result H1
  description: string;              // 2-3 sentence diagnosis
  whyItMatters: string;             // longer explanation
  resolutionPoint: string;          // M.A.G.R.I.N. step that's critical for them
};

export const LOOP_PROFILES: Record<LoopType, LoopProfile> = {
  "forehead": {
    type: "forehead",
    letter: "M",
    step: "Misurare",
    bodyPoint: "Fronte",
    bodyPointWithArticle: "nella fronte",
    imageSrc: "/body-sequence/01-misurare.png",
    title: "Loop Mentale",
    description:
      "Il tuo loop si manifesta tra le sopracciglia e dietro gli occhi. È il loop di chi pensa troppo, anticipa il futuro, non si ferma mai. La mente analizza un problema all'infinito senza arrivare a una soluzione.",
    whyItMatters:
      "Più analizzi, più il loop si rinforza. È un paradosso: la mente è il peggior strumento per fermare la mente. Ecco perché meditazione e mindfulness spesso falliscono, agiscono sul sintomo, non sulla causa fisica del loop.",
    resolutionPoint:
      "Il tuo punto critico nel Metodo M.A.G.R.I.N. è il primo: MISURARE. Prima di tutto devi imparare a osservare il loop come una sensazione fisica precisa, non come un pensiero astratto.",
  },
  "throat": {
    type: "throat",
    letter: "A",
    step: "Attivare",
    bodyPoint: "Gola",
    bodyPointWithArticle: "nella gola",
    imageSrc: "/body-sequence/02-attivare.png",
    title: "Loop Espressivo",
    description:
      "Il tuo loop si concentra nella gola. È il loop di chi tace ciò che dovrebbe dire, censura, ingoia parole. Crea un nodo fisico che blocca voce, scelte, autenticità.",
    whyItMatters:
      "Ogni parola non detta diventa una tensione che pesa. Il corpo memorizza ogni rinuncia espressiva. Per questo a volte la gola si chiude letteralmente quando dovresti parlare.",
    resolutionPoint:
      "Il tuo punto critico nel Metodo è ATTIVARE. Devi sciogliere la gola attraverso il corpo, non attraverso la decisione mentale di 'doversi esprimere'. La voce torna quando il loop somatico viene neutralizzato.",
  },
  "heart": {
    type: "heart",
    letter: "G",
    step: "Giocare",
    bodyPoint: "Cuore",
    bodyPointWithArticle: "nel cuore",
    imageSrc: "/body-sequence/03-giocare.png",
    title: "Loop Emotivo",
    description:
      "Il tuo loop si annida al centro del petto. È il loop delle ferite relazionali, tradimento, lutto, separazione, rifiuto. La pressione al cuore è la memoria fisica di un dolore che la mente non riesce a chiudere.",
    whyItMatters:
      "Le ferite emotive non si chiudono parlandone. La terapia tradizionale rivisita il dolore senza scioglierlo. Il loop al cuore richiede un approccio paradossale: meno serietà, più gioco.",
    resolutionPoint:
      "Il tuo punto critico è GIOCARE. Lo stato giocoso è incompatibile con il loop emotivo, è biologia pura. Il Metodo Magrin ti insegna a entrarci a comando.",
  },
  "solar-plexus": {
    type: "solar-plexus",
    letter: "R",
    step: "Rilasciare",
    bodyPoint: "Plesso solare",
    bodyPointWithArticle: "nel plesso solare",
    imageSrc: "/body-sequence/04-rilasciare.png",
    title: "Loop di Tensione",
    description:
      "Il tuo loop si scarica sotto le costole, nello stomaco. È il loop del controllo, della paura, dell'iper-vigilanza. Il sistema nervoso è in allarme cronico, il corpo aspetta sempre il pericolo.",
    whyItMatters:
      "Più cerchi di controllare, più la tensione cresce. Sport e respirazione abbassano i sintomi temporaneamente, ma il pattern torna perché la causa è uno schema somatico cristallizzato.",
    resolutionPoint:
      "Il tuo punto critico è RILASCIARE. Devi sciogliere la tensione esattamente nel punto dove si concentra fisicamente, attraverso un protocollo specifico, non con tecniche generaliste.",
  },
  "navel": {
    type: "navel",
    letter: "I",
    step: "Insistere",
    bodyPoint: "Pancia",
    bodyPointWithArticle: "nella pancia",
    imageSrc: "/body-sequence/05-insistere.png",
    title: "Loop di Identità",
    description:
      "Il tuo loop vive nella pancia, nella radice. È il loop di chi non si sente abbastanza, di chi vive con una vergogna di fondo, una sensazione di indegno. È il più antico, spesso ti accompagna da sempre.",
    whyItMatters:
      "L'autostima non si costruisce con affermazioni. Le frasi positive si scontrano con un loop somatico più antico e perdono ogni volta. Coaching, libri, mindset work agiscono in superficie.",
    resolutionPoint:
      "Il tuo punto critico è INSISTERE. Il loop di identità non si scioglie in 3 minuti, richiede un protocollo ripetuto fino all'esaurimento del pattern. Non disciplina mentale: protocollo somatico.",
  },
  "pelvis": {
    type: "pelvis",
    letter: "N",
    step: "Neutralizzare",
    bodyPoint: "Bacino",
    bodyPointWithArticle: "nel bacino",
    imageSrc: "/body-sequence/06-neutralizzare.png",
    title: "Loop di Blocco",
    description:
      "Il tuo loop si manifesta come blocco nel bacino, alla base. È il loop di chi procrastina, rimanda, evita. Quello che chiami pigrizia è un pattern biologico di freeze, il corpo finge la morte davanti alle azioni che richiedono energia.",
    whyItMatters:
      "Disciplina, motivazione, organizzazione, niente tiene se il blocco è somatico. Il corpo letteralmente non si attiva. Per questo nessuna app o sistema produttività dura più di qualche giorno.",
    resolutionPoint:
      "Il tuo punto critico è NEUTRALIZZARE. Devi portare il pattern di freeze a zero attivando il bacino come radice, solo allora le altre tappe del Metodo si stabilizzano.",
  },
};

export function calculateResult(answers: Record<string, string>): LoopType {
  const totals: Record<LoopType, number> = {
    forehead: 0,
    throat: 0,
    heart: 0,
    "solar-plexus": 0,
    navel: 0,
    pelvis: 0,
  };

  for (const q of QUESTIONS) {
    const answerId = answers[q.id];
    if (!answerId) continue;
    const opt = q.options.find((o) => o.id === answerId);
    if (!opt) continue;
    for (const [k, v] of Object.entries(opt.score)) {
      totals[k as LoopType] += v as number;
    }
  }

  // Find max, tiebreaker: priority order forehead → throat → heart → solar → navel → pelvis
  const order: LoopType[] = [
    "forehead",
    "throat",
    "heart",
    "solar-plexus",
    "navel",
    "pelvis",
  ];
  let winner: LoopType = "forehead";
  let max = -1;
  for (const t of order) {
    if (totals[t] > max) {
      max = totals[t];
      winner = t;
    }
  }
  return winner;
}
