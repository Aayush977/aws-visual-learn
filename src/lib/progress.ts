/**
 * Which lessons have been read, kept in localStorage.
 *
 * Browser-only — every function here guards against storage being unavailable
 * (private browsing, or a user who has blocked it), because a study site that
 * throws on load is worse than one that forgets your progress.
 */

export const READ_KEY = 'awsvl:read';

export function readSet(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(READ_KEY) || '[]');
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

export function saveRead(set: Set<string>): void {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...set]));
  } catch {
    /* nothing to be done — the toggle still works for this page view */
  }
}
