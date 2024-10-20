import EgoistView from "@/components/ui/egoist-view";
import React from "react";
import SignIn from "@/components/sign-in";
import DontSupport from "@/components/dont-support";

import { authAtom } from "@/stores/auth";
import { Redirect, router } from "expo-router";
import { useAtomValue } from "jotai/react";
import { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  Dimensions,
  Animated,
  FlatList,
} from "react-native";
import { trackEvent } from "@aptabase/react-native";
import PictureCaptureUI from "@/components/ui/picture-capture-ui";
import { SlidingDot } from "react-native-animated-pagination-dots";


const introduction = [
  {
    key: "1",
    title: "Daily Progress Entry",
    subheading: "Hold yourself accountable by taking daily progress pictures",
    caption:
      "You will be able to enter your current weight to watch your progress over time.",
  },
  {
    key: "2",
    title: "Progress Videos",
    subheading:
      "Watch your body transform with weekly or monthly progress videos based on your daily progress pictures.",
    image: require(`@/assets/images/fat-to-skinny.png`),
  },
  {
    key: "3",
    render: <SignIn />,
  },
];

export default function LandingPage() {
  const authTokens = useAtomValue(authAtom);
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;

  const scrollX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    trackEvent("app_open");
  }, []);

  if (authTokens) {
    return <Redirect href="/(tabs)/home" />;
  }
  // if (authTokens?.is_onboarded === false) {
  //   return <Redirect href="/(auth)/onboarding" />;
  // }

  if (height < 800){
    return <DontSupport />
  }

  return (
    <EgoistView className="">
      <FlatList
        data={introduction}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        pagingEnabled
        horizontal
        decelerationRate={"normal"}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (item.render) {
            return <View style={{ width }}>{item.render}</View>;
          }

          return (
            <View style={{ width: width }} className="h-4/5 space-y-8">
              <View className="mt-10 mb-4">
                <View className="w-[75px] rounded-2xl h-[75px] mx-auto  justify-center items-center">
                  <Image
                    source={require("@/assets/images/egoist-logo.png")}
                    className="w-full h-full"
                  />
                </View>
                <View className="space-y-4">
                  <Text className="text-white text-xl text-center font-semibold ">
                    {item.title}
                  </Text>
                  <Text className="text-white text-md text-center max-w-[250px] mx-auto">
                    {item.subheading}
                  </Text>
                </View>
              </View>

              {index === 0 && <PictureCaptureUI />}
              {item.image && (
                <View className="h-2/3">
                  <Image
                    className="w-full h-full mx-auto object-cover"
                    source={item.image}
                  />
                </View>
              )}

              <View>
                <Text className="text-white text-md text-center max-w-[250px] mx-auto">
                  {item.caption}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <SlidingDot
        marginHorizontal={3}
        slidingIndicatorStyle={{ backgroundColor: "white" }}
        data={introduction}
        scrollX={scrollX}
        dotSize={10}
      />
    </EgoistView>
  );
}
