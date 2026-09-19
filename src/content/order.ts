// getCollection() does not promise any order. For the JSON list files we want
// the site to follow the order of the file, so editors can simply move items.
import videos from './data/videos.json';
import gallery from './data/gallery.json';

const fileOrder = {
  videos: videos.map((v) => v.id),
  gallery: gallery.map((g) => g.id),
} as const;

export function inFileOrder<T extends { id: string }>(name: keyof typeof fileOrder, entries: T[]): T[] {
  const ids: readonly string[] = fileOrder[name];
  return [...entries].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
}
