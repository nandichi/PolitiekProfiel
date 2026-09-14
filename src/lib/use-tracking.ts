"use client";

import { useCallback, useMemo, useRef } from "react";
import { nanoid } from "nanoid";
import type { Tier } from "@/lib/dimensions";
import { isBehaviouralTrackingEnabled } from "@/lib/privacy-policy";

export type QuizEventType =
  | "quiz-started"
  | "question-viewed"
  | "question-answered"
  | "question-skipped"
  | "question-back"
  | "info-opened"
  | "resume-prompt"
  | "adaptive-batch"
  | "quiz-completed"
  | "quiz-abandoned";

export interface TrackEventInput {
  type: QuizEventType;
  tier?: Tier;
  adaptive?: boolean;
  questionId?: number;
  value?: number;
  cursor?: number;
  timeOnQuestionMs?: number;
  meta?: Record<string, unknown>;
}

export function newAttemptId(): string {
  return nanoid(12);
}

export interface UseTrackingHandle {
  track: (event: TrackEventInput) => void;
  flushNow: () => void;
  resetAttempt: (next: string) => void;
  getTrackingIdRef: () => string;
  getAttemptIdRef: () => string;
}

/**
 * Quiz interaction telemetry is intentionally disabled. Political answers and
 * behavioural event sequences are not necessary to deliver a result.
 */
export function useTracking(initialAttemptId: string): UseTrackingHandle {
  const attemptRef = useRef<string>(initialAttemptId);

  const track = useCallback((event: TrackEventInput) => {
    void event;
    if (isBehaviouralTrackingEnabled()) {
      throw new Error("Gedragsregistratie is niet geconfigureerd.");
    }
  }, []);

  const flushNow = useCallback(() => {}, []);
  const resetAttempt = useCallback((next: string) => {
    attemptRef.current = next;
  }, []);
  const getTrackingIdRef = useCallback(() => "disabled", []);
  const getAttemptIdRef = useCallback(() => attemptRef.current, []);

  return useMemo(
    () => ({ track, flushNow, resetAttempt, getTrackingIdRef, getAttemptIdRef }),
    [track, flushNow, resetAttempt, getTrackingIdRef, getAttemptIdRef],
  );
}
