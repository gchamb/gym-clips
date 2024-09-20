import Button from "@/components/ui/button";
import EgoistView from "@/components/ui/egoist-view";
import { authAtom } from "@/stores/auth";
import { Redirect, router } from "expo-router";
import { useAtomValue } from "jotai/react";
import { useEffect } from "react";
import { View, Image, Text, Dimensions } from "react-native";
import { trackEvent } from "@aptabase/react-native";

export default function LandingPage() {
  const authTokens = useAtomValue(authAtom);

  useEffect(() => {
    trackEvent("app_open");
  }, []);

  if (authTokens?.is_onboarded) {
    return <Redirect href="/(tabs)/home" />;
  }
  if (authTokens?.is_onboarded === false) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return (
    <EgoistView className="justify-center space-y-8">
      <View className="mt-20 w-[200px] rounded-2xl h-[200px] mx-auto  justify-center items-center">
        <Image
          source={require("@/assets/images/egoist-logo.png")}
          width={200}
          height={200}
        />
      </View>

      <View className="mx-auto">
        <Text className="text-white text-center z-[20] text-5xl font-bold">
          THE ONLY PLACE TO GO FROM
          <Text className="text-egoist-red"> FAILURE IS TO WIN.</Text>
        </Text>
      </View>
      <View className="flex-1 mb-20 w-11/12 h-4/5 mx-auto justify-end">
        <Button text="Start Journey" onPress={() => router.push("/signin")} />
      </View>
    </EgoistView>
  );
}
