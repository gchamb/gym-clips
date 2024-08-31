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
  const sasResponse = await fetch(
    `${sanitizedConfig.API_URL}/api/v1/azure/upload?mimetype=${image.mimeType}`,
    {
      headers: {
        Authorization: `Bearer ${tokens?.jwt_token}`,
      },
    }
  );

  if (!sasResponse.ok) {
    // throw some error
    throw new Error("Unable to upload image. Try Again.");
  }
  const sasData = (await sasResponse.json()) as {
    key: string;
    url: string;
  };

  const imageFetch = await fetch(image.uri);
  const imageBlob = await imageFetch.blob();

  const sasUploadRes = await fetch(sasData.url, {
    method: "PUT",
    body: imageBlob,
    headers: {
      "x-ms-blob-type": "BlockBlob",
    },
  });

  if (!sasUploadRes.ok) {
    throw new Error("Unable to upload image. Try Again.");
  }

  return sasData;
}

export function formatDate(date: string) {
  // YYYY-MM-DD
  const splitDate = date.split("T")[0].split("-");

  const month = Months[parseInt(splitDate[1]) - 1];

  return `${month} ${splitDate[2]}, ${splitDate[0]}`;
}
