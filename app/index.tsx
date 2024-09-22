import Button from "@/components/ui/button";
import EgoistView from "@/components/ui/egoist-view";
import { authAtom } from "@/stores/auth";
import { Redirect, router } from "expo-router";
import { useAtomValue } from "jotai/react";
import { useEffect } from "react";
import { View, Image, Text, Dimensions } from "react-native";
import { trackEvent } from "@aptabase/react-native";
import DontSupport from "@/components/dont-support";

export default function LandingPage() {
  const authTokens = useAtomValue(authAtom);
  const width = Dimensions.get("screen").width
  const height = Dimensions.get("screen").height;

  useEffect(() => {
    trackEvent("app_open");
  }, []);

  if (authTokens?.is_onboarded) {
    return <Redirect href="/(tabs)/home" />;
  }
  if (authTokens?.is_onboarded === false) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (height < 800){
    return <DontSupport />
  }

 

  return (
    <EgoistView className="justify-center space-y-8">
      <View className={`mt-20 w-[200px] h-[200px] rounded-2xl  mx-auto justify-center items-center`}>
        <Image
          source={require("@/assets/images/egoist-logo.png")}
          className="w-full h-full"
        />
      </View>

      <View className="w-11/12 mx-auto">
        <Text className="text-white text-center z-[20] text-5xl font-bold">
          THE ONLY PLACE TO GO FROM
          <Text className="text-egoist-red"> FAILURE IS TO WIN.</Text>
        </Text>
      </View>
      <View className="flex-1 mb-4 w-11/12 h-4/5 mx-auto justify-end">
        <Button text="Start Journey" onPress={() => router.push("/signin")} />
      </View>
    </EgoistView>
  );
}
