import { z } from "zod";
import { authFormSchema } from "./schemas";

export type ENV = {
  NODE_ENV: string | undefined;
  API_URL: string | undefined;
};

export type AuthTokens = {
  refresh_token: string;
  jwt_token: string;
} | null;

export type AuthSchema = z.infer<typeof authFormSchema>;
