import sanitizedConfig from "@/config";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ImagePickerAsset } from "expo-image-picker";
import { AuthTokens } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function properCase(name: string) {
  const firstChar = name.charAt(0).toUpperCase();
  return firstChar + name.substring(1, name.length).toLowerCase();
}

export const Months = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const weights = Array.from({ length: 431 }, (_, i) => `${i + 70} lbs`);

export async function getAndUploadImage(
  image: ImagePickerAsset,
  tokens: AuthTokens
) {
  // request for sas url
  const awsResponse = await fetch(
    `${sanitizedConfig.API_URL}/api/v1/aws/upload?mimetype=${image.mimeType}`,
    {
      headers: {
        Authorization: `Bearer ${tokens?.jwt_token}`,
      },
    }
  );

  if (!awsResponse.ok) {
    // throw some error
    throw new Error("Unable to upload image. Try Again.");
  }
  const awsData = (await awsResponse.json()) as {
    key: string;
    url: string;
    headers: Record<string, string>;
  };

  const imageFetch = await fetch(image.uri);
  const imageBlob = await imageFetch.blob();

  const awsUploadRes = await fetch(awsData.url, {
    method: "PUT",
    body: imageBlob,
    headers: {
      ...awsData.headers,
    },
  });

  if (!awsUploadRes.ok) {
    throw new Error("Unable to upload image. Try Again.");
  }

  return awsData;
}

export function formatDate(date: string) {
  // YYYY-MM-DD
  const splitDate = date.split("T")[0].split("-");

  const month = Months[parseInt(splitDate[1]) - 1];

  return `${month} ${splitDate[2]}, ${splitDate[0]}`;
}

export function wait(seconds: number) {
  return new Promise((res, rej) => {
    const ts = setTimeout(() => {
      res(null);
    }, seconds * 1000);
  });
}
