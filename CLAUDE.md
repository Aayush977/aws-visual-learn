# CLAUDE.md

Astro static site teaching AWS CCP (CLF-C02) and SAA (SAA-C03). See [README.md](README.md)
for what's in it and how to run it.

## Audience — this governs every content decision

Career changers with **no IT infrastructure background**. The goal is lessons that are
addictive rather than memorised. Two tests before adding anything: could a total beginner
follow it without looking a word up, and does it give them something to *do* or *feel*
rather than recall?

## Before touching a lesson

Read **[docs/writing-a-lesson.md](docs/writing-a-lesson.md)** first. It has the lesson shape
(cold open → reframe → threaded story → closing callback), the four-company cast every
lesson reuses, the component vocabulary and the frontmatter rules. A lesson written without
it reads as a different site.

Shortest version of the rules people break most:

- **Use the cast** — Kettle & Fox, Meridian, Aldgate Health, Brightwell. Name them. Never
  invent a fifth company.
- **`<Scenario>` must be a different case from the cold open**, not a restatement of it.
- **Never write AWS pricing, free-tier terms or exam figures from memory.** Fetch
  https://aws.amazon.com/free/ or the official exam guide PDF. Stale figures have shipped
  here before, and this audience cannot detect them.

## Code conventions

- **Simulator verdicts come from pure functions in `src/lib`, never from the component.**
  Each has a `*.check.ts` beside it using `node:assert` — no test framework. Change the rule,
  keep the check passing. An animation that drifts from the real rule teaches the wrong thing
  confidently.
- **Internal links go through `url()` / `lessonUrl()`** from `src/lib/paths.ts`. The site is
  served from `/aws-visual-learn/`; a bare `/lessons` href works locally and breaks in
  production.
- **Components carry their own doc comment** explaining the teaching decision behind them.
  Keep that up if you change one.
- Reader state is `localStorage` only. No backend, no accounts, no analytics.

## Checks

```sh
pnpm check:all    # iam + vpc + review self-checks
pnpm build        # validates the content schema, catches MDX errors and bad links
```

Run both before committing lesson or lib changes. `pnpm check` (`astro check`) currently
fails under TypeScript 7 — a known upstream gap, not something you broke. `pnpm build` is
the working gate.

## Git

Commit to **`dev`**. The user pushes and opens the PR to `main` themselves — Pages deploys
only from `main`, so nothing on `dev` is live.

**Claude cannot push.** The SSH key needs a passphrase the tool shell cannot supply. Ask the
user to run `! git push` rather than retrying.
