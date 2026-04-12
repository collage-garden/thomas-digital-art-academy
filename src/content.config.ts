import { defineCollection, z } from 'astro:content';

const scenes = ['everyday-life', 'social-observation', 'auditory-art', 'visual-art', 'interactive-installation', 'traditional-art'] as const;
const disciplines = ['physics', 'mathematics', 'economics', 'philosophy', 'psychology', 'physiology', 'neuroscience'] as const;

const stories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().default('Thomas'),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    scenes: z.array(z.enum(scenes)).default([]),
    disciplines: z.array(z.enum(disciplines)).default([]),
    tags: z.array(z.string()).default([]),
    aiCoCreated: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const knowledge = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    discipline: z.enum(disciplines),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    aiCoCreated: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const works = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().default('Thomas'),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    scenes: z.array(z.enum(scenes)).default([]),
    disciplines: z.array(z.enum(disciplines)).default([]),
    storyRef: z.string().optional(),
    tags: z.array(z.string()).default([]),
    aiCoCreated: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const courses = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    scenes: z.array(z.enum(scenes)).default([]),
    disciplines: z.array(z.enum(disciplines)).default([]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    aiCoCreated: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { stories, knowledge, works, courses };
