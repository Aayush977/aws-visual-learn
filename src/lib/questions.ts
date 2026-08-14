import { TRACKS, EXAMS } from '../content.config';

export type Track = (typeof TRACKS)[number];
export type Exam = (typeof EXAMS)[number];

export interface QuizOption {
  text: string;
  /** Mark every correct option. `choose` should match how many are marked. */
  correct?: boolean;
  /** Why this option is right or wrong. The wrong ones matter most — always fill them in. */
  why: string;
}

/** The four CLF-C02 domains, with the weighting the real exam gives each. */
export const CCP_DOMAINS = {
  1: { label: 'Cloud Concepts', weight: 24 },
  2: { label: 'Security and Compliance', weight: 30 },
  3: { label: 'Cloud Technology and Services', weight: 34 },
  4: { label: 'Billing, Pricing, and Support', weight: 12 },
} as const;

export type CcpDomain = keyof typeof CCP_DOMAINS;

export interface Question {
  /** Stable id. Used for keys and for "retry the ones you missed". */
  id: string;
  /**
   * Which CLF-C02 domain this question belongs to. Drives the results
   * breakdown on the CCP practice test, so the reader sees where they lost
   * marks in the same terms the exam guide uses.
   */
  ccpDomain?: CcpDomain;
  prompt: string;
  options: QuizOption[];
  /** How many options to select. Defaults to 1. */
  choose?: number;
  /** Extra teaching shown after the answer is revealed. Supports inline HTML. */
  explain?: string;
  track: Track;
  exams: Exam[];
  /** Lesson id to send the reader back to when they get it wrong. */
  lesson?: string;
}

/**
 * The practice bank behind /quiz.
 *
 * These are deliberately *not* the same questions as the ones embedded in the
 * lessons — a reader who has just finished a lesson should meet the idea again
 * in a new set of clothes rather than recognise the wording.
 *
 * When you add a lesson, add four or five questions here and tag them with its
 * `track` and `lesson` id so wrong answers link back to the right place.
 */
