import sanitizedConfig from "@/config";
import {
  AuthTokens,
  ProgressEntry,
  ProgressReport,
  ProgressVideo,
} from "@/types";

function wait(seconds: number) {
  return new Promise((res, rej) => {
    const ts = setTimeout(() => {
      res(null);
    }, seconds * 1000);
  });
}

export async function getAssets(tokens: AuthTokens): Promise<{
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

  const data = (await getAssetsResponse.json()) as {
    entries: ProgressEntry[];
    videos: ProgressVideo[];
  };

  return data;
}

export async function getReport(tokens: AuthTokens): Promise<{
  report: ProgressReport;
}> {
  const getReportResponse = await fetch(
    `${sanitizedConfig.API_URL}/api/v1/progress-report/view`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens?.jwt_token}`,
      },
    }
  );

  if (!getReportResponse.ok) {
    throw new Error("Unable to fetch progress report.");
  }

  const data = (await getReportResponse.json()) as {
    report: ProgressReport;
  };

  return data;
}
