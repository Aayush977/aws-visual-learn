# Writing a lesson

Everything here is a convention the existing 43 lessons already follow. Follow it and a new
lesson reads as part of one course; ignore it and the site reads as 40 separate articles by
40 different people, which is the failure mode this document exists to prevent.

## The two questions

Before anything else, and again before you publish:

1. **Could someone with no IT background follow this without looking a word up?**
2. **Does it give them something to *do* or *feel*, rather than something to recall?**

The reader is changing careers. They are not stupid and they are not an engineer, and the
most common way to fail them is not being wrong — it is being *correct in vocabulary they do
not have yet*.

## The shape

Every teaching lesson runs the same five beats.

### 1. Cold open

The first `## ` heading is an **incident**, not a topic. A person, an hour, a number.

```
## 02:14 — the billing alarm
## The Tuesday that broke Kettle & Fox
## Friday, 7pm
```

Open in the middle of the trouble. No "In this lesson we will cover". The reader should not
know which service the lesson is about until after they care about the problem.

Concrete beats generality every time: not "costs can escalate" but "by 02:14 the bill was
past $8,000 and climbing in four Regions at once". Real, checkable numbers. Specific enough
to be remembered, because the number is the handle the concept hangs on.

### 2. The reframe

The second `## ` section turns the story into the actual subject — usually by naming the
question the incident was really asking.

> The post-mortem question is not "how did they get in". It is **why did the answer come back
> yes** — and that question has a fixed, four-step answer you can memorise today.

This is the hinge. The story earns attention; the reframe spends it on the syllabus.

### 3. Threading

The story comes back through the technical body as short *italic asides* — one or two lines,
never a paragraph. They re-anchor an abstract rule to the concrete thing the reader already
pictures. Three or four across a lesson is right; every section is too many.

### 4. Closing callback

After a `---` rule at the end, resolve the story into the one rule worth keeping. Not a
summary — `<Takeaways>` does that. This is the emotional close.

### 5. The hook

`hook:` in the frontmatter is the story's opening beat, because it renders on the lesson card
and on the study paths. It is the sentence that decides whether the lesson gets opened.

## The cast

Four fictional companies recur across the whole site. **Use one of them. Do not invent a
fifth.**

| Company | What they are | Their running story |
|---|---|---|
| **Kettle & Fox** | Yorkshire homeware retailer | Goes down on live television. Spiky, seasonal, public-facing — scaling, request lifecycle, support plans, static sites. |
| **Meridian** | Four-person analytics startup | A leaked access key and a retry loop that cost real money. IAM, pricing, storage. |
| **Aldgate Health** | Hospital group | Regulated, long data retention, audit questions nobody can answer. S3 classes, VPC, governance, compliance. |
| **Brightwell** | Insurer, mid-migration | Closing a data centre against a deadline. Migration and CAF, compute, EC2 pricing, cloud economics. |

The cast is the single cheapest thing that makes the site feel like one course. A reader who
met Kettle & Fox in lesson one and meets them again in the CloudFront lesson gets the
cross-reference for free — no recap needed, and the new service lands on a problem they
already understand.

So: **name the company.** "A four-person analytics company" and "Meridian" cost the same
number of words, and only one of them compounds. If a scenario genuinely fits none of the
four, prefer bending it to fit over introducing a fifth name that will never appear again.

## `<Scenario>` is a *different* case

Every teaching lesson ends with a `<Scenario>`. It must be a **new situation**, not the cold
open written out again in four fields. If the reader recognises it as the story they already
read, the block has taught nothing — it was the second worked example that was supposed to
prove the idea generalises.

The model to copy is `how-iam-decides`: the cold open is the leaked key at 02:14, and the
Scenario is a *different engineer, three months later, on a different problem* in the same
world. Same universe, new question.

## The component vocabulary

Each component encodes a teaching decision. Reach for them in roughly this order.

