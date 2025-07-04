import { z } from 'zod';

const articleImage = z.object({
  alt_text: z.string(),
  article_id: z.string(),
  id: z.number().optional(),
  name: z.string()
});
const articleExposure = z.object({
  article_id: z.string(),
  count: z.number(),
  date: z.coerce.date(),
  exposure_time_s: z.number(),
  id: z.number().optional(),
  type: z.string()
});

export const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  content_md: z.string(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  images: z.array(articleImage),
  exposures: z.array(articleExposure),
  equipment: z.array(z.number())
});
