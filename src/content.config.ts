// src/content.config.ts
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders"; // <-- NEW: Import the glob loader

const essaysCollection = defineCollection({
  // NEW: Tell Astro exactly where to find the files
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/essays" }),
  schema: z.object({
    title: z.string().max(100, "Keep the title under 100 characters."),
    description: z
      .string()
      .max(250, "Keep the description brief for the index feed."),
    topic: z.enum(["psychology", "philosophy", "cs", "random"]),
    date: z.date(),
    draft: z.boolean().default(false),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    date: z.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  essays: essaysCollection,
  projects: projectsCollection,
};
