import Button from "@/components/ui/button";
import EgoistView from "@/components/ui/egoist-view";
import { authAtom } from "@/stores/auth";
import { Redirect, router } from "expo-router";
import { useAtomValue } from "jotai/react";
import { View, Image } from "react-native";

export default function LandingPage() {
  const authTokens = useAtomValue(authAtom);

  console.log(authTokens?.jwt_token);

  if (authTokens?.is_onboarded) {
    return <Redirect href="/(tabs)/home" />;
  }
  if (authTokens?.is_onboarded === false) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return (
    <EgoistView className="justify-center">
      <View className="mt-20 w-[200px] rounded-2xl h-[200px] mx-auto  justify-center items-center">
        <Image
          source={require("@/assets/images/egoist-logo.png")}
          width={200}
          height={200}
        />
      </View>
      <View className="flex-1 mb-20 w-11/12 h-4/5 mx-auto justify-end">
        <Button text="Start Journey" onPress={() => router.push("/signin")} />
      </View>
    </EgoistView>
  );
}
