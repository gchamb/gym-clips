import { z } from "zod";
import {
  authFormSchema,
  progressEntrySchema,
  progressVideoSchema,
} from "./schemas";

export type ENV = {
  NODE_ENV: string | undefined;
  API_URL: string | undefined;
};

export type AuthTokens = {
  refresh_token: string;
  jwt_token: string;
  is_onboarded: boolean;
} | null;

export type AuthSchema = z.infer<typeof authFormSchema>;

export type ProgressEntry = z.infer<typeof progressEntrySchema>;

export type ProgressVideo = z.infer<typeof progressVideoSchema>;
