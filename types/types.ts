import { z } from "zod";
import {
  authFormSchema,
  progressEntrySchema,
  progressVideoSchema,
} from "./schemas";

export type ENV = {
  NODE_ENV: string | undefined;
  API_URL: string | undefined;
  REVENUE_CAT_KEY: string | undefined;
};

export type SantizedENV = {
  NODE_ENV: string;
  API_URL: string;
  REVENUE_CAT_KEY: string;
};

export type AuthTokens = {
  refresh_token: string;
  jwt_token: string;
  is_onboarded: boolean;
  uid: string;
} | null;

export type UserData = {
  currentWeight: number;
  goalWeight: number;
} | null;

export type AuthSchema = z.infer<typeof authFormSchema>;

export type ProgressEntry = z.infer<typeof progressEntrySchema>;

export type ProgressVideo = z.infer<typeof progressVideoSchema>;

export const planSkus = [
  "egoist_3999_1y_lockedin",
  "egoist_499_1m_lockedin",
] as const;

export type PlanSkus = (typeof planSkus)[number];

export const skusTiers: { [key: string]: string } = {
  egoist_3999_1y_lockedin: "Annual: Locked In Tier",
  egoist_499_1m_lockedin: "Monthly: Locked In Tier",
};
