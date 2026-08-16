/**
 * Spaced repetition, kept deliberately small.
 *
 * A simplified SM-2. Each card carries an ease factor, an interval in days and
 * a due date; grading it moves those three numbers. Getting something wrong
 * sends it back to the start of the queue, getting it right pushes it further
 * into the future, and the gap grows as you keep getting it right.
 *
 * Everything here is pure — no DOM, no storage — so it can be checked with
 * `pnpm check:review`. The browser half lives in pages/review.astro.
 */

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface Card {
  /** Question id from the bank. */
  id: string;
  /** How generous the schedule is with this card. Higher = longer gaps. */
  ease: number;
  /** Days until it should next be seen. 0 means "again this session". */
  interval: number;
  /** Epoch ms when it becomes due. */
  due: number;
  /** How many times it has been graded. */
  reps: number;
  /** How many times it has been forgotten after being learned. */
  lapses: number;
}

export const DAY = 86_400_000;

/** SM-2's floor. Below this the schedule stops being useful and just nags. */
const MIN_EASE = 1.3;
const MAX_EASE = 2.8;
const START_EASE = 2.5;

/** First two successful intervals are fixed, as in SM-2. */
const FIRST_INTERVAL = 1;
const SECOND_INTERVAL = 6;

export function newCard(id: string, now = Date.now()): Card {
  return { id, ease: START_EASE, interval: 0, due: now, reps: 0, lapses: 0 };
}

const clampEase = (e: number) => Math.min(MAX_EASE, Math.max(MIN_EASE, e));

/**
 * Grade a card and return the updated copy. Never mutates the input, so
 * callers can keep the old value to show "next in 6 days" style feedback.
 */
export function schedule(card: Card, grade: Grade, now = Date.now()): Card {
  const reps = card.reps + 1;

  if (grade === 'again') {
    // Forgotten: back to the front, and the schedule gets warier of this card.
    return {
      ...card,
      ease: clampEase(card.ease - 0.2),
      interval: 0,
      due: now,
      reps,
      lapses: card.lapses + 1,
    };
  }

  let ease = card.ease;
  let interval: number;

  if (grade === 'hard') {
    ease = clampEase(ease - 0.15);
    interval = card.interval === 0 ? FIRST_INTERVAL : Math.max(FIRST_INTERVAL, card.interval * 1.2);
  } else if (grade === 'easy') {
    ease = clampEase(ease + 0.15);
    interval =
      card.interval === 0 ? SECOND_INTERVAL : Math.max(FIRST_INTERVAL, card.interval * ease * 1.3);
  } else {
    // 'good' — the ordinary path. Ease is unchanged.
    interval =
      card.interval === 0
        ? FIRST_INTERVAL
        : card.interval === FIRST_INTERVAL
          ? SECOND_INTERVAL
          : card.interval * ease;
  }

  interval = Math.round(interval * 10) / 10;
  return { ...card, ease, interval, due: now + interval * DAY, reps, lapses: card.lapses };
}

export const isDue = (card: Card, now = Date.now()) => card.due <= now;

/** Cards to work through now: everything due, soonest first. */
export function dueCards(cards: Card[], now = Date.now()): Card[] {
  return cards.filter((c) => isDue(c, now)).sort((a, b) => a.due - b.due);
}

export interface Progress {
  /** Never graded. */
  unseen: number;
  /** Graded, but the interval is still short — not trusted yet. */
  learning: number;
  /** Interval of three weeks or more. */
  known: number;
  due: number;
}

const KNOWN_AFTER_DAYS = 21;

export function summarise(cards: Card[], totalQuestions: number, now = Date.now()): Progress {
  const seen = cards.length;
  const known = cards.filter((c) => c.interval >= KNOWN_AFTER_DAYS).length;
  return {
    unseen: Math.max(0, totalQuestions - seen),
    learning: seen - known,
    known,
    due: cards.filter((c) => isDue(c, now)).length,
  };
}

/* ---------- streak ---------- */

export interface Streak {
  /** Consecutive days with at least one review. */
  count: number;
  /** Day number (epoch days, UTC) of the last review. */
  lastDay: number;
}

/** Epoch day, so "same day" does not depend on the time of day. */
export const dayOf = (ms: number) => Math.floor(ms / DAY);

/**
 * Call once per review session. Reviewing twice in a day does not double the
 * streak; missing a day resets it to 1 rather than 0, because you did just
 * turn up.
 */
export function bumpStreak(streak: Streak, now = Date.now()): Streak {
  const today = dayOf(now);
  if (streak.lastDay === today) return streak;
  if (streak.lastDay === today - 1) return { count: streak.count + 1, lastDay: today };
  return { count: 1, lastDay: today };
}

/** A streak is only alive if it was touched today or yesterday. */
export function streakAlive(streak: Streak, now = Date.now()): boolean {
  const today = dayOf(now);
  return streak.lastDay === today || streak.lastDay === today - 1;
}