export const QUESTIONS: Question[] = [
  // ─────────────────────────────────────────── foundations
  {
    id: 'f-01',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'what-is-cloud-computing',
    prompt:
      'A startup wants to launch a product in Europe and Asia at the same time, without building or renting any data centre space in either place. Which benefit of cloud computing does this describe?',
    options: [
      {
        text: 'Go global in minutes',
        correct: true,
        why: 'Deploying into additional AWS Regions puts infrastructure close to users in other geographies within minutes, with no physical presence required.',
      },
      {
        text: 'Trade capital expense for variable expense',
        why: 'That benefit is about the payment model — no large up-front purchase. Nothing in the question is about how the spend is structured.',
      },
      {
        text: 'Benefit from massive economies of scale',
        why: 'Economies of scale explain why AWS unit prices are low. The question is about geography, not price.',
      },
      {
        text: 'Stop guessing capacity',
        why: 'That benefit is about matching resources to demand rather than predicting a peak. The question says nothing about demand varying.',
      },
    ],
  },
  {
    id: 'f-02',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'what-is-cloud-computing',
    prompt:
      'A company keeps its customer database in its own data centre for regulatory reasons, while running its public website on AWS, connected by a VPN. Which deployment model is this?',
    options: [
      {
        text: 'Hybrid',
        correct: true,
        why: 'Hybrid means workloads split between AWS and your own infrastructure, connected together — typically over Site-to-Site VPN or Direct Connect. Regulatory constraints are one of the most common permanent reasons for it.',
      },
      {
        text: 'Cloud',
        why: 'A pure cloud deployment runs everything on AWS. Here the database deliberately stays on-premises.',
      },
      {
        text: 'On-premises',
        why: 'On-premises means everything runs in your own facility. The public website is on AWS.',
      },
      {
        text: 'Multi-cloud',
        why: 'Multi-cloud means using more than one cloud provider. Only AWS is mentioned.',
      },
    ],
  },
  {
    id: 'f-03',
    ccpDomain: 3,
    track: 'foundations',
    exams: ['CCP', 'SAA'],
    lesson: 'global-infrastructure',
    prompt:
      'A solutions architect needs to design for high availability within a single AWS Region. What should the design span?',
    options: [
      {
        text: 'At least two Availability Zones',
        correct: true,
        why: 'Availability Zones are physically separate, with independent power, cooling and networking, and are connected by low-latency links. Spreading across two or more is the standard way to survive the loss of one.',
      },
      {
        text: 'At least two Regions',
        why: 'Multiple Regions provide disaster recovery and lower latency for distant users, but the question specifies high availability *within* a single Region.',
      },
      {
        text: 'At least two edge locations',
        why: 'Edge locations cache content for CloudFront and answer Route 53 queries. You do not deploy application infrastructure into them.',
      },
      {
        text: 'At least two subnets in the same Availability Zone',
        why: 'Two subnets in one zone share the same physical failure domain. Losing that zone takes both with it.',
      },
    ],
    explain:
      'Rule of thumb: <strong>Multi-AZ = high availability. Multi-Region = disaster recovery and global latency.</strong>',
  },
  {
    id: 'f-04',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'what-is-cloud-computing',
    prompt:
      'A development team wants to deploy application code without choosing, patching or scaling any servers. Which cloud service model does this describe?',
    options: [
      {
        text: 'Platform as a Service (PaaS)',
        correct: true,
        why: 'In PaaS the provider operates the hardware, virtualisation, operating system and runtime. You supply code and configuration — AWS Lambda and Elastic Beanstalk are the examples.',
      },
      {
        text: 'Infrastructure as a Service (IaaS)',
        why: 'IaaS gives you the virtual machine and leaves the operating system to you — including patching it, which the team explicitly does not want.',
      },
      {
        text: 'Software as a Service (SaaS)',
        why: 'SaaS is finished software you log into. There is nowhere to deploy your own application code.',
      },
      {
        text: 'Function as a Service is not a cloud service model',
        why: 'It is a commonly used term, and in exam vocabulary it sits inside PaaS. The three named models remain IaaS, PaaS and SaaS.',
      },
    ],
  },
  {
    id: 'f-05',
    ccpDomain: 3,
    track: 'foundations',
    exams: ['CCP', 'SAA'],
    lesson: 'global-infrastructure',
    prompt:
      'Users in Australia report slow load times for images served from a web application hosted in eu-west-2 (London). What is the most appropriate way to improve their experience?',
    options: [
      {
        text: 'Serve the content through Amazon CloudFront',
        correct: true,
        why: 'CloudFront caches content at edge locations worldwide, so Australian users are served from a nearby edge rather than crossing the planet to London.',
      },
      {
        text: 'Increase the size of the EC2 instances in London',
        why: 'The bottleneck is the physical distance the data travels, not CPU or memory in London. A bigger instance changes nothing about latency.',
      },
      {
        text: 'Add more Availability Zones in eu-west-2',
        why: 'More zones improve availability within London. Every one of them is still in London.',
      },
      {
        text: 'Enable Multi-AZ on the database',
        why: 'Multi-AZ is a failover mechanism for the database. It has no effect on how long images take to reach Australia.',
      },
    ],
  },
  {
    id: 'f-06',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'what-is-cloud-computing',
    prompt:
      'Which of the following are among the six advantages of cloud computing described by AWS? (Choose TWO.)',
    choose: 2,
    options: [
      {
        text: 'Stop spending money running and maintaining data centres',
        correct: true,
        why: 'One of the six. Racking servers, replacing disks and managing power stops being your problem.',
      },
      {
        text: 'Increase speed and agility',
        correct: true,
        why: 'Another of the six. Resources appear in minutes rather than weeks, which makes experimentation cheap enough to actually do.',
      },
      {
        text: 'Eliminate the need to secure your applications and data',
        why: 'It does the opposite of eliminating it — securing what you put in the cloud remains your responsibility under the Shared Responsibility Model.',
      },
      {
        text: 'Guarantee lower total cost for every workload',
        why: 'AWS makes no such claim. A flat, fully utilised, long-lived workload can be cheaper to own. The cloud advantage grows with how much demand varies.',
      },
    ],
  },

  // ─────────────────────────────────────────── security
  {
    id: 's-01',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'shared-responsibility-model',
    prompt:
      'Under the AWS Shared Responsibility Model, which of the following is AWS responsible for?',
    options: [
      {
        text: 'Physical security of the data centres',
        correct: true,
        why: 'AWS is responsible for security *of* the cloud — the facilities, hardware, and the software running the virtualisation layer.',
      },
      {
        text: 'Configuring security groups on EC2 instances',
        why: 'Security group rules are firewall configuration you choose. That is squarely customer responsibility — security *in* the cloud.',
      },
      {
        text: 'Encrypting data stored in an S3 bucket',
        why: 'AWS supplies the encryption mechanisms; deciding to turn them on and managing the keys is yours.',
      },
      {
        text: 'Patching the operating system on an EC2 instance',
        why: 'For EC2 the guest operating system is yours to patch. This is the single most-tested example of the customer side of the line.',
      },
    ],
    explain:
      '<strong>AWS secures the cloud. You secure what you put in it.</strong> The line moves toward AWS as the service becomes more managed — for Lambda, AWS patches the OS too.',
  },
  {
    id: 's-02',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'how-iam-decides',
    prompt:
      'An IAM user has a policy allowing s3:* on all resources. A bucket policy on reports-bucket explicitly denies s3:GetObject to that user. What happens when the user tries to download an object from reports-bucket?',
    options: [
      {
        text: 'The request is denied — an explicit Deny overrides any Allow',
        correct: true,
        why: 'AWS gathers every applicable policy and looks for an explicit Deny first. If one exists anywhere, the request stops there and nothing can override it.',
      },
      {
        text: 'The request succeeds, because identity policies take precedence over resource policies',
        why: 'Neither type takes precedence over the other. Both are evaluated together, and an explicit Deny in either one wins.',
      },
      {
        text: 'The request succeeds, because s3:* is more specific',
        why: 'A wildcard is less specific, not more, and specificity does not decide the outcome in any case. Deny always beats Allow.',
      },
      {
        text: 'The result depends on which policy was attached most recently',
        why: 'Policy evaluation has no concept of attachment order or timestamps.',
      },
    ],
  },
  {
    id: 's-03',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'how-iam-decides',
    prompt:
      'What is the recommended way for an AWS Lambda function to obtain permission to write to an Amazon DynamoDB table?',
    options: [
      {
        text: 'Assign an IAM execution role to the function',
        correct: true,
        why: 'Execution roles deliver temporary, automatically rotated credentials to the function. There are no long-lived secrets to store, leak or rotate by hand.',
      },
      {
        text: 'Store an IAM user’s access keys in the function’s environment variables',
        why: 'Long-lived access keys in environment variables can be read by anyone with access to the function configuration, and they never expire.',
      },
      {
        text: 'Embed access keys in the deployment package',
        why: 'Credentials in code end up in version control. This is among the most common causes of AWS account compromise.',
      },
      {
        text: 'Make the DynamoDB table publicly writable',
        why: 'DynamoDB tables cannot be made public, and if they could, granting the whole internet write access to solve a permissions problem for one function would be catastrophic.',
      },
    ],
    explain: 'The rule is short: <strong>applications get roles, never access keys.</strong>',
  },
  {
    id: 's-04',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP'],
    lesson: 'how-iam-decides',
    prompt:
      'Which of these are AWS best practices for protecting the root user of an AWS account? (Choose TWO.)',
    choose: 2,
    options: [
      {
        text: 'Enable multi-factor authentication on it',
        correct: true,
        why: 'MFA means a stolen password alone is not enough. For the one identity that can do anything in the account, this is essential.',
      },
      {
        text: 'Delete or avoid creating access keys for it',
        correct: true,
        why: 'Root access keys grant unrestricted programmatic control of the account and cannot be limited by policy. AWS recommends they simply not exist.',
      },
      {
        text: 'Use it for daily administrative work so actions are properly authorised',
        why: 'The opposite of best practice. Create IAM identities with least privilege for daily work and reserve root for the handful of tasks that require it.',
      },
      {
        text: 'Share the root credentials with the operations team so nobody is a single point of failure',
        why: 'Shared credentials destroy accountability — CloudTrail can no longer tell you who did something. Use individual IAM identities instead.',
      },
    ],
  },
  {
    id: 's-05',
    track: 'security',
    exams: ['SAA'],
    lesson: 'how-iam-decides',
    prompt:
      'A company wants to prevent every account in an organizational unit from disabling AWS CloudTrail, regardless of the IAM permissions granted inside those accounts. What should they use?',
    options: [
      {
        text: 'A Service Control Policy attached to the organizational unit',
        correct: true,
        why: 'SCPs set the maximum permissions a member account can have. An action denied by an SCP is unavailable no matter what IAM policies exist inside the account — including to its root user.',
      },
      {
        text: 'An IAM policy attached to every user in those accounts',
        why: 'It would have to be applied to every identity, including ones created later, and any account administrator could remove it. SCPs cannot be removed from inside the member account.',
      },
      {
        text: 'A permissions boundary on the CloudTrail service role',
        why: 'Permissions boundaries cap what a specific identity can do. They do not stop a different administrator from disabling the trail.',
      },
      {
        text: 'An Amazon CloudWatch alarm on CloudTrail configuration changes',
        why: 'An alarm tells you after the fact that it happened. The requirement is to prevent it.',
      },
    ],
  },
  {
    id: 's-06',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'shared-responsibility-model',
    prompt:
      'Which AWS service records API calls made in an account, providing an audit trail of who did what and when?',
    options: [
      {
        text: 'AWS CloudTrail',
        correct: true,
        why: 'CloudTrail logs API activity across the account — the identity, the action, the source IP and the timestamp. It is the auditing and governance service.',
      },
      {
        text: 'Amazon CloudWatch',
        why: 'CloudWatch collects metrics, logs and alarms about how resources are performing. It answers "is it healthy", not "who changed it".',
      },
      {
        text: 'AWS Config',
        why: 'Config records the configuration state of resources over time and evaluates compliance rules. Closely related, but the record of API calls is CloudTrail.',
      },
      {
        text: 'Amazon GuardDuty',
        why: 'GuardDuty analyses activity to detect threats. It consumes CloudTrail data rather than being the audit trail itself.',
      },
    ],
    explain:
      'A useful trio: <strong>CloudTrail = who did it · CloudWatch = how is it performing · Config = what does it look like now, and did that break a rule.</strong>',
  },

  // ─────────────────────────────────────────── networking
  {
    id: 'n-01',
    ccpDomain: 3,
    track: 'networking',
    exams: ['CCP', 'SAA'],
    lesson: 'vpc-anatomy',
    prompt: 'What makes a subnet in a VPC a "public" subnet?',
    options: [
      {
        text: 'Its route table sends 0.0.0.0/0 to an internet gateway',
        correct: true,
        why: 'That route is the entire definition. There is no setting called "public" — the name is a convention describing the route table.',
      },
      {
        text: 'It has "public" selected in its subnet settings',
        why: 'No such setting exists. Subnets are named public or private by convention based on their routing.',
      },
      {
        text: 'Its instances have been assigned public IP addresses',
        why: 'A public IP makes an instance addressable, but without an internet-gateway route nothing can reach it. Both are needed, and the route is what defines the subnet.',
      },
      {
        text: 'Its network ACL allows inbound traffic from 0.0.0.0/0',
        why: 'A permissive NACL allows traffic that arrives, but no traffic can arrive without a route to an internet gateway.',
      },
    ],
  },
  {
    id: 'n-02',
    track: 'networking',
    exams: ['SAA'],
    lesson: 'vpc-anatomy',
    prompt:
      'Which statement correctly describes the difference between a security group and a network ACL?',
    options: [
      {
        text: 'Security groups are stateful and support allow rules only; network ACLs are stateless and support both allow and deny rules',
        correct: true,
        why: 'This is the complete distinction. Stateful means return traffic is automatically permitted; stateless means you must allow the ephemeral return ports yourself.',
      },
      {
        text: 'Security groups are stateless; network ACLs are stateful',
        why: 'Exactly reversed, and this is the most common wrong answer.',
      },
      {
        text: 'Security groups apply to subnets; network ACLs apply to instances',
        why: 'Also reversed. Security groups attach to network interfaces on instances; NACLs attach to subnets.',
      },
      {
        text: 'Both support deny rules, but only network ACLs are evaluated in order',
        why: 'Security groups have no deny rules at all — that absence is precisely why NACLs are needed to block a specific IP address.',
      },
    ],
  },
  {
    id: 'n-03',
    ccpDomain: 3,
    track: 'networking',
    exams: ['CCP', 'SAA'],
    lesson: 'request-lifecycle',
    prompt:
      'A company needs to route users to a completely different AWS Region if the primary Region becomes unavailable. Which service provides this capability?',
    options: [
      {
        text: 'Amazon Route 53 with health checks and a failover routing policy',
        correct: true,
        why: 'Route 53 is DNS, and DNS is the only layer that can direct users to an entirely different Region. Health checks let it stop returning the primary’s address when it fails.',
      },
      {
        text: 'An Application Load Balancer spanning both Regions',
        why: 'A load balancer is a Regional resource. It distributes traffic across Availability Zones within one Region and cannot span two.',
      },
      {
        text: 'A NAT gateway in each Region',
        why: 'NAT gateways provide outbound internet access for private subnets. They play no part in directing inbound user traffic.',
      },
      {
        text: 'VPC peering between the two Regions',
        why: 'Peering creates private connectivity between VPCs. It does not influence where a user’s browser sends its request.',
      },
    ],
    explain:
      '<strong>Route 53 moves traffic between Regions. A load balancer moves it within one.</strong>',
  },
  {
    id: 'n-04',
    track: 'networking',
    exams: ['SAA'],
    lesson: 'vpc-anatomy',
    prompt:
      'A company has fifteen VPCs that all need to communicate with each other and with an on-premises data centre. Managing the mesh of peering connections has become unworkable. What should they use?',
    options: [
      {
        text: 'AWS Transit Gateway',
        correct: true,
        why: 'Transit Gateway is a hub that connects many VPCs and on-premises networks through a single point, replacing an unmanageable full mesh of peering connections.',
      },
      {
        text: 'More VPC peering connections',
        why: 'A full mesh of fifteen VPCs requires 105 connections, and peering is not transitive, so it cannot be simplified. This is the problem, not the fix.',
      },
      {
        text: 'A VPC endpoint in each VPC',
        why: 'VPC endpoints provide private access to AWS services such as S3. They do not connect VPCs to each other.',
      },
      {
        text: 'An internet gateway in each VPC with routing between them',
        why: 'This would send private inter-VPC traffic across the public internet — slower, more expensive and far less secure.',
      },
    ],
  },
  {
    id: 'n-05',
    track: 'networking',
    exams: ['SAA'],
    lesson: 'request-lifecycle',
    prompt:
      'An application needs a load balancer that provides extremely low latency, handles millions of requests per second, and exposes a static IP address. Which load balancer should be used?',
    options: [
      {
        text: 'Network Load Balancer',
        correct: true,
        why: 'The NLB operates at layer 4, is built for extreme throughput and ultra-low latency, and provides a static IP address per Availability Zone.',
      },
      {
        text: 'Application Load Balancer',
        why: 'The ALB works at layer 7 and is the right choice for HTTP routing by path or hostname, but it does not offer static IP addresses and carries more per-request overhead.',
      },
      {
        text: 'Gateway Load Balancer',
        why: 'The GWLB exists to insert third-party virtual appliances such as firewalls into the traffic path. It is not a general-purpose application load balancer.',
      },
      {
        text: 'Classic Load Balancer',
        why: 'The Classic Load Balancer is the previous generation and is not recommended for new designs. It offers neither the NLB’s performance nor static IPs.',
      },
    ],
  },
  {
    id: 'n-06',
    track: 'networking',
    exams: ['SAA'],
    lesson: 'vpc-anatomy',
    prompt:
      'A company requires consistent, dedicated network bandwidth between its on-premises data centre and AWS, with predictable latency. Which service should they use?',
    options: [
      {
        text: 'AWS Direct Connect',
        correct: true,
        why: 'Direct Connect is a dedicated physical circuit into AWS, giving consistent bandwidth and predictable latency because the traffic never crosses the public internet.',
      },
      {
        text: 'AWS Site-to-Site VPN',
        why: 'A VPN is encrypted but travels over the public internet, so bandwidth and latency vary with internet conditions. It is quick to set up and is often used as a backup for Direct Connect.',
      },
      {
        text: 'AWS Transit Gateway',
        why: 'Transit Gateway routes traffic between networks but does not itself provide the physical connection to your data centre.',
      },
      {
        text: 'Amazon CloudFront',
        why: 'CloudFront is a CDN that caches content near end users. It has nothing to do with connecting a data centre to AWS.',
      },
    ],
    explain:
      'Listen for the adjective. <strong>"Consistent", "dedicated", "predictable latency" → Direct Connect. "Quick to set up", "encrypted over the internet" → VPN.</strong>',
  },

  // ─────────────────────────────────────────── compute
  {
    id: 'c-01',
    ccpDomain: 3,
    track: 'compute',
    exams: ['CCP', 'SAA'],
    lesson: 'choosing-compute',
    prompt:
      'An image-processing job runs for about 30 seconds each time a file is uploaded to Amazon S3, roughly 200 times a day at unpredictable intervals. Which compute option is most cost-effective?',
    options: [
      {
        text: 'AWS Lambda triggered by the S3 upload event',
        correct: true,
        why: 'Each run is well within the 15-minute limit, the trigger is an event, and nothing is billed between invocations. 200 runs of 30 seconds a day costs almost nothing.',
      },
      {
        text: 'An EC2 instance running continuously with a polling script',
        why: 'The instance is billed 24 hours a day to do roughly 100 minutes of work. Almost all of the cost is idle time.',
      },
      {
        text: 'An EC2 Auto Scaling group with a minimum of two instances',
        why: 'This adds availability that the workload does not need and guarantees two instances are always billed, mostly for doing nothing.',
      },
      {
        text: 'Amazon ECS on EC2 with a service running permanently',
        why: 'Containers are a good fit for the work, but a permanently running service on EC2 keeps paying for idle capacity between uploads.',
      },
    ],
  },
  {
    id: 'c-02',
    ccpDomain: 4,
    track: 'compute',
    exams: ['CCP', 'SAA'],
    lesson: 'ec2-purchase-options',
    prompt:
      'Which EC2 purchasing option offers the largest discount but can be interrupted by AWS with two minutes’ notice?',
    options: [
      {
        text: 'Spot Instances',
        correct: true,
        why: 'Spot sells spare capacity at up to 90% off, on the condition that AWS may reclaim it with a two-minute interruption notice.',
      },
      {
        text: 'Reserved Instances',
        why: 'Reserved Instances discount in exchange for a one or three year commitment. They are never interrupted.',
      },
      {
        text: 'Savings Plans',
        why: 'Savings Plans discount in exchange for a committed hourly spend. They involve no interruption risk.',
      },
      {
        text: 'Dedicated Hosts',
        why: 'Dedicated Hosts are the most expensive option, bought for licensing and compliance reasons rather than for discounts.',
      },
    ],
  },
  {
    id: 'c-03',
    track: 'compute',
    exams: ['SAA'],
    lesson: 'choosing-compute',
    prompt:
      'A team runs containers on Amazon ECS using the EC2 launch type. They are spending significant time patching and right-sizing the container instances and want that work to stop. What should they change?',
    options: [
      {
        text: 'Move the ECS tasks to the Fargate launch type',
        correct: true,
        why: 'Fargate removes the container instances entirely. You declare CPU and memory per task and AWS runs it — nothing to patch, size or scale.',
      },
      {
        text: 'Migrate from ECS to EKS',
        why: 'EKS changes the orchestrator to Kubernetes but says nothing about what the containers run on. With EC2 node groups the patching problem is identical, plus a new learning curve.',
      },
      {
        text: 'Enable Auto Scaling on the container instances',
        why: 'Auto Scaling adjusts how many instances exist. They still need to be patched and sized.',
      },
      {
        text: 'Use larger EC2 instance types so fewer are needed',
        why: 'Fewer instances is marginally less work, but the operational responsibility is unchanged.',
      },
    ],
    explain:
      'Two independent choices: <strong>orchestrator</strong> (ECS or EKS) and <strong>what it runs on</strong> (EC2 or Fargate). "No servers to manage" changes the second one.',
  },
  {
    id: 'c-04',
    track: 'compute',
    exams: ['SAA'],
    lesson: 'ec2-purchase-options',
    prompt:
      'A company runs a steady 24/7 workload on a fixed EC2 instance family in one Region and is certain the architecture will not change for three years. They want the maximum possible discount. What should they buy?',
    options: [
      {
        text: 'A three-year EC2 Instance Savings Plan or Standard Reserved Instances, all upfront',
        correct: true,
        why: 'Locking to one instance family in one Region for three years with full payment up front produces the deepest commitment discount available — up to around 72%.',
      },
      {
        text: 'A one-year Compute Savings Plan with no upfront payment',
        why: 'This is the most flexible option and therefore the smallest discount. The company has told you they need neither the flexibility nor the shorter term.',
      },
      {
        text: 'Spot Instances',
        why: 'Spot is cheaper per hour but can be reclaimed at any time. A steady production workload with no stated interruption tolerance should not sit on it.',
      },
      {
        text: 'On-Demand Instances with an AWS Budget alert',
        why: 'On-Demand is the most expensive per hour, and a budget alert reports spending rather than reducing it.',
      },
    ],
  },
  {
    id: 'c-05',
    ccpDomain: 3,
    track: 'compute',
    exams: ['CCP', 'SAA'],
    lesson: 'choosing-compute',
    prompt:
      'Which of these are characteristics of AWS Lambda? (Choose TWO.)',
    choose: 2,
    options: [
      {
        text: 'It has a maximum execution time of 15 minutes per invocation',
        correct: true,
        why: 'A hard limit that cannot be raised. Any job legitimately running longer must move to a container service such as Fargate or AWS Batch.',
      },
      {
        text: 'You are billed only for the time your code is actually running',
        correct: true,
        why: 'Billing is per invocation and per millisecond of execution. An idle function costs nothing at all.',
      },
      {
        text: 'You choose the operating system and apply security patches to it',
        why: 'Lambda is fully managed — there is no operating system exposed to you and nothing to patch. That is one of its defining properties.',
      },
      {
        text: 'Data written to local disk persists between invocations',
        why: 'The execution environment is ephemeral and nothing written locally can be relied upon. Persistent state belongs in S3, DynamoDB or EFS.',
      },
    ],
  },
  {
    id: 'c-06',
    track: 'compute',
    exams: ['SAA'],
    lesson: 'choosing-compute',
    prompt:
      'An application must run on a specific Linux kernel version with custom kernel modules installed. Which AWS compute service is appropriate?',
    options: [
      {
        text: 'Amazon EC2',
        correct: true,
        why: 'EC2 is the only option that gives operating-system-level access, which is required to choose a kernel version and install kernel modules.',
      },
      {
        text: 'AWS Lambda',
        why: 'Lambda provides a managed runtime with no access to the underlying operating system or kernel.',
      },
      {
        text: 'AWS Fargate',
        why: 'Fargate runs containers on infrastructure you never see. Containers share the host kernel, which you cannot choose or modify.',
      },
      {
        text: 'Amazon S3',
        why: 'S3 is object storage. It does not run code.',
      },
    ],
  },
  {
    id: 'c-07',
    track: 'compute',
    exams: ['SAA'],
    lesson: 'ec2-purchase-options',
    prompt:
      'A development environment runs on EC2 and is used only between 09:00 and 18:00 on weekdays. What is the simplest way to reduce its cost significantly?',
    options: [
      {
        text: 'Stop the instances outside working hours on a schedule',
        correct: true,
        why: 'Running roughly 45 hours a week instead of 168 removes about three quarters of the compute cost, requires no commitment, and is reversible at any moment.',
      },
      {
        text: 'Purchase three-year Reserved Instances for them',
        why: 'A commitment discount would be applied to capacity that sits idle three quarters of the time. Turning it off saves more, and locks in nothing.',
      },
      {
        text: 'Move the instances to Dedicated Hosts',
        why: 'Dedicated Hosts are the most expensive option available. This would increase the cost substantially.',
      },
      {
        text: 'Enable detailed CloudWatch monitoring to identify waste',
        why: 'Better visibility is useful, but it adds a small cost and by itself changes nothing about the bill.',
      },
    ],
    explain: 'The cheapest instance is the one that is not running. Try that before buying a discount.',
  },

  // ─────────────────────────────────────────── storage
  {
    id: 't-01',
    ccpDomain: 3,
    track: 'storage',
    exams: ['CCP', 'SAA'],
    lesson: 'block-file-object-storage',
    prompt:
      'Twenty EC2 instances across three Availability Zones must read and write the same set of files, and the application requires a POSIX filesystem. Which service should be used?',
    options: [
      {
        text: 'Amazon EFS',
        correct: true,
        why: 'EFS is a POSIX-compliant NFS filesystem that many instances can mount at once across multiple Availability Zones.',
      },
      {
        text: 'Amazon EBS',
        why: 'An EBS volume lives in one Availability Zone and normally attaches to one instance. It cannot be shared by a fleet across zones.',
      },
      {
        text: 'Amazon S3',
        why: 'S3 handles shared access and durability well, but it is an object store reached over an API — not a POSIX filesystem, which the question requires.',
      },
      {
        text: 'Amazon FSx for Lustre',
        why: 'FSx for Lustre is a shared filesystem, but it is designed for high-performance computing and machine learning throughput. EFS is the general-purpose answer for ordinary shared file access.',
      },
    ],
  },
  {
    id: 't-02',
    ccpDomain: 3,
    track: 'storage',
    exams: ['CCP', 'SAA'],
    lesson: 's3-storage-classes',
    prompt:
      'Archived records must be kept for seven years for compliance. They are almost never accessed, but when regulators ask, they must be retrievable within 12 hours. Which S3 storage class is most cost-effective?',
    options: [
      {
        text: 'S3 Glacier Flexible Retrieval',
        correct: true,
        why: 'Designed for archives accessed once or twice a year, with retrieval options from minutes up to 12 hours. It meets the deadline at a far lower storage price than the instant classes.',
      },
      {
        text: 'S3 Standard',
        why: 'Standard is priced for frequently accessed data. Paying that rate for seven years of data nobody reads is enormously wasteful.',
      },
      {
        text: 'S3 Glacier Deep Archive',
        why: 'The cheapest class of all, but standard retrieval takes up to 12 hours and bulk retrieval up to 48 — too close to the deadline to be safe, and it carries a 180-day minimum.',
      },
      {
        text: 'S3 One Zone-Infrequent Access',
        why: 'It stores data in a single Availability Zone, so losing that zone loses the data. That is not an acceptable risk for seven-year compliance records.',
      },
    ],
  },
  {
    id: 't-03',
    track: 'storage',
    exams: ['SAA'],
    lesson: 'block-file-object-storage',
    prompt:
      'A Windows-based application requires an SMB file share integrated with Active Directory. Which AWS service should be used?',
    options: [
      {
        text: 'Amazon FSx for Windows File Server',
        correct: true,
        why: 'It provides a fully managed native Windows file system with SMB protocol support and Active Directory integration.',
      },
      {
        text: 'Amazon EFS',
        why: 'EFS speaks NFS, which is the Linux protocol. It cannot serve SMB shares, so it is wrong however well it fits everything else.',
      },
      {
        text: 'Amazon S3 with a mounted bucket',
        why: 'S3 is object storage. Tools that make it look like a drive do not provide genuine SMB semantics or AD integration.',
      },
      {
        text: 'Amazon EBS with a Windows file server',
        why: 'You could build this yourself on EC2, but then you own the patching, availability and backups of a file server — which is what the managed service removes.',
      },
    ],
    explain: '<strong>EFS = Linux/NFS. FSx for Windows File Server = Windows/SMB.</strong>',
  },
  {
    id: 't-04',
    ccpDomain: 3,
    track: 'storage',
    exams: ['CCP', 'SAA'],
    lesson: 's3-storage-classes',
    prompt:
      'A company stores objects in S3 whose access pattern is unpredictable — some are read often, others never again, and they cannot tell in advance which. They want to minimise cost without operational effort. What should they use?',
    options: [
      {
        text: 'S3 Intelligent-Tiering',
        correct: true,
        why: 'Intelligent-Tiering monitors each object and moves it between access tiers automatically for a small monitoring fee. It exists precisely for unpredictable patterns.',
      },
      {
        text: 'S3 Standard for everything',
        why: 'Safe, and the most expensive outcome. Objects that are never read again would be billed at the frequent-access rate indefinitely.',
      },
      {
        text: 'A lifecycle rule moving everything to Glacier after 30 days',
        why: 'It would archive the frequently read objects too, adding retrieval fees and delay every time one is needed.',
      },
      {
        text: 'S3 One Zone-Infrequent Access',
        why: 'It reduces cost by reducing durability to a single Availability Zone, and it assumes access is infrequent — which the question says cannot be assumed.',
      },
    ],
  },
  {
    id: 't-05',
    track: 'storage',
    exams: ['SAA'],
    lesson: 'block-file-object-storage',
    prompt:
      'Which statement about Amazon EBS snapshots is correct?',
    options: [
      {
        text: 'They are stored in Amazon S3 and can be used to create a volume in a different Availability Zone',
        correct: true,
        why: 'Snapshots are incremental, held in S3, and are not tied to an Availability Zone — which makes restoring into a different zone the supported way to move a volume’s data.',
      },
      {
        text: 'They are stored on the volume itself for fast restore',
        why: 'If the snapshot lived on the volume it would be lost along with it, which would defeat the purpose entirely.',
      },
      {
        text: 'Each snapshot is a full copy of the volume',
        why: 'Snapshots are incremental — only blocks changed since the previous snapshot are stored, though each can be restored independently.',
      },
      {
        text: 'They can only be restored into the Availability Zone where the original volume lived',
        why: 'This is the constraint that applies to the volume, not the snapshot. Restoring across zones — and across Regions, after copying — is standard practice.',
      },
    ],
  },
  {
    id: 't-06',
    ccpDomain: 3,
    track: 'storage',
    exams: ['CCP', 'SAA'],
    lesson: 'block-file-object-storage',
    prompt:
      'Which of these are true of Amazon S3? (Choose TWO.)',
    choose: 2,
    options: [
      {
        text: 'Objects are automatically replicated across at least three Availability Zones in most storage classes',
        correct: true,
        why: 'This is what produces S3’s 99.999999999% durability. The exception is One Zone-IA, which deliberately stores in a single zone for a lower price.',
      },
      {
        text: 'Storage capacity is effectively unlimited and requires no provisioning',
        correct: true,
        why: 'There is no volume to size or extend. Individual objects can be up to 5 TB and the bucket itself has no capacity limit.',
      },
      {
        text: 'An EC2 instance can boot its operating system from S3',
        why: 'Boot volumes must be block storage — that is EBS. S3 is an object store reached over HTTPS.',
      },
      {
        text: 'You can modify part of an object in place without rewriting it',
        why: 'Objects are immutable in this sense: any write replaces the whole object. Applications needing partial updates want a block device or a database.',
      },
    ],
  },

  // ─────────────────────────────────────────── database
  {
    id: 'd-01',
    ccpDomain: 3,
    track: 'database',
    exams: ['CCP', 'SAA'],
    lesson: 'choosing-a-database',
    prompt:
      'An RDS database’s read traffic has grown until the primary instance is CPU-bound, while writes remain light. What should be added?',
    options: [
      {
        text: 'One or more read replicas, with read queries directed to them',
        correct: true,
        why: 'Read replicas exist for exactly this: they take read load off the primary and can be added in the same Region or another one.',
      },
      {
        text: 'Multi-AZ, so the standby can share the read load',
        why: 'The Multi-AZ standby serves no traffic whatsoever. It exists only to take over during failover — the single most common misunderstanding about RDS.',
      },
      {
        text: 'More frequent automated backups',
        why: 'Backups protect against data loss and add load rather than removing it.',
      },
      {
        text: 'A second Multi-AZ deployment in another Region',
        why: 'This adds cost and cross-Region latency without reducing the read load on the primary.',
      },
    ],
    explain:
      '<strong>Multi-AZ = availability. Read replicas = performance. Backups = recovery.</strong>',
  },
  {
    id: 'd-02',
    track: 'database',
    exams: ['SAA'],
    lesson: 'choosing-a-database',
    prompt:
      'A shopping cart service needs a database with flexible schema, single-digit millisecond latency, automatic scaling to millions of requests per second, and no servers to manage. Which service fits?',
    options: [
      {
        text: 'Amazon DynamoDB',
        correct: true,
        why: 'Every requirement listed is a DynamoDB property: NoSQL flexible schema, single-digit millisecond latency, massive automatic scale and fully serverless.',
      },
      {
        text: 'Amazon RDS for PostgreSQL',
        why: 'RDS requires a fixed schema and an instance you size and manage. Sustaining millions of requests per second would be difficult and expensive.',
      },
      {
        text: 'Amazon Redshift',
        why: 'Redshift is a data warehouse for large analytical queries over history, not for high-frequency transactional reads and writes.',
      },
      {
        text: 'Amazon ElastiCache',
        why: 'ElastiCache is a cache that sits in front of a database. It is not intended as the durable system of record for cart data.',
      },
    ],
  },
  {
    id: 'd-03',
    track: 'database',
    exams: ['SAA'],
    lesson: 'choosing-a-database',
    prompt:
      'A team needs a caching layer that survives a node restart, replicates data, and supports automatic failover across Availability Zones. Which ElastiCache engine should they choose?',
    options: [
      {
        text: 'Redis',
        correct: true,
        why: 'Redis supports persistence, replication and Multi-AZ with automatic failover, along with richer data structures such as sorted sets and pub/sub.',
      },
      {
        text: 'Memcached',
        why: 'Memcached is a simple multi-threaded cache with no persistence, no replication and no failover. Anything it holds is lost on restart.',
      },
      {
        text: 'DynamoDB Accelerator (DAX)',
        why: 'DAX is a caching layer specifically for DynamoDB, not a general-purpose cache in front of an arbitrary database.',
      },
      {
        text: 'Amazon Neptune',
        why: 'Neptune is a graph database, not a cache.',
      },
    ],
    explain: '<strong>Redis remembers. Memcached merely caches.</strong>',
  },
  {
    id: 'd-04',
    track: 'database',
    exams: ['SAA'],
    lesson: 'choosing-a-database',
    prompt:
      'Analysts need to run SQL queries directly against several terabytes of log files stored in Amazon S3. Queries run two or three times a week, and the company does not want to run any infrastructure between them. What should they use?',
    options: [
      {
        text: 'Amazon Athena',
        correct: true,
        why: 'Athena runs serverless SQL directly against S3, billed per terabyte scanned. With queries a few times a week you pay only for those scans and nothing in between.',
      },
      {
        text: 'Amazon Redshift',
        why: 'Redshift would answer the queries well but needs a provisioned cluster billed continuously, including the days nobody queries.',
      },
      {
        text: 'Amazon RDS',
        why: 'The logs would first have to be loaded into a relational database, and you would pay for a running instance plus storage for terabytes of log data.',
      },
      {
        text: 'Amazon DynamoDB',
        why: 'DynamoDB serves known access patterns by key. Ad-hoc SQL over historical files is the query style it cannot do.',
      },
    ],
  },
  {
    id: 'd-05',
    track: 'database',
    exams: ['SAA'],
    lesson: 'choosing-a-database',
    prompt:
      'Which AWS database service is purpose-built for storing and querying highly connected data, such as social relationships or fraud rings?',
    options: [
      {
        text: 'Amazon Neptune',
        correct: true,
        why: 'Neptune is a managed graph database designed for querying relationships between entities — the exact shape relational joins handle badly at depth.',
      },
      {
        text: 'Amazon DocumentDB',
        why: 'DocumentDB is a MongoDB-compatible document database. Documents are self-contained records, not a graph of relationships.',
      },
      {
        text: 'Amazon Timestream',
        why: 'Timestream is for time-series data such as IoT readings and metrics over time.',
      },
      {
        text: 'Amazon QLDB',
        why: 'QLDB provides an immutable, cryptographically verifiable ledger of changes. It records history, not relationships.',
      },
    ],
  },

  // ─────────────────────────────────────────── architecture
  {
    id: 'a-01',
    ccpDomain: 1,
    track: 'architecture',
    exams: ['CCP', 'SAA'],
    lesson: 'well-architected-framework',
    prompt:
      'Which pillar of the AWS Well-Architected Framework focuses on the ability to recover from failure and meet demand automatically?',
    options: [
      {
        text: 'Reliability',
        correct: true,
        why: 'Reliability covers recovering from failure automatically, testing recovery procedures, scaling horizontally and no longer guessing capacity.',
      },
      {
        text: 'Performance Efficiency',
        why: 'That pillar is about selecting and continually re-evaluating the right resource types, not about surviving failure.',
      },
      {
        text: 'Operational Excellence',
        why: 'Operational Excellence covers running, monitoring and improving systems and processes — infrastructure as code, deployments and game days.',
      },
      {
        text: 'Security',
        why: 'Security covers protecting data and systems: identity, least privilege, encryption and traceability.',
      },
    ],
  },
  {
    id: 'a-02',
    track: 'architecture',
    exams: ['SAA'],
    lesson: 'scaling-and-high-availability',
    prompt:
      'A web tier calls a report-generation service synchronously, and slowness in reporting makes the whole site unresponsive. What should be introduced so the two tiers fail and scale independently?',
    options: [
      {
        text: 'An Amazon SQS queue between them',
        correct: true,
        why: 'A queue decouples them in time: the web tier returns as soon as the message is enqueued, so a slow consumer creates a backlog instead of an outage, and each tier scales on its own signal.',
      },
      {
        text: 'An Application Load Balancer in front of the reporting service',
        why: 'The web tier is still waiting synchronously for a response, so slowness still reaches the user.',
      },
      {
        text: 'A larger instance type for the reporting service',
        why: 'This postpones the problem without changing the coupling. Any future slowness reappears at the front end.',
      },
      {
        text: 'Amazon CloudFront in front of the reporting service',
        why: 'Reports are generated per request and are not cacheable, and the synchronous dependency is unchanged.',
      },
    ],
  },
  {
    id: 'a-03',
    track: 'architecture',
    exams: ['SAA'],
    lesson: 'well-architected-framework',
    prompt:
      'A company keeps a fully functional but scaled-down copy of its environment running in a second Region, ready to be scaled up on failover. Which disaster recovery strategy is this?',
    options: [
      {
        text: 'Warm standby',
        correct: true,
        why: 'Warm standby means a complete but reduced-capacity copy is always running and can be scaled up in minutes.',
      },
      {
        text: 'Pilot light',
        why: 'In pilot light only the critical core — typically a replicating database — is live, with application servers switched off. The distinguishing word is "running".',
      },
      {
        text: 'Backup and restore',
        why: 'Nothing runs in the second Region under backup and restore; you rebuild from snapshots when needed, taking hours.',
      },
      {
        text: 'Multi-site active/active',
        why: 'Active/active means both Regions serve real production traffic at full capacity, which gives near-zero RTO at near-double cost.',
      },
    ],
  },
  {
    id: 'a-04',
    track: 'architecture',
    exams: ['SAA'],
    lesson: 'scaling-and-high-availability',
    prompt:
      'Which Auto Scaling policy type is most appropriate when traffic rises sharply at a known time every weekday morning?',
    options: [
      {
        text: 'Scheduled scaling',
        correct: true,
        why: 'When the peak is predictable from the calendar, capacity can be added before demand arrives rather than in reaction to it — which avoids the several minutes instances take to boot.',
      },
      {
        text: 'Target tracking on CPU utilisation',
        why: 'Reactive scaling only begins once CPU has already risen, so the first few minutes of the peak are served by insufficient capacity.',
      },
      {
        text: 'Step scaling on network throughput',
        why: 'Also reactive, and it responds after the load has arrived. Step scaling is for graded responses to varying severity, not for known timing.',
      },
      {
        text: 'Manual scaling by the operations team',
        why: 'It would work but depends on somebody remembering every morning. Scheduled scaling does the same thing reliably.',
      },
    ],
  },
  {
    id: 'a-05',
    track: 'architecture',
    exams: ['SAA'],
    lesson: 'well-architected-framework',
    prompt:
      'A system is backed up every 6 hours, and a full restore takes 90 minutes. What is the worst-case RPO?',
    options: [
      {
        text: '6 hours of data loss',
        correct: true,
        why: 'RPO measures backwards from the failure to the last usable copy. With 6-hourly backups the worst case is a failure just before the next one, losing 6 hours of changes.',
      },
      {
        text: '90 minutes of data loss',
        why: '90 minutes is the restore time, which is the RTO. RPO and RTO measure in opposite directions from the failure.',
      },
      {
        text: '7.5 hours of data loss',
        why: 'RPO and RTO are not added together — they answer two different questions.',
      },
      {
        text: 'Zero, because backups are automated',
        why: 'Automation controls how reliably backups happen, not how much data changed since the last one.',
      },
    ],
    explain:
      '<strong>RPO = how much data you lose</strong> (backwards to the last copy). <strong>RTO = how long you are down</strong> (forwards to service restored).',
  },
  {
    id: 'a-06',
    track: 'architecture',
    exams: ['SAA'],
    lesson: 'scaling-and-high-availability',
    prompt:
      'An application must deliver one message to several independent downstream systems, each of which processes it at its own pace. What should the architecture use?',
    options: [
      {
        text: 'An SNS topic with an SQS queue subscribed for each downstream system',
        correct: true,
        why: 'This is the fan-out pattern. SNS delivers a copy to every subscriber, and each system’s own queue buffers it so slow consumers do not affect the others.',
      },
      {
        text: 'A single SQS queue read by all the downstream systems',
        why: 'Each message in a standard queue is consumed by one reader. The systems would compete for messages rather than each receiving a copy.',
      },
      {
        text: 'Direct synchronous API calls from the application to each system',
        why: 'This couples the application to every downstream system: any one being slow or down affects the caller, and adding a new consumer means changing the application.',
      },
      {
        text: 'An Application Load Balancer distributing messages across the systems',
        why: 'A load balancer sends each request to one target. It distributes rather than duplicates.',
      },
    ],
  },

  // ─────────────────────────────────────────── billing
  {
    id: 'b-01',
    ccpDomain: 4,
    track: 'billing',
    exams: ['CCP'],
    lesson: 'pricing-and-cost-management',
    prompt:
      'A company wants to estimate the monthly cost of an architecture before building it. Which tool should they use?',
    options: [
      {
        text: 'AWS Pricing Calculator',
        correct: true,
        why: 'It is the only tool that models hypothetical architectures and produces an estimate for something that does not exist yet.',
      },
      {
        text: 'AWS Cost Explorer',
        why: 'Cost Explorer visualises and forecasts spend that has already occurred. It has nothing to analyse for an architecture not yet built.',
      },
      {
        text: 'AWS Budgets',
        why: 'Budgets alerts you when actual or forecast spend crosses a threshold on a live account.',
      },
      {
        text: 'AWS Cost and Usage Report',
        why: 'The CUR delivers detailed line items for usage that has already been billed.',
      },
    ],
    explain:
      'Sort by tense: <strong>future hypothetical → Pricing Calculator · future actual → Budgets · past → Cost Explorer and the CUR.</strong>',
  },
  {
    id: 'b-02',
    ccpDomain: 4,
    track: 'billing',
    exams: ['CCP'],
    lesson: 'support-plans',
    prompt:
      'Which is the least expensive AWS Support plan that provides 24/7 phone access to Cloud Support Engineers and a response time under one hour for a production system outage?',
    options: [
      {
        text: 'Business',
        correct: true,
        why: 'Business is the entry point for 24/7 phone, email and chat, unlimited contacts, and a <1 hour response when production is down.',
      },
      {
        text: 'Developer',
        why: 'Developer provides business-hours email access only, permits one contact, and has no production-down response commitment.',
      },
      {
        text: 'Enterprise On-Ramp',
        why: 'It meets the requirement, but costs far more and adds a pooled TAM and a 30-minute business-critical response that were not asked for.',
      },
      {
        text: 'Basic',
        why: 'Basic cannot open technical support cases at all — only billing and account ones.',
      },
    ],
  },
  {
    id: 'b-03',
    ccpDomain: 4,
    track: 'billing',
    exams: ['CCP', 'SAA'],
    lesson: 'pricing-and-cost-management',
    prompt: 'Which statement about AWS data transfer pricing is correct?',
    options: [
      {
        text: 'Data transferred into AWS from the internet is free; data transferred out is charged',
        correct: true,
        why: 'Inbound transfer carries no charge. Outbound to the internet is billed per GB beyond a small monthly allowance, and is one of the largest costs on many bills.',
      },
      {
        text: 'Both inbound and outbound internet transfer are charged at the same rate',
        why: 'Inbound is free. The asymmetry is deliberate and explains a great many architectural decisions.',
      },
      {
        text: 'Transfer between Availability Zones in the same Region is always free',
        why: 'Cross-AZ traffic is charged in both directions. Only same-AZ traffic over private IP addresses is free.',
      },
      {
        text: 'Data transfer is included in the price of EC2 instances',
        why: 'Data transfer is billed separately from compute, which is why it can appear as a surprise line on a bill.',
      },
    ],
  },
  {
    id: 'b-04',
    ccpDomain: 4,
    track: 'billing',
    exams: ['CCP'],
    lesson: 'pricing-and-cost-management',
    prompt:
      'What are the benefits of using AWS Organizations with consolidated billing? (Choose TWO.)',
    choose: 2,
    options: [
      {
        text: 'Volume pricing tiers are calculated across the combined usage of all accounts',
        correct: true,
        why: 'Aggregating usage means the organisation reaches cheaper tiers sooner than any individual account would.',
      },
      {
        text: 'Reserved Instances and Savings Plans can be shared across accounts',
        correct: true,
        why: 'Unused commitment in one account is automatically applied to matching usage in another, so commitments are not wasted.',
      },
      {
        text: 'All accounts automatically receive the Enterprise support plan',
        why: 'Support plans are purchased per account and are not granted by joining an organisation.',
      },
      {
        text: 'Resources can be shared freely between accounts with no additional configuration',
        why: 'Account boundaries remain a strong isolation barrier. Sharing resources requires explicit configuration such as RAM, cross-account roles or resource policies.',
      },
    ],
  },
  {
    id: 'b-05',
    ccpDomain: 4,
    track: 'billing',
    exams: ['CCP'],
    lesson: 'pricing-and-cost-management',
    prompt:
      'Which service inspects a live AWS account and makes recommendations across cost optimisation, performance, security, fault tolerance and service limits?',
    options: [
      {
        text: 'AWS Trusted Advisor',
        correct: true,
        why: 'Trusted Advisor checks live resources against best practice in those five categories. Basic and Developer see seven core checks; Business and above see the full set.',
      },
      {
        text: 'AWS Well-Architected Tool',
        why: 'The Well-Architected Tool reviews a workload’s *design* by asking you questions. Trusted Advisor inspects what is actually running.',
      },
      {
        text: 'Amazon Inspector',
        why: 'Inspector scans workloads for software vulnerabilities and unintended network exposure. It does not cover cost or service limits.',
      },
      {
        text: 'AWS Config',
        why: 'Config records resource configuration over time and evaluates compliance rules you define, rather than offering AWS’s own five-category recommendations.',
      },
    ],
  },
  {
    id: 'b-06',
    ccpDomain: 4,
    track: 'billing',
    exams: ['CCP'],
    lesson: 'support-plans',
    prompt:
      'A company needs a designated Technical Account Manager who knows their architecture, and a response time under 15 minutes for business-critical outages. Which support plan is required?',
    options: [
      {
        text: 'Enterprise',
        correct: true,
        why: 'Enterprise is the only plan with a designated TAM and a <15 minute response for business-critical systems down.',
      },
      {
        text: 'Enterprise On-Ramp',
        why: 'On-Ramp provides access to a *pool* of TAMs and a <30 minute business-critical response. Both details fall short of the requirement.',
      },
      {
        text: 'Business',
        why: 'Business includes 24/7 engineer access and a <1 hour production-down response, but no Technical Account Manager at all.',
      },
      {
        text: 'Developer',
        why: 'Developer is business-hours email support with a single contact.',
      },
    ],
  },

  // ─────────────────────────────────────────── migration & CAF (Domain 1)
  {
    id: 'm-01',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'migration-and-caf',
    prompt:
      'A company is moving an application to AWS by copying its virtual machines onto Amazon EC2 with no changes to the application or its architecture. Which migration strategy is this?',
    options: [
      {
        text: 'Rehost',
        correct: true,
        why: 'Rehosting — "lift and shift" — moves the workload as it is. It is the fastest route off owned hardware and the usual choice when a deadline dominates.',
      },
      {
        text: 'Replatform',
        why: 'Replatforming makes a targeted optimisation on the way, such as moving a self-managed database to RDS. Here nothing was changed.',
      },
      {
        text: 'Refactor',
        why: 'Refactoring means substantially rewriting the application around cloud-native services. Copying virtual machines is the opposite of that.',
      },
      {
        text: 'Repurchase',
        why: 'Repurchasing means abandoning your application for a commercial SaaS product. The company kept its own application.',
      },
    ],
  },
  {
    id: 'm-02',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'migration-and-caf',
    prompt:
      'During a portfolio assessment a company finds that 30 of its applications have had no users for over a year. What should they do with them, and what is this strategy called?',
    options: [
      {
        text: 'Decommission them — this is the Retire strategy',
        correct: true,
        why: 'Retiring unused applications is the cheapest possible outcome: no migration effort, and you reclaim licences and hardware. It typically covers 10–20% of a real estate.',
      },
      {
        text: 'Move them to AWS unchanged — this is the Retain strategy',
        why: 'Retain means deliberately leaving an application on-premises, not moving it. It also does not apply to something nobody uses.',
      },
      {
        text: 'Rewrite them as serverless applications — this is the Refactor strategy',
        why: 'Spending the most expensive strategy on applications with no users would be difficult to justify to anybody.',
      },
      {
        text: 'Replace them with SaaS products — this is the Repurchase strategy',
        why: 'Repurchasing replaces an application people still need. Nobody needs these.',
      },
    ],
    explain:
      'Do <strong>Retire</strong> and <strong>Retain</strong> first in any assessment — they are free, and they shrink everything that follows.',
  },
  {
    id: 'm-03',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'migration-and-caf',
    prompt:
      'Which perspective of the AWS Cloud Adoption Framework is concerned with the skills, roles and culture change needed for a successful cloud adoption?',
    options: [
      {
        text: 'People',
        correct: true,
        why: 'The People perspective bridges business and technology, covering skills gaps, new roles, training and change management — and it is where migrations most often stall.',
      },
      {
        text: 'Business',
        why: 'The Business perspective ensures the investment maps to measurable business outcomes. It is about value, not about staff capability.',
      },
      {
        text: 'Governance',
        why: 'Governance covers portfolio management, cost control and risk — organising the programme rather than developing the people in it.',
      },
      {
        text: 'Operations',
        why: 'Operations is a technical perspective covering how workloads are run, monitored and recovered.',
      },
    ],
  },
  {
    id: 'm-04',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'migration-and-caf',
    prompt:
      'A company must migrate an on-premises Oracle database to Amazon Aurora PostgreSQL. The database must remain available to users throughout the migration. Which combination of services should they use?',
    options: [
      {
        text: 'AWS Schema Conversion Tool to convert the schema, then AWS Database Migration Service to move the data',
        correct: true,
        why: 'The engine changes, so the schema and stored code must be converted by SCT. DMS then moves the data and can keep the source online and replicating until cutover.',
      },
      {
        text: 'AWS Database Migration Service alone',
        why: 'DMS moves data well, but a migration between different engines needs the schema and procedural code converting first — that is SCT’s job.',
      },
      {
        text: 'AWS Snowball to ship the database to AWS',
        why: 'Snowball is for bulk offline transfer where the network is the constraint. It would also require significant downtime, which the question forbids.',
      },
      {
        text: 'AWS DataSync to synchronise the database files',
        why: 'DataSync transfers file and object data. Copying live database files is not a supported or safe way to migrate a running database.',
      },
    ],
    explain:
      'Same engine → <strong>DMS alone</strong>. Different engine (heterogeneous) → <strong>SCT + DMS</strong>.',
  },
  {
    id: 'm-05',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'migration-and-caf',
    prompt:
      'A company replaces its self-hosted email and CRM systems by subscribing to commercial SaaS products. Which migration strategy have they used?',
    options: [
      {
        text: 'Repurchase',
        correct: true,
        why: 'Repurchasing means dropping your own application and buying a product that does the job — often the cheapest long-term option for commodity systems like email, CRM and HR.',
      },
      {
        text: 'Refactor',
        why: 'Refactoring means rewriting the application yourself around cloud-native services. They wrote nothing.',
      },
      {
        text: 'Replatform',
        why: 'Replatforming keeps your application and optimises part of the stack underneath it. Here the application was discarded entirely.',
      },
      {
        text: 'Relocate',
        why: 'Relocate moves VMware workloads to AWS without conversion. No VMware estate is described.',
      },
    ],
  },
  {
    id: 'm-06',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'migration-and-caf',
    prompt:
      'Which service provides a single dashboard for tracking the progress of application migrations across multiple AWS migration tools?',
    options: [
      {
        text: 'AWS Migration Hub',
        correct: true,
        why: 'Migration Hub gives one place to discover servers, group them into applications and track migration progress regardless of which underlying tool is doing the work.',
      },
      {
        text: 'AWS Application Migration Service',
        why: 'MGN performs the rehosting itself — replicating servers and cutting over. It is one of the tools Migration Hub reports on.',
      },
      {
        text: 'AWS Control Tower',
        why: 'Control Tower sets up and governs a multi-account landing zone. It does not track migration progress.',
      },
      {
        text: 'AWS Systems Manager',
        why: 'Systems Manager operates a fleet you already have — patching, running commands, session access.',
      },
    ],
  },
  {
    id: 'm-07',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'well-architected-framework',
    prompt:
      'Which of these are design principles promoted by the AWS Well-Architected Framework? (Choose TWO.)',
    choose: 2,
    options: [
      {
        text: 'Stop guessing your capacity needs',
        correct: true,
        why: 'A core principle. Scale automatically to match actual demand instead of predicting a peak months ahead and buying for it.',
      },
      {
        text: 'Automate to make architectural experimentation easier',
        correct: true,
        why: 'Another core principle. Infrastructure as code makes an experiment cost an afternoon rather than a quarter, so architectures can evolve on evidence.',
      },
      {
        text: 'Design each workload to run in a single Availability Zone to reduce cost',
        why: 'This is the opposite of the Reliability pillar’s guidance. A single zone is a single point of failure.',
      },
      {
        text: 'Buy hardware capacity in advance to guarantee availability at peak',
        why: 'This is the on-premises habit the framework explicitly tells you to abandon.',
      },
    ],
  },
  {
    id: 'm-08',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'what-is-cloud-computing',
    prompt:
      'A company wants to reduce the total cost of ownership of its IT estate by no longer buying, racking or maintaining physical servers. Which cloud benefit does this describe?',
    options: [
      {
        text: 'Stop spending money running and maintaining data centres',
        correct: true,
        why: 'One of the six named advantages: the undifferentiated work of powering, cooling and replacing hardware stops being your cost and your problem.',
      },
      {
        text: 'Stop guessing capacity',
        why: 'That benefit is about matching resources to demand rather than predicting it. The question is about owning hardware at all.',
      },
      {
        text: 'Go global in minutes',
        why: 'That benefit concerns deploying near users in other geographies. No geography is mentioned.',
      },
      {
        text: 'Increase speed and agility',
        why: 'Agility is about how fast resources can be provisioned, which makes experiments cheap. The question is about ownership costs.',
      },
    ],
  },
  {
    id: 'm-09',
    ccpDomain: 1,
    track: 'architecture',
    exams: ['CCP'],
    lesson: 'well-architected-framework',
    prompt:
      'A company wants to review an existing workload against AWS best practices and receive a list of architectural risks. Which tool should they use?',
    options: [
      {
        text: 'AWS Well-Architected Tool',
        correct: true,
        why: 'It walks you through the framework’s questions for a specific workload and produces an improvement plan listing the risks it found.',
      },
      {
        text: 'AWS Trusted Advisor',
        why: 'Trusted Advisor inspects live resources against fixed best-practice checks. It evaluates what is running, not the design decisions behind it.',
      },
      {
        text: 'AWS Config',
        why: 'Config records resource configuration and evaluates compliance rules. It does not assess an architecture against the six pillars.',
      },
      {
        text: 'AWS Compute Optimizer',
        why: 'Compute Optimizer recommends right-sized instances from observed utilisation. Its scope is one narrow slice of the Cost and Performance pillars.',
      },
    ],
    explain:
      '<strong>Well-Architected Tool reviews the design. Trusted Advisor checks the running resources.</strong>',
  },
  {
    id: 'm-10',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'migration-and-caf',
    prompt:
      'Which statement best describes the Retain strategy in an AWS migration?',
    options: [
      {
        text: 'Deliberately keeping an application on-premises, at least for now',
        correct: true,
        why: 'Retain is an explicit decision not to move something — because of licensing, compliance, latency, or hardware that has not yet been written off. It is revisited later, not abandoned.',
      },
      {
        text: 'Keeping the application running during the migration with no downtime',
        why: 'That is a property of the migration tooling, such as DMS replicating while the source stays online. It is not what Retain means.',
      },
      {
        text: 'Retaining the existing licences after moving to AWS',
        why: 'Bringing your own licences is a real consideration — and points at Dedicated Hosts — but it is not the definition of this strategy.',
      },
      {
        text: 'Archiving the application’s data to Amazon S3 Glacier before decommissioning',
        why: 'That is closer to Retire, where the application is switched off and its data may be archived.',
      },
    ],
  },
  {
    id: 'm-11',
    ccpDomain: 1,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'migration-and-caf',
    prompt:
      'Which two perspectives of the AWS Cloud Adoption Framework are technical rather than business-focused? (Choose TWO.)',
    choose: 2,
    options: [
      {
        text: 'Platform',
        correct: true,
        why: 'Platform is a technical perspective, covering the target architecture, environments and the patterns workloads are built on.',
      },
      {
        text: 'Operations',
        correct: true,
        why: 'Operations is a technical perspective, covering running, monitoring and recovering workloads to agreed service levels.',
      },
      {
        text: 'Business',
        why: 'Business is one of the two business-capability perspectives, owned by executives and finance and concerned with measurable value.',
      },
      {
        text: 'People',
        why: 'People is the other business-capability perspective, covering skills, roles, culture and change management.',
      },
    ],
  },

  // ─────────────────────────────────────────── encryption & keys (Domain 2)
  {
    id: 'e-01',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'encryption-and-key-management',
    prompt:
      'Which AWS service provides free TLS/SSL certificates for use with Elastic Load Balancing and Amazon CloudFront, and renews them automatically?',
    options: [
      {
        text: 'AWS Certificate Manager',
        correct: true,
        why: 'ACM issues and automatically renews public certificates at no charge for use with integrated AWS services, which removes expiry-related outages entirely.',
      },
      {
        text: 'AWS Key Management Service',
        why: 'KMS manages the keys that encrypt data at rest. It does not issue TLS certificates.',
      },
      {
        text: 'AWS Secrets Manager',
        why: 'Secrets Manager stores and rotates credentials such as database passwords and API keys.',
      },
      {
        text: 'AWS CloudHSM',
        why: 'CloudHSM provides dedicated single-tenant hardware for key custody. It is not a certificate authority service.',
      },
    ],
  },
  {
    id: 'e-02',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'encryption-and-key-management',
    prompt:
      'A regulator requires that a company use single-tenant, dedicated hardware for cryptographic key storage, and that AWS must have no ability to access the keys. Which service meets this?',
    options: [
      {
        text: 'AWS CloudHSM',
        correct: true,
        why: 'CloudHSM provides FIPS 140-3 Level 3 validated hardware security modules dedicated to one customer, where AWS has no access to the keys — and cannot recover them if lost.',
      },
      {
        text: 'AWS KMS with a customer managed key',
        why: 'A customer managed key gives you control of the key policy and rotation, but KMS is a multi-tenant managed service. It does not satisfy a single-tenant hardware requirement.',
      },
      {
        text: 'AWS Secrets Manager',
        why: 'Secrets Manager stores credentials, encrypted using KMS. It is not a hardware security module.',
      },
      {
        text: 'Amazon Macie',
        why: 'Macie discovers sensitive data in S3. It has no key management function at all.',
      },
    ],
  },
  {
    id: 'e-03',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP'],
    lesson: 'encryption-and-key-management',
    prompt:
      'Which statement about data encryption on AWS is correct?',
    options: [
      {
        text: 'Encryption in transit protects data moving across a network; encryption at rest protects data stored on disk',
        correct: true,
        why: 'These are the two states data can be in, and they use different mechanisms — TLS for the wire, KMS-backed encryption for storage.',
      },
      {
        text: 'AWS encrypts all customer data in all services by default and this cannot be changed',
        why: 'Many services encrypt by default (S3 and DynamoDB among them), but this is not universal, and where it applies you can still choose which key is used.',
      },
      {
        text: 'Encryption at rest is the customer’s responsibility only for on-premises workloads',
        why: 'Under the Shared Responsibility Model, protecting your data — including choosing to encrypt it — is your responsibility in the cloud too.',
      },
      {
        text: 'Enabling encryption on an Amazon S3 bucket prevents anyone from accessing the objects',
        why: 'Encryption protects the data at rest; who may read it is decided by IAM policies, bucket policies and key policies. An encrypted public bucket is still public.',
      },
    ],
  },
  {
    id: 'e-04',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'encryption-and-key-management',
    prompt:
      'A company stores database credentials that must be rotated automatically every 30 days with no application downtime. Which service should they use?',
    options: [
      {
        text: 'AWS Secrets Manager',
        correct: true,
        why: 'Secrets Manager rotates credentials on a schedule, natively for RDS, updating the database and the stored secret together so applications keep working.',
      },
      {
        text: 'AWS Systems Manager Parameter Store',
        why: 'Parameter Store can hold encrypted values at no cost, but it has no built-in rotation — you would have to build and operate that yourself.',
      },
      {
        text: 'AWS KMS',
        why: 'KMS manages encryption keys, and can rotate those. It does not manage or rotate application credentials such as database passwords.',
      },
      {
        text: 'AWS IAM',
        why: 'IAM manages AWS identities and permissions, not credentials for a database engine.',
      },
    ],
    explain:
      'The one-word tell: <strong>rotation → Secrets Manager</strong>, <strong>no additional cost → Parameter Store</strong>.',
  },
  {
    id: 'e-05',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP'],
    lesson: 'encryption-and-key-management',
    prompt:
      'Under the AWS Shared Responsibility Model, who is responsible for deciding whether data stored in Amazon S3 is encrypted, and for managing the keys used?',
    options: [
      {
        text: 'The customer',
        correct: true,
        why: 'Security *in* the cloud is the customer’s responsibility, and that includes classifying data, choosing encryption, and managing key policies and access.',
      },
      {
        text: 'AWS',
        why: 'AWS provides the encryption mechanisms and secures the underlying infrastructure, but it does not decide what your data requires.',
      },
      {
        text: 'It is shared equally between AWS and the customer',
        why: 'The model divides responsibilities rather than sharing individual ones. Data protection decisions sit clearly on the customer side.',
      },
      {
        text: 'The AWS Support plan determines responsibility',
        why: 'Support plans affect response times and access to expertise. They do not move the responsibility boundary.',
      },
    ],
  },

  // ─────────────────────────────────────────── threat detection (Domain 2)
  {
    id: 'g-01',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'threat-detection-and-protection',
    prompt:
      'Which AWS service continuously analyses CloudTrail, VPC Flow Logs and DNS logs to detect unusual or malicious activity in an account?',
    options: [
      {
        text: 'Amazon GuardDuty',
        correct: true,
        why: 'GuardDuty is the managed threat detection service. It reads those log sources and flags behaviour such as compromised credentials, crypto-mining and reconnaissance.',
      },
      {
        text: 'Amazon Inspector',
        why: 'Inspector scans EC2 instances, container images and Lambda functions for known software vulnerabilities and unintended network exposure.',
      },
      {
        text: 'Amazon Macie',
        why: 'Macie discovers and classifies sensitive data such as personal information within Amazon S3.',
      },
      {
        text: 'AWS Shield',
        why: 'Shield defends against distributed denial of service attacks. It does not analyse account activity logs.',
      },
    ],
  },
  {
    id: 'g-02',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'threat-detection-and-protection',
    prompt:
      'A company needs to discover whether any of their Amazon S3 buckets contain customer personal data such as passport or card numbers. Which service should they use?',
    options: [
      {
        text: 'Amazon Macie',
        correct: true,
        why: 'Macie uses machine learning to discover and classify sensitive data in S3, reporting which buckets hold it and whether they are publicly accessible.',
      },
      {
        text: 'Amazon GuardDuty',
        why: 'GuardDuty detects suspicious behaviour from log analysis. It does not inspect the contents of your objects.',
      },
      {
        text: 'Amazon Inspector',
        why: 'Inspector assesses workloads for software vulnerabilities. It does not classify stored data.',
      },
      {
        text: 'AWS Config',
        why: 'Config records resource configuration and compliance — it could tell you a bucket is public, but not what is inside it.',
      },
    ],
    explain:
      'Match the noun: <strong>behaviour → GuardDuty · software → Inspector · data → Macie.</strong>',
  },
  {
    id: 'g-03',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP'],
    lesson: 'threat-detection-and-protection',
    prompt:
      'Which statement about AWS Shield is correct?',
    options: [
      {
        text: 'Shield Standard is provided to all AWS customers at no additional charge',
        correct: true,
        why: 'Every account is protected against common network and transport layer DDoS attacks automatically. Shield Advanced is the paid tier adding the response team and cost protection.',
      },
      {
        text: 'Shield must be purchased before any DDoS protection applies',
        why: 'Shield Standard is always on and free. Only the Advanced tier is purchased.',
      },
      {
        text: 'Shield inspects HTTP requests for SQL injection patterns',
        why: 'That is AWS WAF, which works at the application layer. Shield addresses volumetric attacks.',
      },
      {
        text: 'Shield is only available for Amazon EC2 instances',
        why: 'Shield protects AWS services broadly, including CloudFront, Route 53 and Elastic Load Balancing.',
      },
    ],
  },
  {
    id: 'g-04',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'threat-detection-and-protection',
    prompt:
      'A company wants a single place to view and prioritise security findings from GuardDuty, Inspector and Macie, scored against the CIS AWS Foundations Benchmark. What should they use?',
    options: [
      {
        text: 'AWS Security Hub',
        correct: true,
        why: 'Security Hub aggregates findings from AWS security services and partners into one view and scores the account against standards such as CIS and AWS Foundational Security Best Practices.',
      },
      {
        text: 'Amazon Detective',
        why: 'Detective helps you investigate a specific finding by building a graph of related activity. It is the next step after a finding, not the aggregation layer.',
      },
      {
        text: 'AWS CloudTrail',
        why: 'CloudTrail is the API audit log. It is a data source for these services rather than a findings dashboard.',
      },
      {
        text: 'Amazon CloudWatch',
        why: 'CloudWatch is for operational metrics, logs and alarms rather than aggregated security findings scored against benchmarks.',
      },
    ],
  },
  {
    id: 'g-05',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP'],
    lesson: 'threat-detection-and-protection',
    prompt:
      'A company is building a mobile application and needs to manage sign-up, sign-in and access control for its end users, including federation with Google and Facebook. Which service should they use?',
    options: [
      {
        text: 'Amazon Cognito',
        correct: true,
        why: 'Cognito provides user pools for sign-up and sign-in and identity pools for granting temporary AWS credentials, with social and enterprise identity federation built in.',
      },
      {
        text: 'AWS IAM Identity Center',
        why: 'IAM Identity Center manages workforce access to AWS accounts and applications — your employees, not your product’s customers.',
      },
      {
        text: 'AWS Directory Service',
        why: 'Directory Service provides managed Microsoft Active Directory, typically for joining Windows instances to a domain or federating corporate identities.',
      },
      {
        text: 'AWS IAM users, one per application user',
        why: 'IAM is for principals that call AWS APIs and has account limits far below application scale. Creating an IAM user per customer is an anti-pattern.',
      },
    ],
    explain:
      '<strong>Cognito = your application’s users. IAM Identity Center = your employees.</strong>',
  },

  // ─────────────────────────────────────────── governance (Domain 2)
  {
    id: 'v-01',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'governance-and-compliance',
    prompt:
      'A company needs to know which resources in their account are not compliant with an internal rule requiring all EBS volumes to be encrypted, and to keep a history of configuration changes. Which service should they use?',
    options: [
      {
        text: 'AWS Config',
        correct: true,
        why: 'Config records the configuration of resources over time and continuously evaluates them against rules, reporting anything non-compliant.',
      },
      {
        text: 'AWS CloudTrail',
        why: 'CloudTrail records API calls — who did what and when. It does not evaluate resources against compliance rules.',
      },
      {
        text: 'AWS Artifact',
        why: 'Artifact provides AWS’s own compliance reports for download. It has no visibility of your resources.',
      },
      {
        text: 'Amazon Inspector',
        why: 'Inspector finds software vulnerabilities in workloads, not configuration compliance across resource types.',
      },
    ],
  },
  {
    id: 'v-02',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP'],
    lesson: 'governance-and-compliance',
    prompt:
      'Where can a company download AWS’s SOC 2 and PCI DSS compliance reports to share with their own auditors?',
    options: [
      {
        text: 'AWS Artifact',
        correct: true,
        why: 'Artifact is the self-service portal for AWS’s audit reports and agreements, available on demand from the console at no charge.',
      },
      {
        text: 'AWS Audit Manager',
        why: 'Audit Manager continuously collects evidence about *your* environment against a framework. It does not supply AWS’s own certifications.',
      },
      {
        text: 'AWS Trusted Advisor',
        why: 'Trusted Advisor gives best-practice recommendations on your account across five categories.',
      },
      {
        text: 'AWS Well-Architected Tool',
        why: 'The Well-Architected Tool reviews a workload’s design against the six pillars.',
      },
    ],
    explain: '<strong>Artifact = proof about AWS. Audit Manager = proof about you.</strong>',
  },
  {
    id: 'v-03',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP', 'SAA'],
    lesson: 'governance-and-compliance',
    prompt:
      'A company wants to set up a secure, multi-account AWS environment with pre-configured guardrails, a centralised log archive and an automated way to provision new compliant accounts. Which service does this?',
    options: [
      {
        text: 'AWS Control Tower',
        correct: true,
        why: 'Control Tower builds a landing zone — Organizations, log archive and audit accounts, CloudTrail and Config — with a catalogue of guardrails and an Account Factory for new accounts.',
      },
      {
        text: 'AWS Organizations alone',
        why: 'Organizations provides the account structure and SCPs, but you would configure logging, guardrails and account provisioning yourself. Control Tower automates that on top of it.',
      },
      {
        text: 'AWS Config',
        why: 'Config records and evaluates resource configuration. It is one component of a landing zone, not the thing that builds one.',
      },
      {
        text: 'AWS Systems Manager',
        why: 'Systems Manager operates existing fleets — patching, commands, session access. It does not create governed account structures.',
      },
    ],
  },
  {
    id: 'v-04',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP'],
    lesson: 'governance-and-compliance',
    prompt:
      'An auditor asks a company to show which user terminated a specific EC2 instance and when. Which service provides this?',
    options: [
      {
        text: 'AWS CloudTrail',
        correct: true,
        why: 'CloudTrail records API activity including the identity that made the call, the action, the source IP and the timestamp.',
      },
      {
        text: 'Amazon CloudWatch',
        why: 'CloudWatch collects metrics and logs about performance and health. It is not the record of who invoked an API.',
      },
      {
        text: 'AWS Config',
        why: 'Config would show that the instance existed and then did not, along with its configuration history — but the identity behind the call is CloudTrail’s record.',
      },
      {
        text: 'AWS Trusted Advisor',
        why: 'Trusted Advisor produces best-practice recommendations, not an activity history.',
      },
    ],
  },
  {
    id: 'v-05',
    ccpDomain: 2,
    track: 'security',
    exams: ['CCP'],
    lesson: 'governance-and-compliance',
    prompt:
      'Which statement about AWS compliance is correct?',
    options: [
      {
        text: 'AWS achieving PCI DSS certification does not by itself make a customer’s application PCI compliant',
        correct: true,
        why: 'Certifications cover AWS’s half of the Shared Responsibility Model. The customer remains responsible for how their own application handles card data.',
      },
      {
        text: 'Any workload running on AWS is automatically compliant with GDPR',
        why: 'AWS provides the tools and a Data Processing Addendum, but compliance depends on how you handle personal data — including which Region you store it in.',
      },
      {
        text: 'AWS assumes responsibility for a customer’s regulatory compliance once they sign a support agreement',
        why: 'Support plans change response times and access to expertise, never the responsibility boundary.',
      },
      {
        text: 'Compliance reports must be requested from AWS Support and take several days',
        why: 'They are self-service and immediate in AWS Artifact.',
      },
    ],
  },

  // ─────────────────────────────────────────── deploy & operate (Domain 3)
  {
    id: 'o-01',
    ccpDomain: 3,
    track: 'foundations',
    exams: ['CCP', 'SAA'],
    lesson: 'deploying-and-operating',
    prompt:
      'A company wants to define its AWS infrastructure in a template file so that identical environments can be created repeatedly and changes reviewed before they are applied. Which service should they use?',
    options: [
      {
        text: 'AWS CloudFormation',
        correct: true,
        why: 'CloudFormation creates and updates stacks of resources from a YAML or JSON template, making environments repeatable, reviewable and reversible. The service itself is free.',
      },
      {
        text: 'AWS Systems Manager',
        why: 'Systems Manager operates existing resources — patching, running commands, storing parameters. It does not provision infrastructure from a template.',
      },
      {
        text: 'AWS Config',
        why: 'Config records what resources look like and whether they comply with rules. It observes rather than creates.',
      },
      {
        text: 'AWS CodeDeploy',
        why: 'CodeDeploy releases application code to compute targets. The underlying infrastructure must already exist.',
      },
    ],
  },
  {
    id: 'o-02',
    ccpDomain: 3,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'deploying-and-operating',
    prompt:
      'Which service collects metrics, logs and alarms so a team can tell whether their application is healthy?',
    options: [
      {
        text: 'Amazon CloudWatch',
        correct: true,
        why: 'CloudWatch is the monitoring and observability service: metrics over time, log aggregation, alarms on thresholds, and dashboards.',
      },
      {
        text: 'AWS CloudTrail',
        why: 'CloudTrail records API activity for audit and governance — who did what, when — rather than operational health.',
      },
      {
        text: 'AWS Config',
        why: 'Config tracks resource configuration and compliance over time, not runtime performance.',
      },
      {
        text: 'AWS X-Ray',
        why: 'X-Ray traces individual requests across services to locate latency. It complements CloudWatch rather than replacing it.',
      },
    ],
  },
  {
    id: 'o-03',
    ccpDomain: 3,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'deploying-and-operating',
    prompt:
      'Which statements about accessing AWS are correct? (Choose TWO.)',
    choose: 2,
    options: [
      {
        text: 'The AWS Management Console, AWS CLI and AWS SDKs all call the same underlying AWS APIs',
        correct: true,
        why: 'There is one API surface behind every access method, which is why IAM permissions and CloudTrail logging apply consistently regardless of route.',
      },
      {
        text: 'The AWS CLI allows AWS operations to be scripted and repeated',
        correct: true,
        why: 'That is its purpose — the same operations as the console, in a form you can put in a script or a pipeline.',
      },
      {
        text: 'Actions taken in the AWS Management Console are not recorded by AWS CloudTrail',
        why: 'Console actions become API calls like any other and are recorded by CloudTrail.',
      },
      {
        text: 'The AWS SDKs require a separate paid subscription',
        why: 'The SDKs are free and open source. You pay only for the AWS resources your code uses.',
      },
    ],
  },
  {
    id: 'o-04',
    ccpDomain: 3,
    track: 'foundations',
    exams: ['CCP'],
    lesson: 'deploying-and-operating',
    prompt:
      'A developer wants to upload application code and have AWS automatically provision the EC2 instances, load balancer and Auto Scaling group needed to run it. Which service should they use?',
    options: [
      {
        text: 'AWS Elastic Beanstalk',
        correct: true,
        why: 'Beanstalk takes uploaded code and provisions and manages the supporting infrastructure, while leaving those resources visible in the account. There is no charge for Beanstalk itself.',
      },
      {
        text: 'AWS CloudFormation',
        why: 'CloudFormation would build the infrastructure, but the developer would first have to describe all of it in a template.',
      },
      {
        text: 'AWS Systems Manager',
        why: 'Systems Manager manages resources that already exist rather than deploying an application and its environment.',
      },
      {
        text: 'AWS CodePipeline',
        why: 'CodePipeline automates the release process between stages. It does not itself create the runtime environment.',
      },
    ],
  },

  // ─────────────────────────────────────────── AI/ML & analytics (Domain 3)
  {
    id: 'i-01',
    ccpDomain: 3,
    track: 'services',
    exams: ['CCP'],
    lesson: 'ai-ml-and-analytics',
    prompt:
      'A company wants to automatically convert recorded customer support calls into written text for analysis. Which service should they use?',
    options: [
      {
        text: 'Amazon Transcribe',
        correct: true,
        why: 'Transcribe is the automatic speech recognition service — audio in, text out — and is designed for exactly this use case.',
      },
      {
        text: 'Amazon Polly',
        why: 'Polly does the reverse: it converts text into lifelike speech.',
      },
      {
        text: 'Amazon Comprehend',
        why: 'Comprehend analyses text that you already have for sentiment, entities and key phrases. It cannot process audio.',
      },
      {
        text: 'Amazon Textract',
        why: 'Textract extracts text, forms and tables from scanned documents. There are no documents here.',
      },
    ],
    explain: '<strong>Transcribe: speech → text. Polly: text → speech.</strong>',
  },
  {
    id: 'i-02',
    ccpDomain: 3,
    track: 'services',
    exams: ['CCP'],
    lesson: 'ai-ml-and-analytics',
    prompt:
      'A company wants to detect objects, scenes and inappropriate content in images uploaded by users. Which service should they use?',
    options: [
      {
        text: 'Amazon Rekognition',
        correct: true,
        why: 'Rekognition provides image and video analysis including object and scene detection, facial analysis and content moderation, through a pre-trained API.',
      },
      {
        text: 'Amazon Textract',
        why: 'Textract is for extracting text and structured data from scanned documents, not for understanding photographs.',
      },
      {
        text: 'Amazon SageMaker',
        why: 'SageMaker could be used to build such a model, but a pre-trained service already exists and requires no data science work.',
      },
      {
        text: 'Amazon Kendra',
        why: 'Kendra is an intelligent search service over your documents. It does not analyse images.',
      },
    ],
  },
  {
    id: 'i-03',
    ccpDomain: 3,
    track: 'services',
    exams: ['CCP'],
    lesson: 'ai-ml-and-analytics',
    prompt:
      'Which service provides serverless extract, transform and load (ETL) along with a data catalogue describing datasets stored in Amazon S3?',
    options: [
      {
        text: 'AWS Glue',
        correct: true,
        why: 'Glue is the serverless ETL service, and its Data Catalog records the schema and metadata of datasets so services such as Athena can query them.',
      },
      {
        text: 'Amazon Athena',
        why: 'Athena queries data in S3 using SQL. It reads the Glue Data Catalog rather than creating it, and performs no ETL.',
      },
      {
        text: 'Amazon EMR',
        why: 'EMR runs managed Hadoop and Spark clusters. It can perform ETL, but it is not serverless and provides no catalogue.',
      },
      {
        text: 'Amazon QuickSight',
        why: 'QuickSight is the business intelligence and dashboard layer at the end of the pipeline.',
      },
    ],
  },
  {
    id: 'i-04',
    ccpDomain: 3,
    track: 'services',
    exams: ['CCP'],
    lesson: 'ai-ml-and-analytics',
    prompt:
      'A company needs to ingest and process a continuous stream of clickstream data in real time as events arrive. Which service is designed for this?',
    options: [
      {
        text: 'Amazon Kinesis',
        correct: true,
        why: 'Kinesis is built for real-time streaming data — collecting, processing and analysing events as they arrive rather than in batches.',
      },
      {
        text: 'Amazon Redshift',
        why: 'Redshift is a data warehouse for analytical queries over data at rest, typically loaded in batches.',
      },
      {
        text: 'Amazon Athena',
        why: 'Athena queries data already stored in S3. It is not an ingestion mechanism for live streams.',
      },
      {
        text: 'AWS Glue',
        why: 'Glue performs ETL jobs and cataloguing, generally in batch rather than on a live event stream.',
      },
    ],
    explain: '<strong>"Real time" or "streaming" → Kinesis.</strong> Everything else here is data at rest.',
  },

  // ─────────────────────────────────────────── other services (Domain 3)
  {
    id: 'r-01',
    ccpDomain: 3,
    track: 'services',
    exams: ['CCP'],
    lesson: 'services-to-recognise',
    prompt:
      'A company wants to provide employees with managed virtual desktops in the cloud, accessible from any device, so that no company data is stored on local laptops. Which service should they use?',
    options: [
      {
        text: 'Amazon WorkSpaces',
        correct: true,
        why: 'WorkSpaces provides fully managed virtual desktops that users connect to from any device, keeping data in AWS rather than on the endpoint.',
      },
      {
        text: 'Amazon AppStream 2.0',
        why: 'AppStream streams an individual application rather than a full desktop. The question asks for desktops.',
      },
      {
        text: 'Amazon EC2 with Remote Desktop configured manually',
        why: 'Possible, but you would manage instances, images, sessions, scaling and licensing yourself — which is what the managed service removes.',
      },
      {
        text: 'AWS Amplify',
        why: 'Amplify builds and hosts web and mobile front ends. It has nothing to do with virtual desktops.',
      },
    ],
  },
  {
    id: 'r-02',
    ccpDomain: 3,
    track: 'services',
    exams: ['CCP'],
    lesson: 'services-to-recognise',
    prompt:
      'Which service automates the full release process, chaining source, build and deploy stages into a continuous delivery pipeline?',
    options: [
      {
        text: 'AWS CodePipeline',
        correct: true,
        why: 'CodePipeline orchestrates the stages — typically CodeCommit, CodeBuild and CodeDeploy — into an automated release pipeline.',
      },
      {
        text: 'AWS CodeDeploy',
        why: 'CodeDeploy handles one stage: releasing code to EC2, Lambda or ECS. It does not orchestrate the whole pipeline.',
      },
      {
        text: 'AWS CodeBuild',
        why: 'CodeBuild compiles source and runs tests. It is a stage within a pipeline.',
      },
      {
        text: 'AWS CodeCommit',
        why: 'CodeCommit hosts private Git repositories — the source stage only.',
      },
    ],
  },
  {
    id: 'r-03',
    ccpDomain: 3,
    track: 'services',
    exams: ['CCP'],
    lesson: 'services-to-recognise',
    prompt:
      'A company needs a managed cloud contact centre to handle inbound customer phone calls, with pay-as-you-go per-minute pricing. Which service should they use?',
    options: [
      {
        text: 'Amazon Connect',
        correct: true,
        why: 'Connect is AWS’s omnichannel cloud contact centre, providing phone numbers, call routing and an agent interface, billed per minute of use.',
      },
      {
        text: 'Amazon Simple Email Service',
        why: 'SES sends bulk and transactional email. It handles no voice traffic.',
      },
      {
        text: 'Amazon SNS',
        why: 'SNS is a pub/sub notification service for messages between systems, and for SMS and push notifications — not a contact centre.',
      },
      {
        text: 'Amazon Lex',
        why: 'Lex builds conversational interfaces and is often used *inside* Connect, but it is not the contact centre platform itself.',
      },
    ],
  },

  // ─────────────────────────────────────────── billing top-up (Domain 4)
  {
    id: 'b-07',
    ccpDomain: 4,
    track: 'billing',
    exams: ['CCP'],
    lesson: 'pricing-and-cost-management',
    prompt:
      'A company wants to attribute AWS costs to individual departments so each can be shown its own spend. What should they implement?',
    options: [
      {
        text: 'Cost allocation tags, activated in the billing console and reported through Cost Explorer',
        correct: true,
        why: 'Tagging resources with a department or project key, then activating those tags for cost allocation, is how a single bill becomes a per-team breakdown.',
      },
      {
        text: 'A separate AWS Support plan for each department',
        why: 'Support plans govern response times and access to expertise. They do not break down resource spend.',
      },
      {
        text: 'AWS Pricing Calculator estimates for each department',
        why: 'The Pricing Calculator estimates hypothetical architectures. It has no view of what was actually consumed.',
      },
      {
        text: 'Amazon CloudWatch billing metrics',
        why: 'CloudWatch can alarm on estimated charges, but it does not attribute costs to departments the way tags plus Cost Explorer do.',
      },
    ],
  },
];

/** Every question tagged for an exam, in bank order. */
export function questionsForExam(exam: Exam): Question[] {
  return QUESTIONS.filter((q) => q.exams.includes(exam));
}

export function questionsForTrack(track: Track): Question[] {
  return QUESTIONS.filter((q) => q.track === track);
}

/**
 * How the CCP bank is spread across the four exam domains, next to the
 * weighting the real exam uses. Surfaced on the quiz hub so it is obvious when
 * the bank has drifted away from the blueprint.
 */
export function ccpDomainMix() {
  const ccp = questionsForExam('CCP');
  return (Object.keys(CCP_DOMAINS) as unknown as CcpDomain[]).map((d) => {
    const count = ccp.filter((q) => q.ccpDomain === Number(d)).length;
    return {
      domain: Number(d) as CcpDomain,
      ...CCP_DOMAINS[d],
      count,
      share: ccp.length ? Math.round((count / ccp.length) * 100) : 0,
    };
  });
}

/** How many questions exist per track — used to hide empty track quizzes. */
export function countByTrack(): Record<Track, number> {
  const out = Object.fromEntries(TRACKS.map((t) => [t, 0])) as Record<Track, number>;
  for (const q of QUESTIONS) out[q.track] += 1;
  return out;
}
