import * as ExpoImagePicker from "expo-image-picker";
import * as Sentry from "@sentry/react-native";

import Button from "./ui/button";
import { useState } from "react";
import { View, Image, Pressable, Dimensions } from "react-native";
import { router } from "expo-router";
import { Skeleton } from "@rneui/themed";

// ik ik just makes it easier for my brain
function Cross() {
  return (
    <View className="relative w-full h-full flex items-center justify-center">
      <View className="w-10 bg-egoist-black h-5/6"></View>
      <View className="absolute w-full bg-egoist-black h-10"></View>
    </View>
  );
}

export default function PictureCapture(props: {
  liftImage?: (image: ExpoImagePicker.ImagePickerAsset) => void;
  default?: string;
  openDailyEntry?: boolean;
  showOnlySkeleton?: boolean;
}) {
  const [selectedAsset, setSelectedAsset] =
    useState<ExpoImagePicker.ImagePickerAsset | null>(null);
  
  const width = Dimensions.get("screen").width

  const pickImage = async () => {
    if (props?.openDailyEntry) {
      router.push("/daily-entry");
      return;
    }

    try {
      const cameraPermissions =
        await ExpoImagePicker.requestCameraPermissionsAsync();

      if (!cameraPermissions.granted) {
        return;
      }

      const result = await ExpoImagePicker.launchCameraAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
      });

      if (result.canceled || result.assets.length < 1) {
        return;
      }

      setSelectedAsset(result.assets[0]);

      props.liftImage?.(result.assets[0]);
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  if (props.showOnlySkeleton) {
    return (
      <Skeleton
        height="100%"
        width={200}
        animation="pulse"
        style={{ borderRadius: 15 }}
      />
    );
  }

  return (
    <>
      {selectedAsset === null && props.default === undefined ? (
        <View className={`border-4 border-white h-full ${width <= 375 ? 'max-h-[250px] w-[200px]' : 'max-h-[300px] w-[200px]'}  mx-auto rounded-xl`}>
          <View className="w-full h-full relative flex">
            <View className="absolute w-full h-full z-[10]">
              <Cross />
            </View>
            <View className="w-3/4 mx-auto border-8 h-4/5 my-auto border-egoist-red rounded-xl" />
            <View className="w-full h-full absolute z-[30] flex justify-center items-center">
              <Pressable onPress={pickImage}>
                <Image
                  className="z-[30] w-[50px] h-[50px]"
                  source={require("@/assets/images/camera.png")}
                />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View className="max-h-[300px] w-[200px] mx-auto space-y-2">
          <View className="h-full max-h-[300px] w-[200px] mx-auto ">
            <Image
              className="w-full h-full object-cover rounded-xl"
              source={{ uri: props.default ?? selectedAsset?.uri }}
            />
          </View>
          {props.default === undefined && (
            <Button
              className="bg-transparent p-0"
              textClass="text-lg"
              text="Try Again"
              onPress={pickImage}
            />
          )}
        </View>
      )}
    </>
  );
}
