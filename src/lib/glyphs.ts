/**
 * Tiny stroke-only glyphs drawn on a 24x24 grid.
 *
 * These are deliberately generic shapes rather than AWS's official product
 * icons, so the site has no licensing strings attached and the whole icon set
 * stays one small file. If you later want the real thing, AWS publishes an
 * "Architecture Icons" pack you can drop into /public and reference instead.
 *
 * Each entry is a list of SVG path `d` strings, stroked with currentColor.
 */
export const GLYPHS = {
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4 21a8 8 0 0 1 16 0'],
  globe: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    'M3 12h18',
    'M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z',
  ],
  dns: ['M4 6h16', 'M7 6v12', 'M17 6v12', 'M4 18h16', 'M10 12h4'],
  cdn: [
    'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M5 20c0-4 3-7 7-7s7 3 7 7',
    'M2 15a13 13 0 0 1 20 0',
  ],
  balancer: [
    'M12 3v5',
    'M12 8 5 13v3',
    'M12 8l7 5v3',
    'M12 8v8',
    'M3 16h4v5H3z',
    'M10 16h4v5h-4z',
    'M17 16h4v5h-4z',
  ],
  server: [
    'M3 4h18v7H3z',
    'M3 13h18v7H3z',
    'M6.5 7.5h.01',
    'M6.5 16.5h.01',
    'M10 7.5h6',
    'M10 16.5h6',
  ],
  container: ['M3 8h18v11H3z', 'M3 8l3-4h12l3 4', 'M8 12v3', 'M12 12v3', 'M16 12v3'],
  lambda: ['M6 20 13 4l5 16', 'M6 4h4'],
  bucket: ['M4 6h16l-2 14H6L4 6Z', 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3', 'M7 11h10'],
  archive: ['M3 5h18v4H3z', 'M5 9v11h14V9', 'M10 13h4'],
  database: [
    'M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3Z',
    'M20 5v14c0 1.7-3.6 3-8 3s-8-1.3-8-3V5',
    'M20 12c0 1.7-3.6 3-8 3s-8-1.3-8-3',
  ],
  cache: ['M6 4h12v16H6z', 'M9 8h6', 'M9 12h6', 'M9 16h3', 'M3 8h3', 'M3 16h3'],
  queue: ['M3 7h5v10H3z', 'M10 7h5v10h-5z', 'M17 7h4v10h-4z'],
  lock: ['M6 11h12v10H6z', 'M9 11V8a3 3 0 0 1 6 0v3', 'M12 15v3'],
  shield: ['M12 2 4 5v7c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V5l-8-3Z', 'M9 12l2 2 4-4'],
  key: ['M15 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z', 'M13.5 11.5 21 19l-2 2-1.5-1.5-1.5 1.5-2-2'],
  region: ['M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z', 'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'],
  zone: ['M4 21V7l8-4 8 4v14', 'M9 21v-6h6v6', 'M8 10h.01', 'M16 10h.01'],
  cloud: ['M7 19a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 10.5a4.25 4.25 0 0 1-.5 8.5H7Z'],
  firewall: ['M3 5h18v14H3z', 'M3 10h18', 'M3 15h18', 'M8 5v5', 'M15 10v5', 'M8 15v4'],
  money: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 6v12', 'M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5-3-1.1-3-2.5'],
  eye: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  file: ['M6 3h8l4 4v14H6z', 'M14 3v4h4', 'M9 12h6', 'M9 16h6'],
  gear: [
    'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
    'M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.2-2-3.4-2.2.9a7.6 7.6 0 0 0-2.6-1.5L14.2 3H9.8l-.4 2.3a7.6 7.6 0 0 0-2.6 1.5l-2.2-.9-2 3.4 2 1.2a7.6 7.6 0 0 0 0 3l-2 1.2 2 3.4 2.2-.9a7.6 7.6 0 0 0 2.6 1.5l.4 2.3h4.4l.4-2.3a7.6 7.6 0 0 0 2.6-1.5l2.2.9 2-3.4-2-1.2Z',
  ],
  /** Block storage — four detached blocks you attach to one machine. */
  disk: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  /** File storage — a shared folder many machines mount at once. */
  folder: ['M3 6h6l2 2h10v11H3z', 'M3 11h18'],
  /** Data warehouse — analytics over a lot of history. */
  warehouse: ['M3 20V9l9-5 9 5v11z', 'M7 20v-7h10v7', 'M7 16h10'],
  chart: ['M3 21h18', 'M6 21V11', 'M12 21V5', 'M18 21v-7'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 7v5.2l3.5 2.1'],
  allow: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M8 12.4l2.6 2.6L16 9.6'],
  deny: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M5.6 5.6 18.4 18.4'],
  /** Router / gateway — traffic entering or leaving a network. */
  router: ['M3 13h18v7H3z', 'M6.5 16.5h.01', 'M10 16.5h7', 'M12 3v6', 'M9 6l3-3 3 3'],
  /** Scaling out — the same box, more copies of it. */
  scale: ['M9 6h6v12H9z', 'M3 12h5', 'M16 12h5', 'M6.5 9 3.5 12l3 3', 'M17.5 9l3 3-3 3'],
  /** A group of principals, as opposed to the single `user`. */
  users: [
    'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
    'M2 20a7 7 0 0 1 14 0',
    'M16 4.7a3.5 3.5 0 0 1 0 6.6',
    'M17 13.6a7 7 0 0 1 5 6.4',
  ],
  /** Support plans — someone actually answers. */
  headset: ['M4 14v-2a8 8 0 1 1 16 0v2', 'M3 14h4v6H3z', 'M17 14h4v6h-4z', 'M21 20a3 3 0 0 1-3 3h-4'],
  tag: ['M3 3h8l10 10-8 8L3 11V3Z', 'M7 7h.01'],
  code: ['M9 8l-4 4 4 4', 'M15 8l4 4-4 4', 'M13.5 5l-3 14'],
  table: ['M3 5h18v14H3z', 'M3 10h18', 'M9 10v9'],
  /** Notification / message fan-out. */
  mail: ['M3 6h18v12H3z', 'M3 7.5l9 6 9-6'],
} as const;

export type GlyphName = keyof typeof GLYPHS;
