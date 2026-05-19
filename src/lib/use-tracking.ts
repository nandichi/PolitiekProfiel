"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import type { Tier } from "@/lib/dimensions";
import type { QuizEventType } from "@/lib/tracking-store";

const TRACKING_ID_KEY = "politiekprofiel-tracking-id";
const ENDPOINT = "/api/track";
const FLUSH_INTERVAL_MS = 5000;

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

interface QueueItem extends TrackEventInput {
  attemptId: string;
  trackingId: string;
  occurredAt: string;
}

const queue: QueueItem[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let visibilityHandlerAttached = false;

function getTrackingId(): string {
  if (typeof window === "undefined") return "anonymous";
  try {
    const existing = window.localStorage.getItem(TRACKING_ID_KEY);
    if (existing && /^[A-Za-z0-9_-]{6,32}$/.test(existing)) {
      return existing;
    }
    const fresh = nanoid(16);
    window.localStorage.setItem(TRACKING_ID_KEY, fresh);
    return fresh;
  } catch {
    return "anonymous";
  }
}

function flushSync(): void {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([JSON.stringify({ events: batch })], {
        type: "application/json",
      });
      const ok = navigator.sendBeacon(ENDPOINT, blob);
      if (ok) return;
    } catch {
      // valt terug op fetch hieronder.
    }
  }
  try {
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ events: batch }),
      keepalive: true,
    });
  } catch {
    queue.unshift(...batch);
  }
}

function flushAsync(): void {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ events: batch }),
    keepalive: true,
  }).catch(() => {
    queue.unshift(...batch);
  });
}

function ensureGlobalHandlers(): void {
  if (typeof window === "undefined") return;
  if (visibilityHandlerAttached) return;
  visibilityHandlerAttached = true;

  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      flushSync();
    }
  };
  const onPageHide = () => {
    flushSync();
  };

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("beforeunload", onPageHide);
}

function ensureFlushTimer(): void {
  if (typeof window === "undefined") return;
  if (flushTimer) return;
  flushTimer = setInterval(() => {
    if (queue.length > 0) flushAsync();
  }, FLUSH_INTERVAL_MS);
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

export function useTracking(initialAttemptId: string): UseTrackingHandle {
  const [initialTrackingId] = useState(getTrackingId);
  const attemptRef = useRef<string>(initialAttemptId);
  const trackingIdRef = useRef<string>(initialTrackingId);

  useEffect(() => {
    ensureGlobalHandlers();
    ensureFlushTimer();
    return () => {
      flushSync();
    };
  }, []);

  const track = useCallback((event: TrackEventInput) => {
    const trackingId = trackingIdRef.current;
    const attemptId = attemptRef.current;
    if (
      !trackingId ||
      trackingId === "anonymous" ||
      !/^[A-Za-z0-9_-]{6,32}$/.test(attemptId)
    ) {
      return;
    }
    const item: QueueItem = {
      ...event,
      attemptId,
      trackingId,
      occurredAt: new Date().toISOString(),
    };
    queue.push(item);
    if (event.type === "quiz-completed" || event.type === "quiz-abandoned") {
      flushAsync();
    }
  }, []);

  const flushNow = useCallback(() => {
    flushAsync();
  }, []);

  const resetAttempt = useCallback((next: string) => {
    attemptRef.current = next;
  }, []);

  const getTrackingIdRef = useCallback(() => trackingIdRef.current, []);
  const getAttemptIdRef = useCallback(() => attemptRef.current, []);

  return useMemo(
    () => ({
      track,
      flushNow,
      resetAttempt,
      getTrackingIdRef,
      getAttemptIdRef,
    }),
    [track, flushNow, resetAttempt, getTrackingIdRef, getAttemptIdRef],
  );
}
