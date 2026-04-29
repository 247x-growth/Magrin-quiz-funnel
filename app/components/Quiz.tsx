"use client";

import { useState, useCallback } from "react";
import { QUESTIONS, calculateResult, LOOP_PROFILES, type LoopType } from "../lib/quiz-data";
import QuizIntro from "./QuizIntro";
import QuizQuestion from "./QuizQuestion";
import QuizCalculating from "./QuizCalculating";
import QuizEmailGate from "./QuizEmailGate";
import QuizResult from "./QuizResult";

type Phase = "intro" | "questions" | "calculating" | "email-gate" | "result";

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [result, setResult] = useState<LoopType | null>(null);
  const [lead, setLead] = useState<{ name: string; email: string } | null>(null);

  const start = useCallback(() => {
    setPhase("questions");
    setQuestionIdx(0);
  }, []);

  const answer = useCallback((qid: string, optId: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: optId }));

    // Auto-advance after a beat
    setTimeout(() => {
      const next = questionIdx + 1;
      if (next >= QUESTIONS.length) {
        // Compute result
        const updated = { ...answers, [qid]: optId };
        const r = calculateResult(updated);
        setResult(r);
        setPhase("calculating");
        // Calculating screen for 2.4s, then email gate
        setTimeout(() => setPhase("email-gate"), 2400);
      } else {
        setQuestionIdx(next);
      }
    }, 280);
  }, [answers, questionIdx]);

  const submitLead = useCallback((name: string, email: string) => {
    setLead({ name, email });
    setPhase("result");

    // Fire-and-forget webhook (replace endpoint with real one)
    if (typeof window !== "undefined" && result) {
      const payload = {
        name,
        email,
        loop_type: result,
        answers,
        timestamp: new Date().toISOString(),
        source: "mindreset_quiz",
      };
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {/* noop, will retry via beacon */});
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
        onAnswer={(optId) => answer(q.id, optId)}
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
    const profile = LOOP_PROFILES[result];
    return <QuizResult profile={profile} leadName={lead.name} />;
  }

  return null;
}
