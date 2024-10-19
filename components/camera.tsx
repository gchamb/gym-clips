import EgoistView from "./ui/egoist-view";
import Button from "./ui/button";
import LoadingScreen from "./loading-screen";

import {
  CameraView,
  CameraType,
  CameraCapturedPicture,
  useCameraPermissions,
  PermissionStatus,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  Text,
  Image,
  Linking,
  Modal,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { captureException } from "@sentry/react-native";

export default function EgoistCamera(props: {
  onClose: () => void;
  liftImage: (imageUri: CameraCapturedPicture) => void;
  presentation: "modal" | "screen";
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [timer, setTimer] = useState<number | null>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const [isReady, setIsReady] = useState(false);
  const [image, setImage] = useState<CameraCapturedPicture | null>(null);
  const [startCountdown, setStartCountdown] = useState<{
    start: boolean;
    timer: number | null;
  }>({ start: false, timer: null });
  console.log("camera is ready");
  const camera = useRef<CameraView | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    if (
      timeout === undefined &&
      startCountdown.timer !== null &&
      startCountdown.start &&
      startCountdown.timer >= 0
    ) {
      timeout = setTimeout(async () => {
        if (startCountdown.timer === 0) {
          try {
            const picture = await camera.current?.takePictureAsync();

            if (picture === undefined) return;

            setImage(picture);
            setStartCountdown({ start: false, timer: null });
            return;
          } catch (err) {
            captureException(err);
          }
        }

        setStartCountdown((prev) => {
          if (prev.timer === null) return prev;
          return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [startCountdown]);

  const acceptPermissions = async () => {
    if (permission === null) return;

    try {
      if (permission.status === PermissionStatus.UNDETERMINED) {
        await requestPermission();
      } else if (permission.canAskAgain && !permission.granted) {
        await requestPermission();
      } else if (!permission.canAskAgain && !permission.granted) {
        // redirect to settings page
        await Linking.openURL("app-settings:");
      }
    } catch (err) {
      captureException(err);
    }
  };
  console.log(permission);
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleCameraFlash = () => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  };

  const toggleTimer = () => {
    setTimer((prev) => {
      if (prev === null) {
        return 3;
      }
      if (prev === 3) {
        return 5;
      }

      return null;
    });
  };

  const takePicture = async () => {
    if (!isReady || camera.current === null) return;

    try {
      if (timer === null) {
        const picture = await camera.current.takePictureAsync();

        if (picture === undefined) return;

        setImage(picture);
      } else {
        setStartCountdown({ start: true, timer });
      }
    } catch (err) {
      captureException(err);
    }
  };

  // permissions are loading
  if (permission === null) {
    return <LoadingScreen />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <Modal transparent animationType="fade" className="flex-1 h-4/5">
        <EgoistView>
          <View className="w-11/12 mx-auto my-auto">
            <View className="space-y-4">
              <View className="my-auto w-[125px] rounded-2xl h-[125px] mx-auto  justify-center items-center">
                <Image
                  source={require("@/assets/images/egoist-logo.png")}
                  className="w-full h-full"
                />
              </View>
              <View className="space-y-2">
                <Text className="text-white font-bold text-xl text-center">
                  Egoist needs access to your camera.
                </Text>
                <Text className="text-white text-center">
                  The app accesses your camera to let you take your progress
                  picture.
                </Text>
              </View>

              <Button
                onPress={acceptPermissions}
                className="p-4"
                text="Grant Permission"
              />
            </View>
          </View>
        </EgoistView>
      </Modal>
    );
  }

  if (image !== null) {
    return (
      <EgoistView>
        <View className="w-11/12 mx-auto space-y-4">
          <Image
            source={{ uri: image.uri }}
            className={`w-full ${
              props.presentation === "modal" ? "h-4/5" : "h-3/4"
            } rounded`}
          />

          <View className="flex space-y-4">
            <Button
              className="p-4"
              text="Try Again"
              onPress={() => {
                setImage(null);
                setStartCountdown({ start: false, timer: null });
              }}
            />
            <Button
              className="p-4"
              text="Save"
              onPress={() => {
                props.liftImage(image);
                props.onClose();
              }}
            />
          </View>
        </View>
      </EgoistView>
    );
  }

  return (
    <View className="flex-1">
      <SafeAreaView className="absolute top-0 left-0 right-0 bottom-0 z-[30] flex-1">
        <View
          className={`w-11/12 mx-auto flex  ${
            props.presentation === "modal"
              ? "flex flex-row justify-between"
              : "items-end mt-20"
          }`}
        >
          {props.presentation === "modal" && (
            <Pressable className="active:scale-95" onPress={props.onClose}>
              <Feather name="x" size={32} color="white" />
            </Pressable>
          )}

          <View className="flex space-y-8">
            <Pressable className="active:scale-95" onPress={toggleCameraFlash}>
              <MaterialIcons name={`flash-${flash}`} size={36} color="white" />
            </Pressable>

            <Pressable className="active:scale-95" onPress={toggleCameraFacing}>
              <MaterialIcons name="cameraswitch" size={36} color="white" />
            </Pressable>

            <Pressable
              className="relative active:scale-95"
              onPress={toggleTimer}
            >
              {timer === null ? (
                <MaterialIcons name="timer-off" size={36} color="white" />
              ) : (
                <View>
                  <MaterialIcons name="timer" size={36} color="white" />
                  <Text className="text-sm text-center text-egoist-red font-semibold">
                    {timer}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {startCountdown.timer !== null && startCountdown.start && (
          <View className="my-auto">
            <Text className="text-white text-4xl font-semibold text-center">
              {startCountdown.timer}
            </Text>
          </View>
        )}

        <View className="mt-auto mb-4 relative">
          <Pressable className="mx-auto ">
            <View className="w-[85px] h-[85px] border-4 border-white rounded-full flex items-center justify-center">
              <Pressable
                onPress={takePicture}
                className="w-[70px] h-[70px] bg-white rounded-full active:scale-95"
              />
            </View>
          </Pressable>

          {props.presentation === "screen" && (
            <Pressable
              className="absolute bg-egoist-black p-2 top-8 right-4 rounded-lg active:scale-95"
              onPress={props.onClose}
            >
              <Text className="text-white text-md">Close</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
      <CameraView
        className="flex-1"
        animateShutter
        flash={flash}
        ref={(ref) => (camera.current = ref)}
        mirror
        facing={facing}
        onCameraReady={() => setIsReady(true)}
        onMountError={(e) => captureException(e)}
      />
    </View>
  );
}
