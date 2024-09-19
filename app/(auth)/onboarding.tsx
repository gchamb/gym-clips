import PictureCapture from "@/components/picture-capture";
import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import EgoistView from "@/components/ui/egoist-view";
import sanitizedConfig from "@/config";
import * as Sentry from "@sentry/react-native";

import { ImagePickerAsset } from "expo-image-picker";
import { authAtom } from "@/stores/auth";
import { Href, router } from "expo-router";
import { useAtom } from "jotai/react";
import { useState } from "react";
import { Text, View } from "react-native";
import { AuthTokens } from "@/types";
import { getAndUploadImage, weights } from "@/lib/helpers";

export default function Onboarding() {
  const [goalWeight, setGoalWeight] = useState<number>();
  const [currentWeight, setCurrentWeight] = useState<number>();
  const [progressImage, setProgressImage] = useState<ImagePickerAsset | null>(
    null
  );
  const [authTokens, setAuthTokens] = useAtom(authAtom);
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

      const { key } = await getAndUploadImage(progressImage, authTokens);

      // onboard the user
      const onboardedRes = await fetch(
        `${sanitizedConfig.API_URL}/api/v1/user/onboard`,
        {
          method: "PATCH",
          body: JSON.stringify({
            current_weight: currentWeight,
            goal_weight: goalWeight,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            key,
          }),
          headers: {
            Authorization: `Bearer ${authTokens?.jwt_token}`,
          },
        }
      );

      if (!onboardedRes.ok) {
        throw new Error("Unable to onboard user. Try Again.");
      }

      const configuredTokens: AuthTokens = {
        ...authTokens!,
        is_onboarded: true,
      };

      setAuthTokens(configuredTokens);

      // direct to the home screen
      router.replace("/paywall?nextScreen=home" as Href<string>);
    } catch (err) {
      Sentry.captureException(err);
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