| Component | Use it for |
|---|---|
| `<Diagram>` + `svg/Node`, `Wire`, `Boundary` | The mechanism. Build it up in `steps` so the reader watches it assemble rather than decoding a finished picture. |
| `<Callout>` | `exam` (a fact the exam tests), `gotcha` (the thing everyone gets wrong), `analogy` (the plain-English mental model), `cost` (the money angle), `note`. Those five and no others — an unknown `type` fails the build. |
| `<Confusable>` | Two or three services people mix up, side by side, with the wording that gives each away. |
| `<DecisionTree>` | "Which one do I pick?" — when the answer is a path through questions, not a fact. |
| `<Mnemonic>` | Only for genuinely arbitrary lists (the six pillars). Never for something with a logic the reader could derive. |
| `<Quiz>` | One question mid-lesson, to interrupt passive reading. Fill in `why` for the **wrong** options — that is where the learning is. |
| `<Scenario>` | The second worked example. See above. |
| `<Checklist>` | Hands-on steps the reader leaves the page to do. Keep the `id` stable once published. |
| `<Takeaways>` | Always last. "If you remember nothing else." |
| `<GateSimulator>` | A rule with enough branches that reading it is worse than playing with it. |
| `<SourceRepo>` | Projects only. Always name the licence. |

Diagrams are drawn from scratch, never pasted from AWS's own architecture icons.

**Two enums fail only at build time**, with an unhelpful `Cannot read properties of undefined`:

- `<Callout type>` — exactly `exam`, `gotcha`, `analogy`, `cost`, `note`.
- `icon=` on `<Node>` and `<Boundary>` — must be a key in `src/lib/glyphs.ts`. There is no
  `warning`; the nearest are `deny` and `shield`. Check the file rather than guessing, and if
  the icon you want is missing, add the glyph there rather than picking a misleading one.

`<Node>` and `<Boundary>` also differ in what their coordinates mean: a Node's `x`/`y` is its
**centre**, a Boundary's is its **top-left**. Mixing them up is the usual reason a diagram
looks subtly off.

## Linking to another lesson

Markdown link syntax writes the href verbatim, and the site is served from `/aws-visual-learn/`
— so `[text](/lessons/slug)` builds a link that works locally and 404s in production. Import
the helper and use a JSX anchor:

```mdx
import { lessonUrl } from '../../lib/paths.ts';

<a href={lessonUrl("request-lifecycle")}>How a Request Reaches Your Application</a>
```

Same rule for images and downloads — `how-iam-decides` imports the same module as
`url as asset` for exactly this. Check a built page if unsure: the href should start
`/aws-visual-learn/`.

## Jargon

The first use of any term a career changer would not know gets a plain-English gloss in the
same sentence — then use it normally forever after. Terms worth glossing also belong in the
`jargon-buster` lesson, which pairs a pub explanation with the precise one.

If a word appears in several lessons it is *especially* important it is in the glossary,
because the reader may meet it first in any of them.

## Facts have a shelf life

**Do not write AWS pricing, free-tier terms or exam logistics from memory.** Fetch the primary
source:

- Pricing and free tier → https://aws.amazon.com/free/
- Exam logistics and domain weightings → the official exam guide PDF

This has already caught us out: the pricing lesson was teaching the old 12-month free tier
long after AWS had replaced it with the credit-based Free plan. The site's entire value to a
beginner is that they can trust it, and this audience cannot detect a stale figure themselves.

Where the exam guide lags reality, teach current reality *and* label the older framing —
exam questions still use it.

## Frontmatter

Schema and field docs live in `src/content.config.ts`; `pnpm check` validates against it.
The parts that need judgement:

- **`track`** decides the nav group. `order` sorts within it — leave gaps of 10 so a lesson
  can be inserted later without renumbering the track.
- **`exams`** must be true. A lesson tagged `SAA` shows up on the SAA path and in its
  progress count.
- **`domains`** takes the *exact* wording from the current exam guide, per exam. CCP and SAA
  have entirely different blueprints, so a lesson on both paths needs both labels — showing a
  Cloud Practitioner reader an SAA-C03 domain name teaches them the wrong syllabus.
- **`minutes`** is honest reading time, not aspiration.

## The projects track is deliberately different

The ten `project-*` lessons do not use the cold-open shape. They run
**problem → architecture → why each service over the obvious alternative → roughly what it
costs → a public repo where you can go and build it**, opening on a flat `## The problem`
heading. That is correct and intentional: the reader arrives at a project already knowing the
services, and what they need is the reasoning between them, not a hook.

They still use the cast, still end in `<Takeaways>`, and still credit their source repository
and its licence.

## Before you commit

```sh
pnpm check:all    # the simulator and scheduler self-checks
pnpm build        # validates frontmatter, catches MDX errors and bad links
```

(`pnpm check` is currently broken upstream — see the README. `pnpm build` is the real gate,
and it will reject an invalid `track`, a missing `summary` or an unknown `<Callout type>`.)

Then commit to `dev`. Pages only deploys from `main`.
