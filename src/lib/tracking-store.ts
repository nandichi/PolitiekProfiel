import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { firestore } from "@/lib/firebase-admin";
import { payload } from "@/lib/payload";
import type { Tier } from "@/lib/dimensions";

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

export interface EventInput {
  type: QuizEventType;
  attemptId: string;
  trackingId: string;
  tier?: Tier;
  adaptive?: boolean;
  questionId?: number;
  value?: number;
  cursor?: number;
  timeOnQuestionMs?: number;
  occurredAt: string;
  meta?: Record<string, unknown>;
}

interface AttemptDelta {
  questionsSeen: number;
  questionsAnswered: number;
  questionsSkipped: number;
  questionsBack: number;
  infoOpenedCount: number;
  submitted: boolean;
  abandoned: boolean;
  completed: boolean;
  lastEventAt: string;
  firstStartEvent?: {
    tier: Tier;
    adaptive: boolean;
    startedAt: string;
  };
}

const ATTEMPTS_COLLECTION = "quiz-attempts";
const EVENTS_COLLECTION = "quiz-events";

function hasFirestoreConfig(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

function buildDelta(events: EventInput[]): AttemptDelta {
  const delta: AttemptDelta = {
    questionsSeen: 0,
    questionsAnswered: 0,
    questionsSkipped: 0,
    questionsBack: 0,
    infoOpenedCount: 0,
    submitted: false,
    abandoned: false,
    completed: false,
    lastEventAt: "",
  };
  for (const event of events) {
    if (event.occurredAt > delta.lastEventAt) {
      delta.lastEventAt = event.occurredAt;
    }
    switch (event.type) {
      case "quiz-started":
        if (!delta.firstStartEvent && event.tier) {
          delta.firstStartEvent = {
            tier: event.tier,
            adaptive: Boolean(event.adaptive),
            startedAt: event.occurredAt,
          };
        }
        break;
      case "question-viewed":
        delta.questionsSeen += 1;
        break;
      case "question-answered":
        delta.questionsAnswered += 1;
        break;
      case "question-skipped":
        delta.questionsSkipped += 1;
        break;
      case "question-back":
        delta.questionsBack += 1;
        break;
      case "info-opened":
        delta.infoOpenedCount += 1;
        break;
      case "quiz-completed":
        delta.completed = true;
        delta.submitted = true;
        break;
      case "quiz-abandoned":
        delta.completed = true;
        delta.abandoned = true;
        break;
      default:
        break;
    }
  }
  return delta;
}

interface AttemptGroup {
  attemptId: string;
  trackingId: string;
  events: EventInput[];
  delta: AttemptDelta;
}

function groupByAttempt(events: EventInput[]): AttemptGroup[] {
  const map = new Map<string, AttemptGroup>();
  for (const event of events) {
    const key = event.attemptId;
    let group = map.get(key);
    if (!group) {
      group = {
        attemptId: event.attemptId,
        trackingId: event.trackingId,
        events: [],
        delta: {
          questionsSeen: 0,
          questionsAnswered: 0,
          questionsSkipped: 0,
          questionsBack: 0,
          infoOpenedCount: 0,
          submitted: false,
          abandoned: false,
          completed: false,
          lastEventAt: "",
        },
      };
      map.set(key, group);
    }
    group.events.push(event);
  }
  for (const group of map.values()) {
    group.delta = buildDelta(group.events);
  }
  return Array.from(map.values());
}

export async function appendEvents(events: EventInput[]): Promise<void> {
  if (events.length === 0) return;
  const groups = groupByAttempt(events);

  if (hasFirestoreConfig()) {
    await writeToFirestore(groups);
  } else {
    await writeToPayload(groups);
  }
}

async function writeToFirestore(groups: AttemptGroup[]): Promise<void> {
  const db = firestore();
  const batch = db.batch();

  for (const group of groups) {
    const attemptRef = db.collection(ATTEMPTS_COLLECTION).doc(group.attemptId);

    if (group.delta.firstStartEvent) {
      batch.set(
        attemptRef,
        {
          attemptId: group.attemptId,
          trackingId: group.trackingId,
          tier: group.delta.firstStartEvent.tier,
          adaptive: group.delta.firstStartEvent.adaptive,
          startedAt: Timestamp.fromDate(
            new Date(group.delta.firstStartEvent.startedAt),
          ),
          lastEventAt: Timestamp.fromDate(new Date(group.delta.lastEventAt)),
          submitted: false,
          abandoned: false,
          questionsSeen: 0,
          questionsAnswered: 0,
          questionsSkipped: 0,
          questionsBack: 0,
          infoOpenedCount: 0,
        },
        { merge: true },
      );
    }

    const updateData: Record<string, unknown> = {
      lastEventAt: Timestamp.fromDate(new Date(group.delta.lastEventAt)),
    };
    if (group.delta.questionsSeen > 0) {
      updateData.questionsSeen = FieldValue.increment(group.delta.questionsSeen);
    }
    if (group.delta.questionsAnswered > 0) {
      updateData.questionsAnswered = FieldValue.increment(
        group.delta.questionsAnswered,
      );
    }
    if (group.delta.questionsSkipped > 0) {
      updateData.questionsSkipped = FieldValue.increment(
        group.delta.questionsSkipped,
      );
    }
    if (group.delta.questionsBack > 0) {
      updateData.questionsBack = FieldValue.increment(group.delta.questionsBack);
    }
    if (group.delta.infoOpenedCount > 0) {
      updateData.infoOpenedCount = FieldValue.increment(
        group.delta.infoOpenedCount,
      );
    }
    if (group.delta.submitted) updateData.submitted = true;
    if (group.delta.abandoned) updateData.abandoned = true;
    if (group.delta.completed) {
      updateData.completedAt = Timestamp.fromDate(
        new Date(group.delta.lastEventAt),
      );
    }
    batch.set(attemptRef, updateData, { merge: true });

    for (const event of group.events) {
      const eventRef = db.collection(EVENTS_COLLECTION).doc();
      const payload: Record<string, unknown> = {
        type: event.type,
        attemptId: event.attemptId,
        trackingId: event.trackingId,
        occurredAt: Timestamp.fromDate(new Date(event.occurredAt)),
      };
      if (event.tier !== undefined) payload.tier = event.tier;
      if (event.adaptive !== undefined) payload.adaptive = event.adaptive;
      if (event.questionId !== undefined) payload.questionId = event.questionId;
      if (event.value !== undefined) payload.value = event.value;
      if (event.cursor !== undefined) payload.cursor = event.cursor;
      if (event.timeOnQuestionMs !== undefined) {
        payload.timeOnQuestionMs = event.timeOnQuestionMs;
      }
      if (event.meta && Object.keys(event.meta).length > 0) {
        payload.meta = event.meta;
      }
      batch.set(eventRef, payload);
    }
  }

  await batch.commit();

  for (const group of groups) {
    if (!group.delta.completed) continue;
    const ref = db.collection(ATTEMPTS_COLLECTION).doc(group.attemptId);
    const snap = await ref.get();
    if (!snap.exists) continue;
    const data = snap.data() ?? {};
    const startedAt = data.startedAt;
    if (startedAt instanceof Timestamp) {
      const completedAt = new Date(group.delta.lastEventAt);
      const durationMs = Math.max(
        0,
        completedAt.getTime() - startedAt.toDate().getTime(),
      );
      await ref.update({ durationMs });
    }
  }
}

async function writeToPayload(groups: AttemptGroup[]): Promise<void> {
  const p = await payload();

  for (const group of groups) {
    const existing = await p.find({
      collection: "quiz-attempts",
      where: { attemptId: { equals: group.attemptId } },
      limit: 1,
      depth: 0,
    });

    if (existing.docs.length === 0) {
      if (!group.delta.firstStartEvent) {
        continue;
      }
      await p.create({
        collection: "quiz-attempts",
        data: {
          attemptId: group.attemptId,
          trackingId: group.trackingId,
          tier: group.delta.firstStartEvent.tier,
          adaptive: group.delta.firstStartEvent.adaptive,
          startedAt: group.delta.firstStartEvent.startedAt,
          lastEventAt: group.delta.lastEventAt,
          submitted: false,
          abandoned: false,
          questionsSeen: 0,
          questionsAnswered: 0,
          questionsSkipped: 0,
          questionsBack: 0,
          infoOpenedCount: 0,
        },
      });
    }

    const docs = await p.find({
      collection: "quiz-attempts",
      where: { attemptId: { equals: group.attemptId } },
      limit: 1,
      depth: 0,
    });
    if (docs.docs.length === 0) continue;
    const doc = docs.docs[0] as unknown as {
      id: number;
      startedAt: string;
      questionsSeen: number;
      questionsAnswered: number;
      questionsSkipped: number;
      questionsBack: number;
      infoOpenedCount: number;
      submitted: boolean;
      abandoned: boolean;
    };

    const update: Record<string, unknown> = {
      lastEventAt: group.delta.lastEventAt,
      questionsSeen:
        (doc.questionsSeen ?? 0) + group.delta.questionsSeen,
      questionsAnswered:
        (doc.questionsAnswered ?? 0) + group.delta.questionsAnswered,
      questionsSkipped:
        (doc.questionsSkipped ?? 0) + group.delta.questionsSkipped,
      questionsBack: (doc.questionsBack ?? 0) + group.delta.questionsBack,
      infoOpenedCount:
        (doc.infoOpenedCount ?? 0) + group.delta.infoOpenedCount,
    };
    if (group.delta.submitted) update.submitted = true;
    if (group.delta.abandoned) update.abandoned = true;
    if (group.delta.completed) {
      update.completedAt = group.delta.lastEventAt;
      const completedAt = new Date(group.delta.lastEventAt).getTime();
      const startedAt = new Date(doc.startedAt).getTime();
      update.durationMs = Math.max(0, completedAt - startedAt);
    }

    await p.update({
      collection: "quiz-attempts",
      id: doc.id,
      data: update,
    });

    for (const event of group.events) {
      await p.create({
        collection: "quiz-events",
        data: {
          type: event.type,
          attemptId: event.attemptId,
          trackingId: event.trackingId,
          occurredAt: event.occurredAt,
          tier: event.tier,
          adaptive: event.adaptive ?? false,
          questionId: event.questionId,
          value: event.value,
          cursor: event.cursor,
          timeOnQuestionMs: event.timeOnQuestionMs,
          meta: event.meta && Object.keys(event.meta).length > 0
            ? event.meta
            : undefined,
        },
      });
    }
  }
}

export async function markSubmitted(
  attemptId: string,
  shareId: string,
): Promise<void> {
  if (!attemptId) return;

  if (hasFirestoreConfig()) {
    const db = firestore();
    const ref = db.collection(ATTEMPTS_COLLECTION).doc(attemptId);
    const snap = await ref.get();
    if (!snap.exists) return;
    const data = snap.data() ?? {};
    const startedAt = data.startedAt;
    const completedAt = new Date();
    const update: Record<string, unknown> = {
      submitted: true,
      shareId,
      completedAt: Timestamp.fromDate(completedAt),
      lastEventAt: Timestamp.fromDate(completedAt),
    };
    if (startedAt instanceof Timestamp) {
      update.durationMs = Math.max(
        0,
        completedAt.getTime() - startedAt.toDate().getTime(),
      );
    }
    await ref.update(update);
    return;
  }

  const p = await payload();
  const res = await p.find({
    collection: "quiz-attempts",
    where: { attemptId: { equals: attemptId } },
    limit: 1,
    depth: 0,
  });
  if (res.docs.length === 0) return;
  const doc = res.docs[0] as unknown as {
    id: number;
    startedAt: string;
  };
  const completedAt = new Date();
  await p.update({
    collection: "quiz-attempts",
    id: doc.id,
    data: {
      submitted: true,
      shareId,
      completedAt: completedAt.toISOString(),
      lastEventAt: completedAt.toISOString(),
      durationMs: Math.max(
        0,
        completedAt.getTime() - new Date(doc.startedAt).getTime(),
      ),
    },
  });
}
