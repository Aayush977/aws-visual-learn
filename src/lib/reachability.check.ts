/** Self-check for evaluateVpc(). Run: pnpm check:vpc */
import assert from 'node:assert/strict';
import { evaluateVpc, type VpcRequest } from './reachability.ts';

const base: VpcRequest = {
  publicIp: true,
  igwRoute: true,
  naclInbound: true,
  naclEphemeral: true,
  sgInbound: true,
};
const req = (o: Partial<VpcRequest> = {}) => evaluateVpc({ ...base, ...o });

// Each check can be the one that stops the packet.
assert.equal(req().verdict, 'allowed');
assert.equal(req({ publicIp: false }).stoppedAt, 'igw');
assert.equal(req({ igwRoute: false }).stoppedAt, 'route');
assert.equal(req({ naclInbound: false }).stoppedAt, 'nacl');
assert.equal(req({ naclEphemeral: false }).stoppedAt, 'nacl');
assert.equal(req({ sgInbound: false }).stoppedAt, 'sg');

// Order: the packet meets the gateway, then the route, then the subnet, then the instance.
assert.equal(req({ publicIp: false, igwRoute: false, sgInbound: false }).stoppedAt, 'igw');
assert.equal(req({ igwRoute: false, naclInbound: false }).stoppedAt, 'route');
assert.equal(req({ naclInbound: false, sgInbound: false }).stoppedAt, 'nacl');

// A public IP alone proves nothing — the lesson's whole point.
assert.equal(req({ igwRoute: false }).verdict, 'denied');

// The stateless trap: the request is admitted and the reply is not.
assert.match(req({ naclEphemeral: false }).reason, /stateless/i);
assert.notEqual(req({ naclEphemeral: false }).reason, req({ naclInbound: false }).reason);

// Each denial names a different real explanation code, and success names none.
const codes = [
  req({ publicIp: false }),
  req({ igwRoute: false }),
  req({ naclInbound: false }),
  req({ sgInbound: false }),
].map((d) => d.output.match(/ExplanationCode: (\w+)/)![1]);
assert.deepEqual(codes, [
  'IGW_PRIVATE_IP_ASSOCIATION_FOR_INGRESS',
  'NO_ROUTE_TO_DESTINATION',
  'SUBNET_ACL_RESTRICTION',
  'ENI_SG_RULES_MISMATCH',
]);
assert.match(req().output, /Status: REACHABLE/);

// Three different mistakes, one identical symptom. That is the lesson.
const timeouts = [req({ igwRoute: false }), req({ naclInbound: false }), req({ sgInbound: false })];
assert.equal(new Set(timeouts.map((d) => d.output.split('\n')[0])).size, 1);

console.log('reachability.check.ts — all assertions passed');
