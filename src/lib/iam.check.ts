/** Self-check for evaluate(). Run: pnpm check:iam */
import assert from 'node:assert/strict';
import { evaluate, type IamRequest } from './iam.ts';

const base: IamRequest = {
  scpAllowsRegion: true,
  identityAllow: true,
  bucketDenyWithoutMfa: false,
  mfa: false,
};
const req = (o: Partial<IamRequest> = {}) => evaluate({ ...base, ...o });

// Each gate can be the one that decides.
assert.equal(req().verdict, 'allowed');
assert.equal(req({ bucketDenyWithoutMfa: true }).stoppedAt, 'deny');
assert.equal(req({ scpAllowsRegion: false }).stoppedAt, 'scp');
assert.equal(req({ identityAllow: false }).stoppedAt, 'allow');

// Precedence: an explicit Deny outranks the guardrail and any Allow.
assert.equal(req({ bucketDenyWithoutMfa: true, scpAllowsRegion: false }).stoppedAt, 'deny');

// MFA satisfies the bucket policy's condition, so the Deny no longer applies.
assert.equal(req({ bucketDenyWithoutMfa: true, mfa: true }).verdict, 'allowed');

// MFA does not move an SCP boundary, and it is not an Allow.
assert.equal(req({ mfa: true, scpAllowsRegion: false }).stoppedAt, 'scp');
assert.equal(req({ mfa: true, identityAllow: false }).stoppedAt, 'allow');

// The CLI tail is the whole practical point: each denial names a different rule.
assert.match(req({ bucketDenyWithoutMfa: true }).cli, /explicit deny in a resource-based policy$/);
assert.match(req({ scpAllowsRegion: false }).cli, /explicit deny in a service control policy$/);
assert.match(req({ identityAllow: false }).cli, /no identity-based policy allows/);
assert.doesNotMatch(req().cli, /AccessDenied/);

console.log('iam.check.ts — all assertions passed');
