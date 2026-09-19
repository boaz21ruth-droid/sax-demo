import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Translated text is stored as { "en": "…", "zh": "…" }. Adding a language
// means adding one more key, no schema change needed.
const localized = z.record(z.string(), z.string());

const profile = defineCollection({
  // One Markdown file per language: src/content/profile/en.md, zh.md, …
  loader: glob({ pattern: '*.md', base: './src/content/profile' }),
  schema: ({ image }) =>
    z.object({
      role: z.string(),
      tagline: z.string(),
      basedIn: z.string(),
      description: z.string(),
      portrait: image(),
      portraitAlt: z.string(),
      education: z.array(z.object({ years: z.coerce.string(), title: z.string(), place: z.string() })),
      awards: z.array(z.object({ year: z.coerce.string(), title: z.string() })),
    }),
});

const gear = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/gear' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      voice: localized,
      model: z.string(),
      finish: localized,
      note: localized,
      setup: z.array(z.object({ label: localized, value: z.string() })),
      image: image(),
    }),
});

const videos = defineCollection({
  loader: file('./src/content/data/videos.json'),
  schema: ({ image }) =>
    z.object({
      youtubeId: z.string(),
      title: localized,
      venue: localized,
      poster: image().optional(),
    }),
});

const gallery = defineCollection({
  loader: file('./src/content/data/gallery.json'),
  schema: ({ image }) => z.object({ image: image(), alt: localized }),
});

const albums = defineCollection({
  loader: file('./src/content/data/albums.json'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number(),
      format: localized,
      note: localized,
      cover: image(),
      link: z.string().url().optional(),
    }),
});

const events = defineCollection({
  loader: file('./src/content/data/events.json'),
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().optional(),
    title: localized,
    venue: z.string(),
    city: localized,
    entry: z.enum(['tickets', 'free', 'private']),
    link: z.string().url().optional(),
  }),
});

export const collections = { profile, gear, videos, gallery, albums, events };
