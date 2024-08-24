import PictureCapture from "@/components/picture-capture";
import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import EgoistView from "@/components/ui/egoist-view";
import * as ExpoImagePicker from "expo-image-picker";
import { useState } from "react";
import { Text, View } from "react-native";

const weights = Array.from({ length: 431 }, (_, i) => `${i + 70} lbs`);

export default function Onboarding() {
  const [goalWeight, setGoalWeight] = useState<number>();
  const [currentWeight, setCurrentWeight] = useState<number>();
  const [progressImage, setProgressImage] =
    useState<ExpoImagePicker.ImagePickerAsset | null>(null);

  const completeOnboarding = () => {
    if (progressImage === null) {
      // toast the error
      return;
    }

    try {
    } catch (err) {}
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

          <Button className="p-6" text="Start" />
        </View>
      </View>
    </EgoistView>
  );
}
