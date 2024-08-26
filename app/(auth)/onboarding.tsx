import PictureCapture from "@/components/picture-capture";
import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import EgoistView from "@/components/ui/egoist-view";
import sanitizedConfig from "@/config";
import * as ExpoImagePicker from "expo-image-picker";
import { authAtom } from "@/stores/auth";
import { router } from "expo-router";
import { useAtomValue } from "jotai/react";
import { useState } from "react";
import { Text, View } from "react-native";

const weights = Array.from({ length: 431 }, (_, i) => `${i + 70} lbs`);

export default function Onboarding() {
  const [goalWeight, setGoalWeight] = useState<number>();
  const [currentWeight, setCurrentWeight] = useState<number>();
  const [progressImage, setProgressImage] =
    useState<ExpoImagePicker.ImagePickerAsset | null>(null);
  const authTokens = useAtomValue(authAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const completeOnboarding = async () => {
    if (
      progressImage === null ||
      currentWeight === undefined ||
      goalWeight === undefined
    ) {
      setError("You must fill out all the details");
      return;
    }
    if (error !== "") {
      setError("");
    }

    try {
      setLoading(true);

      // request for sas url
      const sasResponse = await fetch(
        `${sanitizedConfig.API_URL}/api/v1/azure/upload?mimetype=${progressImage.mimeType}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.jwt_token}`,
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

      // upload image
      const imageFetch = await fetch(progressImage.uri);
      const image = await imageFetch.blob();

      const sasUploadRes = await fetch(sasData.url, {
        method: "PUT",
        body: image,
        headers: {
          "x-ms-blob-type": "BlockBlob",
        },
      });

      if (!sasUploadRes.ok) {
        throw new Error("Unable to upload image. Try Again.");
      }

      // onboard the user
      const onboardedRes = await fetch(
        `${sanitizedConfig.API_URL}/api/v1/user/onboard`,
        {
          method: "PATCH",
          body: JSON.stringify({
            key: sasData.key,
            current_weight: currentWeight,
            goal_weight: goalWeight,
          }),
          headers: {
            Authorization: `Bearer ${authTokens?.jwt_token}`,
          },
        }
      );

      if (!onboardedRes.ok) {
        throw new Error("Unable to onboard user. Try Again.");
      }
      // direct to the home screen
      router.replace("/(tabs)/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <EgoistView>
      <View className="w-11/12 mx-auto space-y-12">
        <Text className="text-white text-lg font-semibold text-center pb-4">
          Take Progress Picture
        </Text>

        <PictureCapture liftImage={(image) => setProgressImage(image)} />

        <View className="space-y-8">
          <View className="space-y-4">
            <Text className="text-xl font-semibold text-egoist-white">
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
          </View>

          <View className="space-y-4">
            <Text className="text-xl font-semibold text-egoist-white">
              Goal Weight
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

                  setGoalWeight(parseInt(weight));
                }}
              />
            </View>
          </View>

          <Button
            className="p-6"
            text="Start"
            onPress={completeOnboarding}
            disabled={loading}
            isLoading={loading}
          />
          {error !== "" && (
            <Text className="text-sm text-red-700 text-center">{error}</Text>
          )}
        </View>
      </View>
    </EgoistView>
  );
}
