import { z } from 'zod';

export const createProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  location: z.string().max(255).optional(),
  company: z.string().max(255).optional(),
  jobTitle: z.string().max(255).optional(),
  avatar: z.string().url().optional(),
  banner: z.string().url().optional(),
  isPublic: z.boolean().optional().default(true),
  socialProfiles: z
    .array(
      z.object({
        platform: z.string().max(100),
        url: z.string().url().optional(),
        username: z.string().max(255).optional(),
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string().max(255),
        category: z.string().max(100).optional(),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        title: z.string().max(255),
        description: z.string().optional(),
        url: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
      })
    )
    .optional(),
});

export const updateProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  location: z.string().max(255).optional(),
  company: z.string().max(255).optional(),
  jobTitle: z.string().max(255).optional(),
  avatar: z.string().url().optional(),
  banner: z.string().url().optional(),
  isPublic: z.boolean().optional(),
  socialProfiles: z
    .array(
      z.object({
        platform: z.string().max(100),
        url: z.string().url().optional(),
        username: z.string().max(255).optional(),
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string().max(255),
        category: z.string().max(100).optional(),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        title: z.string().max(255),
        description: z.string().optional(),
        url: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
      })
    )
    .optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
