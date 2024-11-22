import React from "react";
import { View, Pressable, Image } from "react-native";

// ik ik just makes it easier for my brain
function Cross() {
  return (
    <View className="relative w-full h-full flex items-center justify-center">
      <View className="w-10 bg-egoist-black h-5/6"></View>
      <View className="absolute w-full bg-egoist-black h-10"></View>
    </View>
  );
}

export default function PictureCaptureUI({
  pickImage,
}: {
  pickImage?: () => void;
}) {
  return (
    <View className="border-4 border-white h-full max-h-[300px] w-[200px] mx-auto rounded-xl">
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
  );
}
