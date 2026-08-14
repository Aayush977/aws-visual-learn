/**
 * Build a site URL that respects `base` in astro.config.mjs.
 *
 * GitHub Pages project sites live at /<repo>/, so every internal link has to be
 * prefixed. Always use url('/lessons') rather than a bare '/lessons'.
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL || '/';
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}` || '/';
}

/** The URL for a lesson entry id (its filename without the extension). */
export function lessonUrl(id: string): string {
  return url(`/lessons/${id}`);
}
