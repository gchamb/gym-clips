import { ENV } from "./types";

const getSanitzedConfig = (): NonNullable<ENV> => {
  const env: ENV = {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.EXPO_PUBLIC_API_URL,
  };

  console.log(env);

  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }

  return env as NonNullable<ENV>;
};

const sanitizedConfig = getSanitzedConfig();

export default sanitizedConfig;
