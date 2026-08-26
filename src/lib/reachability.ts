/**
 * "Can this packet reach the instance?" — the four checks, in the order the
 * packet actually meets them.
 *
 * Like lib/iam.ts, the order of the `if`s *is* the order of the real path, so
 * the code and the lesson cannot drift apart. Used by <GateSimulator model="vpc" />
 * and checked by reachability.check.ts.
 *
 * The `output` strings are genuine Reachability Analyzer explanation codes:
 * https://docs.aws.amazon.com/vpc/latest/reachability/explanation-codes.html
 */

/** The five switches the learner can flip. */
export interface VpcRequest {
  /** The instance has a public IPv4 address (auto-assigned or an Elastic IP). */
  publicIp: boolean;
  /** The subnet's route table carries 0.0.0.0/0 → igw — the only thing that makes it public. */
  igwRoute: boolean;
  /** The subnet's NACL admits inbound TCP 22. */
  naclInbound: boolean;
  /** The subnet's NACL admits outbound TCP 1024–65535 — the reply. */
  naclEphemeral: boolean;
  /** The instance's security group admits inbound TCP 22. */
  sgInbound: boolean;
}

export type VpcGateId = 'igw' | 'route' | 'nacl' | 'sg';

export interface VpcDecision {
  verdict: 'allowed' | 'denied';
  stoppedAt: VpcGateId | null;
  headline: string;
  reason: string;
  /** What you see from the outside, and what the analyzer says underneath it. */
  output: string;
}

const TIMEOUT = 'ssh: connect to host 54.198.12.7 port 22: Operation timed out';
const blocked = (code: string, note: string) =>
  `${TIMEOUT}\n\n# aws ec2 describe-network-insights-analyses\nStatus: NOT_REACHABLE\nExplanationCode: ${code}\n# ${note}`;

export const VPC_GATES: { id: VpcGateId; label: string; question: string }[] = [
  { id: 'igw', label: 'Internet gateway', question: 'Is there a public address to aim at?' },
  { id: 'route', label: 'Route table', question: 'Is 0.0.0.0/0 pointed at the gateway?' },
  { id: 'nacl', label: 'Network ACL', question: 'Does the subnet admit it — both ways?' },
  { id: 'sg', label: 'Security group', question: 'Does the instance admit it?' },
];

export function evaluateVpc(r: VpcRequest): VpcDecision {
  if (!r.publicIp) {
    return {
      verdict: 'denied',
      stoppedAt: 'igw',
      headline: 'Blocked — nothing to connect to',
      reason:
        'The internet gateway only delivers inbound traffic addressed to the public IP of a network interface in the VPC. This instance has 10.0.1.24 and nothing else, and a private address is not routable on the internet — so there is no host to put in the command at all.',
      output:
        'Public IPv4 address: –\n\n# aws ec2 describe-network-insights-analyses\nStatus: NOT_REACHABLE\nExplanationCode: IGW_PRIVATE_IP_ASSOCIATION_FOR_INGRESS\n# A public IP makes an instance addressable. It is step one, not the whole job.',
    };
  }

  if (!r.igwRoute) {
    return {
      verdict: 'denied',
      stoppedAt: 'route',
      headline: 'Blocked — the subnet is private, whatever it is called',
      reason:
        'The route table associated with this subnet has no 0.0.0.0/0 → igw entry, so the subnet is private in the only sense that matters to a packet. The public IP is real and does nothing: there is no path out for the reply, and therefore no connection.',
      output: blocked(
        'NO_ROUTE_TO_DESTINATION',
        'Read the route table, never the subnet name. This is the whole definition of "public".',
      ),
    };
  }

  if (!r.naclInbound) {
    return {
      verdict: 'denied',
      stoppedAt: 'nacl',
      headline: 'Blocked — the network ACL refused the request',
      reason:
        'The NACL wraps the whole subnet and is evaluated before the traffic ever reaches an instance. No rule admits inbound TCP 22, so the packet is dropped for every instance in the subnet — the security group is never consulted.',
      output: blocked(
        'SUBNET_ACL_RESTRICTION',
        'A NACL is the only VPC firewall that can say Deny — and it applies to the entire subnet.',
      ),
    };
  }

  if (!r.naclEphemeral) {
    return {
      verdict: 'denied',
      stoppedAt: 'nacl',
      headline: 'Blocked — the network ACL refused the reply',
      reason:
        'This is the stateless trap. Your packet got in, the instance answered, and the NACL dropped the answer because no outbound rule admits the ephemeral port range 1024–65535. A NACL has no memory of the request that came in, so you must allow the return traffic yourself. A security group would have done it for you.',
      output: blocked(
        'SUBNET_ACL_RESTRICTION',
        'Stateless means both directions. Allow inbound 22 AND outbound 1024–65535.',
      ),
    };
  }

  if (!r.sgInbound) {
    return {
      verdict: 'denied',
      stoppedAt: 'sg',
      headline: 'Blocked — the security group has no rule for port 22',
      reason:
        'A security group denies all inbound traffic by default and contains allow rules only — there is nothing to "un-deny", only a rule to add. Note what you cannot do here: you cannot block one attacking IP range with a security group, because it has no Deny at all. That is what NACLs are for.',
      output: blocked(
        'ENI_SG_RULES_MISMATCH',
        'Security groups are allow-only, and default-deny inbound.',
      ),
    };
  }

  return {
    verdict: 'allowed',
    stoppedAt: null,
    headline: 'Reachable',
    reason:
      'Public address, a route to the internet gateway, a NACL that admits the request and the reply, and a security group rule for port 22. Note that you never wrote an outbound rule on the security group: it is stateful, so the reply is permitted automatically. That is the one word that separates the two firewalls.',
    output:
      'Last login: Wed Aug 26 09:14:02 2026 from 82.14.7.33\n[ec2-user@ip-10-0-1-24 ~]$\n\n# aws ec2 describe-network-insights-analyses\nStatus: REACHABLE',
  };
}

/** Everything <GateSimulator model="vpc" /> needs to render itself. */
export const VPC_SIM = {
  title: 'Can this packet reach the instance?',
  intro:
    'One EC2 instance in one subnet, and you are trying to SSH to it from a café. Flip the four things that decide whether that works, and watch where the packet dies.',
  command: 'ssh -i deploy.pem ec2-user@54.198.12.7',
  outputLabel: 'What you see, and what the analyzer says',
  verdictLabels: { allowed: 'REACHABLE', denied: 'BLOCKED' },
  gates: VPC_GATES,
  evaluate: evaluateVpc,
  /** The happy path, so the learner starts by breaking it. */
  initial: {
    publicIp: true,
    igwRoute: true,
    naclInbound: true,
    naclEphemeral: true,
    sgInbound: true,
  } satisfies VpcRequest as Record<string, boolean>,
  switches: [
    { key: 'publicIp', label: 'The instance has a public IP', note: '54.198.12.7, auto-assigned' },
    {
      key: 'igwRoute',
      label: 'Route table sends 0.0.0.0/0 to the IGW',
      note: 'The one row that makes a subnet public',
    },
    {
      key: 'naclInbound',
      label: 'NACL allows inbound TCP 22',
      note: 'The subnet firewall, on the way in',
    },
    {
      key: 'naclEphemeral',
      label: 'NACL allows outbound TCP 1024–65535',
      note: 'The reply. Stateless means you write this one yourself',
    },
    { key: 'sgInbound', label: 'Security group allows inbound TCP 22', note: 'From your café IP' },
  ],
};
