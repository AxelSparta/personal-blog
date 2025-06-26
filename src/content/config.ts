import { defineCollection, z } from "astro:content";

export const myCollections = {
    blogs: defineCollection({
        schema: z.object({
            title: z.string(),
            img: z.string(),
            readtime: z.number(),
            description: z.string(),
            author: z.string(),
            date: z.string(),
        }),
    }),
};


export const collections = {
  'blog': myCollections.blogs,
}