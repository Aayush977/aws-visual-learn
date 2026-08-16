/** Self-check for the spaced-repetition scheduler. Run: pnpm check:review */
import assert from 'node:assert/strict';
import {
  DAY,
  bumpStreak,
  dueCards,
  isDue,
  newCard,
  schedule,
  streakAlive,
  summarise,
  type Card,
} from './review.ts';

const T0 = 1_700_000_000_000; // fixed clock, so nothing here depends on today

// A new card is due immediately and has been seen zero times.
const fresh = newCard('q1', T0);
assert.equal(fresh.interval, 0);
assert.equal(fresh.reps, 0);
assert.ok(isDue(fresh, T0));

// The ordinary path: 0 -> 1 day -> 6 days -> 6*ease.
const g1 = schedule(fresh, 'good', T0);
assert.equal(g1.interval, 1);
assert.equal(g1.due, T0 + DAY);

const g2 = schedule(g1, 'good', T0);
assert.equal(g2.interval, 6);

const g3 = schedule(g2, 'good', T0);
assert.equal(g3.interval, 15); // 6 * 2.5, rounded to 1dp
assert.ok(g3.due > g2.due, 'intervals must keep growing while answers are right');

// schedule() must not mutate its input — callers keep the old card for feedback.
assert.equal(g2.interval, 6, 'scheduling g3 must not have altered g2');

// 'again' sends it back to now, costs ease, and counts a lapse.
const lapsed = schedule(g3, 'again', T0);
assert.equal(lapsed.interval, 0);
assert.equal(lapsed.due, T0);
assert.equal(lapsed.lapses, 1);
assert.ok(lapsed.ease < g3.ease, 'forgetting must reduce ease');
assert.ok(isDue(lapsed, T0));

// Ease is clamped: repeated failure cannot drive it below 1.3.
let grim: Card = newCard('q2', T0);
for (let i = 0; i < 20; i++) grim = schedule(grim, 'again', T0);
assert.ok(grim.ease >= 1.3, `ease floor breached: ${grim.ease}`);

// ...and repeated 'easy' cannot drive it above 2.8.
let breezy: Card = newCard('q3', T0);
for (let i = 0; i < 20; i++) breezy = schedule(breezy, 'easy', T0);
assert.ok(breezy.ease <= 2.8, `ease ceiling breached: ${breezy.ease}`);

// 'hard' advances the card but by less than 'good'.
const hard = schedule(g2, 'hard', T0);
const good = schedule(g2, 'good', T0);
assert.ok(hard.interval < good.interval, 'hard must schedule sooner than good');
assert.ok(hard.ease < good.ease, 'hard must reduce ease, good must not');

// 'easy' advances further than 'good'.
assert.ok(schedule(g2, 'easy', T0).interval > good.interval);

// Only due cards come back, soonest first.
const cards: Card[] = [
  { ...newCard('a', T0), due: T0 + 5 * DAY },
  { ...newCard('b', T0), due: T0 - 2 * DAY },
  { ...newCard('c', T0), due: T0 - 9 * DAY },
];
assert.deepEqual(
  dueCards(cards, T0).map((c) => c.id),
  ['c', 'b'],
);

// Progress counts unseen questions that have no card at all.
const p = summarise([{ ...newCard('a', T0), interval: 30 }, newCard('b', T0)], 10, T0);
assert.equal(p.known, 1);
assert.equal(p.learning, 1);
assert.equal(p.unseen, 8);

// Streaks: same day does not double-count, consecutive days increment.
const day = (n: number) => T0 + n * DAY;
let s = { count: 0, lastDay: -1 };
s = bumpStreak(s, day(0));
assert.equal(s.count, 1);
assert.equal(bumpStreak(s, day(0)).count, 1, 'twice in one day is still one day');
s = bumpStreak(s, day(1));
assert.equal(s.count, 2);
s = bumpStreak(s, day(2));
assert.equal(s.count, 3);

// A missed day resets to 1 — you turned up, so it is not zero.
assert.equal(bumpStreak(s, day(5)).count, 1);

// A streak stays alive today and yesterday, and is dead the day after that.
const live = bumpStreak({ count: 4, lastDay: -1 }, day(3));
assert.ok(streakAlive(live, day(3)));
assert.ok(streakAlive(live, day(4)), 'yesterday still counts — the day is not over');
assert.ok(!streakAlive(live, day(5)));

console.log('review.check.ts — all assertions passed');
