import { ENV, SantizedENV } from "./types";

const getSanitzedConfig = (): SantizedENV => {
  const env: ENV = {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.EXPO_PUBLIC_API_URL,
    REVENUE_CAT_KEY: process.env.EXPO_PUBLIC_REVENUE_CAT_KEY,
  };

  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }

  return env as SantizedENV;
};

const sanitizedConfig = getSanitzedConfig();

export default sanitizedConfig;
