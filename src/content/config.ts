import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    hero: z.string().optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    menu: z.object({
      sidebar: z.object({
        name: z.string(),
        identifier: z.string(),
        parent: z.string().optional(),
        weight: z.number().optional(),
      }).optional(),
    }).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
