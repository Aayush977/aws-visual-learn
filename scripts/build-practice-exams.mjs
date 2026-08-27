/**
 * Turn the markdown practice exams from kananinirav/AWS-Certified-Cloud-Practitioner-Notes
 * (MIT) into src/data/practice-exams.json.
 *
 *   node scripts/build-practice-exams.mjs /path/to/repo/practice-exam
 *
 * The upstream files are two slightly different shapes — exams 1–12 answer with
 * "Correct answer: D", exams 13–23 with "Correct Answer: D" plus an
 * "Explanation: <url>" line — so both are accepted. Questions carry no
 * per-option rationale upstream; that is a real gap and the /practice pages say
 * so rather than pretending otherwise.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = process.argv[2];
if (!SRC) {
  console.error('usage: node scripts/build-practice-exams.mjs <path-to-practice-exam-dir>');
  process.exit(1);
}
const OUT = join(dirname(dirname(fileURLToPath(import.meta.url))), 'src/data/practice-exams.json');

const NUM = /^(\d+)\.\s+(.*)$/;
const OPT = /^\s*-\s+([A-F])\.\s+(.*)$/;
const ANS = /Correct\s+answer:\s*([A-F](?:\s*,\s*[A-F])*)/i;
const EXPL = /^\s*Explanation:\s*(.*)$/;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** `<br/>` is the only markup upstream uses inside a prompt. */
const clean = (s) => s.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();

function parse(md) {
  const out = [];
  let q = null;
  const push = () => {
    if (q && q.options.length >= 2 && q.answer.length) out.push(q);
    q = null;
  };
  for (const line of md.split('\n')) {
    const opt = OPT.exec(line);
    if (opt && q) {
      q.options.push({ letter: opt[1], text: clean(opt[2]) });
      continue;
    }
    const num = NUM.exec(line);
    if (num) {
      push();
      q = { prompt: clean(num[2]), options: [], answer: [], explain: '' };
      continue;
    }
    if (!q) continue;
    const ans = ANS.exec(line);
    if (ans) {
      q.answer = ans[1].split(',').map((s) => s.trim().toUpperCase());
      continue;
    }
    const ex = EXPL.exec(line);
    if (ex) {
      q.explain = clean(ex[1]).replace(/^<|>$/g, '');
      continue;
    }
    // A prompt that wrapped onto a second line, before any option appeared.
    if (q.options.length === 0 && line.trim() && !line.startsWith('<') && !line.startsWith('---')) {
      q.prompt += ' ' + clean(line);
    }
  }
  push();
  return out;
}

/**
 * Tag each question with a CLF-C02 domain and a site track so the runner can
 * break the result down the way the exam guide does. First match wins, so the
 * narrow buckets (billing, security) are tested before the catch-all.
 */
const RULES = [
  [2, 'security', /\b(security|iam\b|identity centre|identity center|permission|iam polic|bucket polic|resource-based polic|identity-based polic|key polic|trust polic|mfa|credential|password|access key|encrypt|decrypt|kms|cloudhsm|certificate manager|acm|shield|waf|guardduty|macie|inspector|detective|artifact|compliance|audit|cloudtrail|ddos|penetration test|shared responsibility|least privilege|root user|secrets manager|firewall|network acl|security group|vulnerabilit|unauthori[sz]ed|malicious)\b/i],
  [4, 'billing', /\b(billing|invoice|pricing model|price|pay[- ]as[- ]you[- ]go|budget|payment|total cost of ownership|tco|pricing calculator|cost explorer|cost allocation|cost and usage|cost management|cost optimi[sz]|support plan|basic support|developer support|business support|enterprise support|technical account manager|concierge|consolidated billing|reserved instance|savings plan|free tier|discount|upfront|spending|bill\b)\b/i],
  [1, 'foundations', /\b(well-architected|pillar|agility|elasticity|economies of scale|capex|opex|capital expen|operational expen|cloud computing|deployment model|hybrid cloud|on-premises|migration|rehost|replatform|refactor|cloud adoption framework|caf\b|benefit(s)? of (the )?(aws )?cloud|advantage(s)? of|value proposition|undifferentiated heavy lifting|global reach|shared security|region|availability zone|edge location|global infrastructure|high availability|fault tolerance|disaster recovery|elastic)\b/i],
];
const TRACK_HINTS = [
  ['storage', /\b(s3|glacier|ebs|efs|fsx|storage gateway|snowball|snowcone|snowmobile|object storage|bucket|lifecycle policy)\b/i],
  ['compute', /\b(ec2|lambda|fargate|ecs|eks|elastic beanstalk|lightsail|batch|outposts|instance type|ami|auto scaling|container)\b/i],
  ['database', /\b(rds|aurora|dynamodb|redshift|elasticache|neptune|documentdb|database migration|dms|memorydb|timestream)\b/i],
  ['networking', /\b(vpc|subnet|route 53|cloudfront|direct connect|vpn|transit gateway|load balancer|elb|internet gateway|nat|peering|dns|global accelerator)\b/i],
  ['services', /\b(sqs|sns|kinesis|athena|glue|quicksight|emr|sagemaker|rekognition|comprehend|polly|lex|translate|textract|step functions|eventbridge|api gateway|appsync|iot)\b/i],
  ['architecture', /\b(well-architected|pillar|decoupl|resilien|fault tolerance|disaster recovery|high availability|loosely coupled|microservice)\b/i],
];

function classify(text) {
  let ccpDomain = 3;
  for (const [domain, , re] of RULES) {
    if (re.test(text)) {
      ccpDomain = domain;
      break;
    }
  }
  let track = RULES.find(([d]) => d === ccpDomain)?.[1] ?? 'services';
  if (ccpDomain === 3) {
    track = TRACK_HINTS.find(([, re]) => re.test(text))?.[0] ?? 'services';
  }
  return { ccpDomain, track };
}

const files = readdirSync(SRC)
  .filter((f) => /^practice-exam-\d+\.md$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const exams = files.map((file) => {
  const n = Number(file.match(/\d+/)[0]);
  const parsed = parse(readFileSync(join(SRC, file), 'utf8'));
  const questions = parsed.map((q, i) => {
    const { ccpDomain, track } = classify(q.prompt + ' ' + q.options.map((o) => o.text).join(' '));
    return {
      id: `pe${n}-${String(i + 1).padStart(2, '0')}`,
      ccpDomain,
      track,
      exams: ['CCP'],
      prompt: q.prompt,
      choose: q.answer.length,
      options: q.options.map((o) => ({
        text: o.text,
        ...(q.answer.includes(o.letter) ? { correct: true } : {}),
        why: '',
      })),
      ...(q.explain
        ? {
            explain: /^https?:/.test(q.explain)
              ? `Reference: <a href="${q.explain}" rel="noopener nofollow">${q.explain.replace(/^https?:\/\//, '').slice(0, 70)}</a>`
              : q.explain,
          }
        : {}),
    };
  });
  return { n, questions };
});

// Drop anything the parser could not resolve to a real answer key.
for (const e of exams) {
  const bad = e.questions.filter((q) => !q.options.some((o) => o.correct));
  if (bad.length) console.warn(`exam ${e.n}: dropping ${bad.length} unanswered`);
  e.questions = e.questions.filter((q) => q.options.some((o) => o.correct));
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ exams }, null, 1) + '\n');
console.log(
  `${exams.length} exams, ${exams.reduce((n, e) => n + e.questions.length, 0)} questions →`,
  OUT,
);
console.log(exams.map((e) => `${e.n}:${e.questions.length}`).join(' '));
