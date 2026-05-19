"use client";

import { useState, useCallback, useEffect } from "react";
import { QUESTIONS, calculateResult, RESULT_PROFILES, type QuizResult as QResult } from "../lib/quiz-data";
import QuizIntro from "./QuizIntro";
import QuizQuestion from "./QuizQuestion";
import QuizCalculating from "./QuizCalculating";
import QuizEmailGate from "./QuizEmailGate";
import QuizResult from "./QuizResult";

type Phase = "intro" | "questions" | "calculating" | "email-gate" | "result";
type Lead = { name: string; email: string; phone: string };

type PersistedState = {
  phase: Phase;
  answers: Record<string, string | number>;
  questionIdx: number;
  result: QResult | null;
  lead: Lead | null;
};

const STORAGE_KEY = "mindreset-quiz-state-v1";

function loadPersisted(): Partial<PersistedState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PersistedState;
    // Only restore phase=result se anche result+lead sono presenti (consistency).
    if (parsed.phase === "result" && (!parsed.result || !parsed.lead)) {
      return {};
    }
    // Don't restore transient phases — riparti dall'ultimo punto stabile.
    if (parsed.phase === "calculating" || parsed.phase === "email-gate") {
      return { ...parsed, phase: "questions" };
    }
    return parsed;
  } catch {
    return {};
  }
}

function persist(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {/* sessionStorage full o disabled */}
}

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [result, setResult] = useState<QResult | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage on mount (client-only, post first render to evitare SSR mismatch)
  useEffect(() => {
    const p = loadPersisted();
    if (p.phase) setPhase(p.phase);
    if (p.answers) setAnswers(p.answers);
    if (typeof p.questionIdx === "number") setQuestionIdx(p.questionIdx);
    if (p.result) setResult(p.result);
    if (p.lead) setLead(p.lead);
    setHydrated(true);
  }, []);

  // Persist on every meaningful change
  useEffect(() => {
    if (!hydrated) return;
    persist({ phase, answers, questionIdx, result, lead });
  }, [phase, answers, questionIdx, result, lead, hydrated]);

  const start = useCallback(() => {
    setPhase("questions");
    setQuestionIdx(0);
  }, []);

  const answer = useCallback((qid: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));

    setTimeout(() => {
      const next = questionIdx + 1;
      if (next >= QUESTIONS.length) {
        const updated = { ...answers, [qid]: value };
        const r = calculateResult(updated);
        setResult(r);
        setPhase("calculating");
        setTimeout(() => setPhase("email-gate"), 2400);
      } else {
        setQuestionIdx(next);
      }
    }, 280);
  }, [answers, questionIdx]);

  const submitLead = useCallback((name: string, email: string, phone: string) => {
    const newLead: Lead = { name, email, phone };
    setLead(newLead);
    setPhase("result");

    if (typeof window !== "undefined" && result) {
      const payload = {
        name,
        email,
        phone,
        problem_area: result.problemArea,
        intensity_bucket: result.intensityBucket,
        intensity_score: result.intensityScore,
        body_zone_hint: result.bodyZoneHint,
        answers,
        timestamp: new Date().toISOString(),
        source: "mindreset_quiz",
      };
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {/* noop */});
    }
  }, [result, answers]);

  const goBack = useCallback(() => {
    if (questionIdx > 0) {
      setQuestionIdx(questionIdx - 1);
    } else {
      setPhase("intro");
    }
  }, [questionIdx]);

  if (phase === "intro") {
    return <QuizIntro onStart={start} />;
  }

  if (phase === "questions") {
    const q = QUESTIONS[questionIdx];
    return (
      <QuizQuestion
        question={q}
        currentIdx={questionIdx}
        total={QUESTIONS.length}
        selected={answers[q.id]}
        onAnswer={(value) => answer(q.id, value)}
        onBack={goBack}
      />
    );
  }

  if (phase === "calculating") {
    return <QuizCalculating />;
  }

  if (phase === "email-gate") {
    return <QuizEmailGate onSubmit={submitLead} />;
  }

  if (phase === "result" && result && lead) {
    const profile = RESULT_PROFILES[result.problemArea];
    return <QuizResult result={result} profile={profile} leadName={lead.name} />;
  }

  return null;
}
