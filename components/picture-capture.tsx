import * as ExpoImagePicker from "expo-image-picker";
import * as Sentry from "@sentry/react-native";

import Button from "./ui/button";
import { View, Image, Pressable, Linking } from "react-native";
import { router } from "expo-router";
import { Skeleton } from "@rneui/themed";
import { useCameraPermissions } from "expo-camera";
import PictureCaptureUI from "./ui/picture-capture-ui";

export default function PictureCapture(props: {
  liftImage?: (image: ExpoImagePicker.ImagePickerAsset) => void;
  default?: string;
  openDailyEntry?: boolean;
  showOnlySkeleton?: boolean;
  openCamera?: () => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();

  const pickImage = async () => {
    if (props?.openDailyEntry) {
      router.push("/daily-entry");
      return;
    }

    if (permission === null) return;

    try {
      if (permission.canAskAgain) {
        const newPermission = await requestPermission();
        console.log(newPermission, "heere");
        if (!newPermission.granted) {
          return;
        }
      } else {
        // redirect to settings page
        await Linking.openURL("app-settings:");
        return;
      }

      // open camera or show camera
      props.openCamera?.();
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
      {props.default === undefined ? (
        <PictureCaptureUI pickImage={pickImage} />
      ) : (
        <View className="max-h-[300px] w-[200px] mx-auto space-y-2">
          <View className="h-full max-h-[300px] w-[200px] mx-auto ">
            <Image
              className="w-full h-full object-cover rounded-xl"
              source={{ uri: props.default ?? "" }}
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
