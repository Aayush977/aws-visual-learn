# aws-visual-learn

Visual, story-led lessons for the AWS **Cloud Practitioner (CLF-C02)** and **Solutions
Architect Associate (SAA-C03)** exams.

**Live:** https://aayush977.github.io/aws-visual-learn/

## Who this is for

People coming into AWS from another profession, with no IT infrastructure background — the
reader who has never heard of a subnet and is not being helped by a bullet list that assumes
they have. The goal is that the lessons are *addictive rather than memorised*: every concept
arrives attached to somebody's bad Tuesday, and the reader leaves with something they can
picture instead of something they have to revise.

That audience decision drives everything else in this repo. Before adding anything, ask the
two questions in [docs/writing-a-lesson.md](docs/writing-a-lesson.md): could a total beginner
follow this without looking a word up, and does it give them something to *do* or *feel*
rather than recall?

## What's in it

| | |
|---|---|
| **39 lessons** | across 11 tracks, from "what is cloud computing" to ten full architectures |
| **A 67-term jargon buster** | each word in pub English first, then the way the exam means it |
| **87 quiz questions** | written in exam style, every option carrying a `why` — including the wrong ones |
| **23 practice exams** | 1,142 questions, built from a public MIT-licensed bank (see below) |
| **2 study paths** | `/path/ccp` and `/path/saa`, ordered, with read-progress ticks |
| **A spaced-repetition queue** | `/review`, simplified SM-2, day streak, exam filter |
| **Two live simulators** | IAM policy evaluation and VPC packet reachability |

Everything is static. All reader state (read lessons, review schedule, checklists, streak)
lives in `localStorage` — there is no account, no backend and no analytics.

## Running it

```sh
pnpm install
pnpm dev            # http://localhost:4321/aws-visual-learn
```

| Command | Does |
|---|---|
| `pnpm dev` | dev server |
| `pnpm build` | static build into `dist/` |
| `pnpm preview` | serve the built site |
| `pnpm check` | `astro check` — types and content-schema validation. **Currently fails**, see below |
| `pnpm check:all` | the three logic self-checks below |
| `pnpm build:practice-exams` | regenerate `src/data/practice-exams.json` from the upstream question bank |

> **`pnpm check` is broken right now**, and not by anything in this repo: `@astrojs/check`
> needs TypeScript's programmatic API, which the native TS 7 compiler does not ship yet
> ([astro roadmap #1321](https://github.com/withastro/roadmap/discussions/1321)). Until it
> does, either pin `typescript` to 6.x or lean on `pnpm build`, which still validates the
> content schema and catches MDX errors.

### The self-checks

The two simulators animate a verdict, and an animation that drifts away from the real rule
teaches the wrong thing confidently. So each one's verdict comes from a **pure function** in
`src/lib`, with a plain `node:assert` self-check beside it. No test framework.

```sh
pnpm check:iam      # src/lib/iam.ts        — policy evaluation order
pnpm check:vpc      # src/lib/reachability.ts — packet reachability
pnpm check:review   # src/lib/review.ts     — SM-2 scheduler
pnpm check:all      # all three
```

If you change a rule in one of those files, the check next to it is the thing that has to keep
passing.

## Layout

```
src/
  content/lessons/*.mdx   every lesson; frontmatter schema in src/content.config.ts
  content.config.ts       TRACKS, EXAMS and the lesson schema — the curriculum outline
  components/             the teaching vocabulary (Diagram, Quiz, Scenario, Confusable, …)
  components/svg/         Node, Wire, Boundary — the pieces diagrams are drawn from
  lib/                    pure logic + its *.check.ts self-checks
  pages/                  routes: lessons, paths, quiz, practice, review
  data/practice-exams.json  generated — see scripts/build-practice-exams.mjs
scripts/build-practice-exams.mjs   regenerates the practice bank from the upstream repo
docs/writing-a-lesson.md           how lessons are written. Read before adding one.
```

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages **on push to `main`**.
Work happens on `dev`; nothing on `dev` is live. `SITE_URL` and `BASE_PATH` come from
`actions/configure-pages` at build time, so `astro.config.mjs` needs no edit to deploy.

Internal links must go through `url()` / `lessonUrl()` from `src/lib/paths.ts` — the site is
served from `/aws-visual-learn/`, so a bare `/lessons` href breaks in production while
working fine locally.

## Attribution

Practice exam questions come from
[kananinirav/AWS-Certified-Cloud-Practitioner-Notes](https://github.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes)
(MIT). Several architectures in the projects track are drawn from
[MinhHungPhan/aws-hands-on-labs](https://github.com/MinhHungPhan/aws-hands-on-labs) (MIT).
Diagrams are drawn from scratch rather than copied; each project lesson names its source
repository and licence in a `<SourceRepo>` block.
