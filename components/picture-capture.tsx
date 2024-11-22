import * as ExpoImagePicker from "expo-image-picker";

import Button from "./ui/button";
import { View, Image, Linking, AppState } from "react-native";
import { router } from "expo-router";
import { Skeleton } from "@rneui/themed";
import { focusManager } from "@tanstack/react-query";
import PictureCaptureUI from "./ui/picture-capture-ui";
import { useEffect } from "react";

export default function PictureCapture(props: {
  liftImage?: (image: ExpoImagePicker.ImagePickerAsset) => void;
  default?: string;
  openDailyEntry?: boolean;
  showOnlySkeleton?: boolean;
  openCamera?: () => void;
}) {
  const pickImage = async () => {
    if (props?.openDailyEntry) {
      router.push("/daily-entry");
      return;
    }
    // open camera or show camera
    props.openCamera?.();
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) =>
      focusManager.setFocused(status === "active")
    );

    return () => subscription.remove();
  }, []);

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
      {props.default === undefined ? (
        <PictureCaptureUI pickImage={pickImage} />
      ) : (
        <View className="max-h-[300px] w-[200px] mx-auto space-y-2">
          <View className="h-full max-h-[300px] w-[200px] mx-auto ">
            <Image
              className="w-full h-full object-cover rounded-xl"
              source={{
                uri: focusManager.isFocused() && props.default ? props.default : undefined,
              }}
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
