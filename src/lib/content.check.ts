/**
 * Lint the lesson MDX for the mistakes that only surface at build time.
 *
 * Astro reports an invalid `<Callout type>` or `icon=` as
 * "Cannot read properties of undefined", naming neither the lesson nor the
 * attribute — so these are cheap to make and expensive to find. A bare
 * markdown link to another lesson is worse: it builds clean and 404s in
 * production, because the site is served from a base path.
 *
 * Run: pnpm check:content
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const LESSONS = new URL('../content/lessons/', import.meta.url).pathname;
const CALLOUT_TYPES = ['exam', 'gotcha', 'analogy', 'cost', 'note'];

const glyphs = new Set(
  [...readFileSync(new URL('./glyphs.ts', import.meta.url).pathname, 'utf8')
    .matchAll(/^ {2}([a-z0-9]+):/gm)].map((m) => m[1]),
);
assert.ok(glyphs.size > 20, 'failed to parse glyph names out of glyphs.ts');

const files = readdirSync(LESSONS).filter((f) => f.endsWith('.mdx'));
assert.ok(files.length > 0, 'no lessons found');

const problems: string[] = [];
for (const file of files) {
  const src = readFileSync(join(LESSONS, file), 'utf8');
  const note = (msg: string) => problems.push(`${file}: ${msg}`);

  for (const [, type] of src.matchAll(/<Callout[^>]*\stype="([^"]*)"/g)) {
    if (!CALLOUT_TYPES.includes(type)) {
      note(`<Callout type="${type}"> — expected one of ${CALLOUT_TYPES.join(', ')}`);
    }
  }

  for (const [, icon] of src.matchAll(/\sicon="([^"]*)"/g)) {
    if (!glyphs.has(icon)) note(`icon="${icon}" is not a glyph in lib/glyphs.ts`);
  }

  // Markdown link syntax writes the href verbatim and drops the base path.
  for (const [match] of src.matchAll(/\]\(\/(?:lessons|quiz|practice|path|review)\b[^)]*\)/g)) {
    note(`bare internal link ${match} — use lessonUrl()/url() in a JSX anchor instead`);
  }

  // Attribution rule: a credited repository must state its licence.
  for (const [block] of src.matchAll(/<SourceRepo\b[\s\S]*?\/>/g)) {
    if (!/\slicence="[^"]+"/.test(block)) note('<SourceRepo> without a licence');
  }
}

assert.deepEqual(problems, [], `\n  ${problems.join('\n  ')}\n`);
console.log(`content.check.ts — ${files.length} lessons, all assertions passed`);
