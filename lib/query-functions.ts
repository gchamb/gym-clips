import sanitizedConfig from "@/config";
import { AuthTokens, ProgressEntry, ProgressVideo } from "@/types";

function wait(seconds: number) {
  return new Promise((res, rej) => {
    const ts = setTimeout(() => {
      res(null);
    }, seconds * 1000);
  });
}

export default async function getAssets(tokens: AuthTokens): Promise<{
  entries: ProgressEntry[];
  videos: ProgressVideo[];
}> {
  const getAssetsResponse = await fetch(
    `${sanitizedConfig.API_URL}/api/v1/assets?type=progress-entry,progress-video&frequency=monthly&take=5`,
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

  await wait(5);
  const data = (await getAssetsResponse.json()) as {
    entries: ProgressEntry[];
    videos: ProgressVideo[];
  };

  return data;
}
