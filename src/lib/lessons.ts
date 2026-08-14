import { getCollection, type CollectionEntry } from 'astro:content';
import { TRACKS, type EXAMS } from '../content.config';

export type Lesson = CollectionEntry<'lessons'>;

const trackIndex = (t: (typeof TRACKS)[number]) => TRACKS.indexOf(t);

/** Curriculum order: by track, then by the `order` field inside the track. */
export function byCurriculum(a: Lesson, b: Lesson) {
  const t = trackIndex(a.data.track) - trackIndex(b.data.track);
  return t !== 0 ? t : a.data.order - b.data.order;
}

/** Every publishable lesson, in curriculum order. Drafts are hidden in production. */
export async function allLessons(): Promise<Lesson[]> {
  const lessons = await getCollection('lessons', ({ data }) => import.meta.env.DEV || !data.draft);
  return lessons.sort(byCurriculum);
}

export async function lessonsForExam(exam: (typeof EXAMS)[number]): Promise<Lesson[]> {
  return (await allLessons()).filter((l) => l.data.exams.includes(exam));
}

/** Group lessons into their tracks, dropping tracks that have nothing in them yet. */
export function groupByTrack(lessons: Lesson[]) {
  return TRACKS.map((track) => ({
    track,
    lessons: lessons.filter((l) => l.data.track === track),
  })).filter((g) => g.lessons.length > 0);
}
