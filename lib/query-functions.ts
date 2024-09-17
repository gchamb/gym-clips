import sanitizedConfig from "@/config";
import { AuthTokens, ProgressEntry, ProgressVideo, UserData } from "@/types";

export async function getAssets(
  tokens: AuthTokens,
  opts = {
    type: ["progress-entry", "progress-video"],
    frequency: "monthly",
    take: 5,
    page: 1,
  }
): Promise<{
  entries: ProgressEntry[];
  videos: ProgressVideo[];
}> {
  const getAssetsResponse = await fetch(
    `${sanitizedConfig.API_URL}/api/v1/assets?type=${opts.type.join(
      ","
    )}&frequency=${opts.frequency}&take=${opts.take}&page=${opts.page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens?.jwt_token}`,
      },
    }
  );

  if (!getAssetsResponse.ok) {
    throw new Error("Unable to fetch assets.");
  }

  const data = (await getAssetsResponse.json()) as {
    entries: ProgressEntry[];
    videos: ProgressVideo[];
  };

  return data;
}

export async function getUserData(tokens: AuthTokens) {
  const getUserResponse = await fetch(
    `${sanitizedConfig.API_URL}/api/v1/user`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens?.jwt_token}`,
      },
    }
  );

  if (!getUserResponse.ok) {
    throw new Error("Unable to fetch user data.");
  }

  const data = (await getUserResponse.json()) as UserData;

  return data;
}
