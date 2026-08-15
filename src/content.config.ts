import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Tracks are the left-hand navigation groups. Order here is the order they
 * appear on the site, so this list doubles as the curriculum outline.
 */
export const TRACKS = [
  'foundations',
  'security',
  'networking',
  'compute',
  'storage',
  'database',
  'services',
  'architecture',
  'billing',
  'reference',
] as const;

export const TRACK_META: Record<
  (typeof TRACKS)[number],
  { label: string; blurb: string }
> = {
  foundations: {
    label: 'Cloud Foundations',
    blurb:
      'What the cloud actually is, how AWS is laid out around the world, how you talk to it, and how you move onto it.',
  },
  security: {
    label: 'Security & Identity',
    blurb: 'Who is responsible for what, and how AWS decides to allow or deny a request.',
  },
  networking: {
    label: 'Networking & Content Delivery',
    blurb: 'How a request finds your application, and how you fence it in.',
  },
  compute: {
    label: 'Compute',
    blurb: 'Servers, containers and functions — and how to choose between them.',
  },
  storage: {
    label: 'Storage',
    blurb: 'Objects, blocks and files. Where data lives and what it costs to keep.',
  },
  database: {
    label: 'Databases',
    blurb: 'Relational, key-value, cache and warehouse. Picking the right shape.',
  },
  services: {
    label: 'AI, Analytics & the Rest',
    blurb:
      'The Cloud Practitioner exam asks you to match a service to a use case. These are the ones you need to recognise by name.',
  },
  architecture: {
    label: 'Architecture & Resilience',
    blurb: 'Putting the pieces together so they survive a bad day.',
  },
  billing: {
    label: 'Billing & Support',
    blurb: 'Pricing models, cost tools, and which support plan answers the phone.',
  },
  reference: {
    label: 'Quick Reference',
    blurb:
      'Come back to these. The service pairs everyone mixes up, side by side, with the phrase that gives each one away.',
  },
};

export const EXAMS = ['CCP', 'SAA'] as const;

export const EXAM_META: Record<(typeof EXAMS)[number], { label: string; full: string }> = {
  CCP: { label: 'CCP', full: 'Cloud Practitioner (CLF-C02)' },
  SAA: { label: 'SAA', full: 'Solutions Architect Associate (SAA-C03)' },
};

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    /** Shown as the <h1> and in nav. */
    title: z.string(),
    /** One or two sentences. Shown on cards and in <meta description>. */
    summary: z.string(),
    /** Which exams this lesson is on the blueprint for. */
    exams: z.array(z.enum(EXAMS)).min(1),
    /** Navigation group. See TRACKS above. */
    track: z.enum(TRACKS),
    /** Sort order within the track. Leave gaps (10, 20, 30) so you can insert later. */
    order: z.number(),
    /**
     * The official exam domain this lesson sits in, per exam.
     *
     * CCP and SAA have entirely different blueprints, so a lesson on both
     * paths needs both labels — showing a Cloud Practitioner reader an
     * SAA-C03 domain name teaches them the wrong syllabus. Use the exact
     * wording from the current exam guide:
     *
     *   CLF-C02 — Cloud Concepts · Security and Compliance ·
     *             Cloud Technology and Services · Billing, Pricing, and Support
     *   SAA-C03 — Design Secure Architectures · Design Resilient Architectures ·
     *             Design High-Performing Architectures ·
     *             Design Cost-Optimized Architectures
     */
    domains: z
      .object({
        CCP: z.string().optional(),
        SAA: z.string().optional(),
      })
      .optional(),
    /** Rough reading time in minutes. Displayed on the lesson header. */
    minutes: z.number().default(8),
    /** The one-line memory hook for this lesson, surfaced on the card. */
    hook: z.string().optional(),
    /** Hide from listings while you are still writing it. */
    draft: z.boolean().default(false),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { lessons };
