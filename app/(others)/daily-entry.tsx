import PictureCapture from "@/components/picture-capture";
import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import EgoistView from "@/components/ui/egoist-view";
import PlaceholderAd from "@/components/ui/placeholder-ad";
import sanitizedConfig from "@/config";
import { ImagePickerAsset } from "expo-image-picker";
import { getAndUploadImage, Months, weights } from "@/lib/helpers";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useAtomValue } from "jotai/react";
import { authAtom } from "@/stores/auth";

const date = new Date();

export default function DailyEntry() {
  const [currentWeight, setCurrentWeight] = useState<number>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const authTokens = useAtomValue(authAtom);

  const month = Months[date.getMonth()];

  const addEntry = async () => {
    if (currentWeight === undefined) {
      setError("Must select a current weight.");
      return;
    }

    if (image === null) {
      setError("Must take a progress picture.");
      return;
    }

    if (error !== "") {
      setError("");
    }

    setLoading(true);
    try {
      const { key } = await getAndUploadImage(image, authTokens);

      const addEntryRes = await fetch(
        `${sanitizedConfig.API_URL}/api/v1/entry`,
        {
          method: "PUT",
          body: JSON.stringify({
            azureBlobKey: key,
            currentWeight,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }),
        }
      );

      if (!addEntryRes.ok) {
        setError("Unable to add entry. Try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to add entry. Try Again."
      );
    }
  };

  return (
    <EgoistView>
      <View className="w-11/12 mx-auto space-y-8">
        <View className="space-y-2">
          <Text className="text-egoist-white text-2xl text-center font-semibold">
            Daily Entry
          </Text>
          <Text className="text-md text-center text-egoist-red">
            {month} {date.getDate()}, {date.getFullYear()}
          </Text>
        </View>
        <View />
        <PictureCapture liftImage={(image) => setImage(image)} />
        <View className="space-y-4">
          <Text className="text-white text-xl font-semibold">
            Current Weight
          </Text>
          <View className="z-[30]">
            <Dropdown
              items={weights}
              placeholder="Weight"
              onValueChanged={(value) => {
                if (!value?.value) {
                  return;
                }
                const weight = value.value.split(" ")[0];

                if (isNaN(parseInt(weight))) {
                  return;
                }

                setCurrentWeight(parseInt(weight));
              }}
            />
          </View>
          <Button
            className="p-4"
            text="Submit"
            onPress={addEntry}
            disabled={loading}
            isLoading={loading}
          />
          <Button
            className="p-4"
            text="Cancel"
            disabled={loading}
            onPress={() => router.dismiss()}
          />
        </View>
      </View>

      <PlaceholderAd />
    </EgoistView>
  );
}
