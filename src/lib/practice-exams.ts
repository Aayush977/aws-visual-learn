import raw from '../data/practice-exams.json';
import { CCP_DOMAINS, type CcpDomain, type Question } from './questions';

/**
 * The imported practice-exam bank behind /practice.
 *
 * Deliberately separate from `QUESTIONS` in `./questions`: that bank is
 * hand-written, has a rationale on every option, and feeds /quiz and the spaced
 * repetition queue. These 1,100-odd questions come from a third-party MIT
 * repository and have answer keys only — mixing them in would swamp /review and
 * lie about the quality of the bank. They earn their place as *volume*: the one
 * thing a hand-written bank cannot give you the week before the exam.
 *
 * Regenerate with `pnpm build:practice-exams <path-to-repo>/practice-exam`.
 */
export const SOURCE = {
  repo: 'kananinirav/AWS-Certified-Cloud-Practitioner-Notes',
  url: 'https://github.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes',
  licence: 'MIT',
};

export interface PracticeExam {
  n: number;
  questions: Question[];
}

export const PRACTICE_EXAMS = (raw.exams as PracticeExam[]).map((e) => ({
  ...e,
  questions: e.questions as Question[],
}));

export const TOTAL_QUESTIONS = PRACTICE_EXAMS.reduce((n, e) => n + e.questions.length, 0);

export function practiceExam(n: number): PracticeExam | undefined {
  return PRACTICE_EXAMS.find((e) => e.n === n);
}

/** How the whole imported bank falls across the four CLF-C02 domains. */
export function domainMix() {
  const counts = new Map<CcpDomain, number>();
  for (const e of PRACTICE_EXAMS) {
    for (const q of e.questions) {
      if (q.ccpDomain) counts.set(q.ccpDomain, (counts.get(q.ccpDomain) ?? 0) + 1);
    }
  }
  return (Object.keys(CCP_DOMAINS) as unknown as CcpDomain[])
    .map((d) => Number(d) as CcpDomain)
    .map((domain) => {
      const count = counts.get(domain) ?? 0;
      return {
        domain,
        label: CCP_DOMAINS[domain].label,
        weight: CCP_DOMAINS[domain].weight,
        count,
        share: Math.round((count / TOTAL_QUESTIONS) * 100),
      };
    });
}
