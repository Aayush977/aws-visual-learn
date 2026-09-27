/**
 * IAM policy evaluation, as the exam tests it.
 *
 * The function below is deliberately a straight top-to-bottom read: the order
 * of the `if`s *is* the evaluation order, so the code and the lesson say the
 * same thing. Used by <IamSimulator /> and checked by iam.check.ts.
 */

/** The four switches the learner can flip in the simulator. */
export interface IamRequest {
  /** An SCP on the account permits this Region. Off = outside the guardrail. */
  scpAllowsRegion: boolean;
  /** An identity policy grants s3:DeleteObject on the target prefix. */
  identityAllow: boolean;
  /** A bucket policy denies the action when MFA was not used. */
  bucketDenyWithoutMfa: boolean;
  /** The caller authenticated with MFA. */
  mfa: boolean;
}

export interface IamDecision {
  verdict: 'allowed' | 'denied';
  /** id of the gate that decided, or null when every gate passed. */
  stoppedAt: GateId | null;
  headline: string;
  reason: string;
  /**
   * What the AWS CLI actually prints. The tail of a real AccessDenied message
   * names the rule that stopped you, which is how you debug this for real.
   */
  output: string;
}

const CALLER = 'arn:aws:iam::123456789012:user/alice';
const TARGET = 'arn:aws:s3:::company-reports/2026/q3.pdf';
const denied = (tail: string) =>
  `An error occurred (AccessDenied) when calling the DeleteObject operation: User: ${CALLER} is not authorized to perform: s3:DeleteObject on resource: "${TARGET}" ${tail}`;

export type GateId = 'deny' | 'scp' | 'allow';

export const GATES: { id: GateId; label: string; question: string }[] = [
  { id: 'deny', label: 'Explicit Deny?', question: 'Does any policy say Deny?' },
  { id: 'scp', label: 'SCP guardrail', question: 'Is this inside the account ceiling?' },
  { id: 'allow', label: 'Any Allow?', question: 'Does a policy actually permit it?' },
];

export function evaluate(r: IamRequest): IamDecision {
  if (r.bucketDenyWithoutMfa && !r.mfa) {
    return {
      verdict: 'denied',
      stoppedAt: 'deny',
      headline: 'Denied — explicit Deny',
      reason:
        'The bucket policy denies this action unless the caller used MFA. An explicit Deny is final: it beats the identity policy, it beats AdministratorAccess, it beats the account root user. Evaluation stops here.',
      output: denied('with an explicit deny in a resource-based policy'),
    };
  }

  if (!r.scpAllowsRegion) {
    return {
      verdict: 'denied',
      stoppedAt: 'scp',
      headline: 'Denied — outside the SCP guardrail',
      reason:
        'The Service Control Policy sets the maximum permissions this account may ever have, and this Region is outside it. An SCP never grants anything — it only limits — so no policy inside the account can buy the permission back.',
      output: denied('with an explicit deny in a service control policy'),
    };
  }

  if (!r.identityAllow) {
    return {
      verdict: 'denied',
      stoppedAt: 'allow',
      headline: 'Denied — implicit deny (the default)',
      reason:
        'Nothing said Deny, and the guardrail permits it, but no policy said Allow either. On AWS everything that is not explicitly allowed is denied, so silence means no.',
      output: denied('because no identity-based policy allows the s3:DeleteObject action'),
    };
  }

  return {
    verdict: 'allowed',
    stoppedAt: null,
    headline: 'Allowed',
    reason:
      'No explicit Deny applies, the request sits inside the SCP guardrail, and an identity policy explicitly allows the action. All three gates passed, so AWS carries out the request.',
    // s3 rm prints the object it removed and nothing else.
    output: `delete: s3://company-reports/2026/q3.pdf`,
  };
}

/** Everything <GateSimulator model="iam" /> needs to render itself. */
export const IAM_SIM = {
  title: 'Would this request be allowed?',
  intro:
    'Alice asks to delete one object. Flip the policies below and watch where the request gets stopped.',
  command: 'aws s3 rm s3://company-reports/2026/q3.pdf --region eu-west-1',
  outputLabel: 'What the CLI prints',
  verdictLabels: { allowed: 'ALLOWED', denied: 'DENIED' },
  gates: GATES,
  evaluate,
  /** The happy path: everything passes, so the learner starts by breaking it. */
  initial: {
    identityAllow: true,
    scpAllowsRegion: true,
    bucketDenyWithoutMfa: false,
    mfa: false,
  } satisfies IamRequest as Record<string, boolean>,
  switches: [
    {
      key: 'identityAllow',
      label: 'Identity policy allows it',
      note: 'Allow s3:DeleteObject on company-reports/2026/*',
    },
    {
      key: 'scpAllowsRegion',
      label: 'SCP permits eu-west-1',
      note: 'The organisation’s ceiling for this account',
    },
    {
      key: 'bucketDenyWithoutMfa',
      label: 'Bucket policy denies without MFA',
      note: 'An explicit Deny with a Condition on MFA',
    },
    { key: 'mfa', label: 'Alice signed in with MFA', note: 'Satisfies the Condition above' },
  ],
};
