import { z } from "zod";

export const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7, {
    message: "Password must be at least 7 characters",
  }),
});

export const progressEntrySchema = z.object({
  id: z.string().uuid(),
  blobKey: z.string(),
  currentWeight: z.number(),
  createdAt: z.string(),
});

export const progressVideoSchema = z.object({
  id: z.string().uuid(),
  blobKey: z.string(),
  frequency: z.union([z.literal("monthly"), z.literal("weekly")]),
  createdAt: z.string(),
});
