import { View, Image, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import sanitizedConfig from "@/config";
import { useAtomValue } from "jotai/react";
import { authAtom } from "@/stores/auth";

export default function ProgressReport() {
  const tokens = useAtomValue(authAtom);
  return (
    <View className="flex-1 bg-egoist-black">
      <View className="w-11/12 mx-auto space-y-8">
        <View className="flex flex-row justify-between items-center mt-12">
          {/* logo */}
          <View>
            <Image
              className="w-[60px] h-[60px]"
              source={require("@/assets/images/egoist-logo.png")}
            />
          </View>
          {/* month of x or week  */}
          <Text className="text-2xl font-semibold text-egoist-white">
            Week of August 8th
          </Text>
        </View>

        <View className="relative">
          <Text className="text-7xl  pl-4 z-[20] text-egoist-white font-bold">
            THE JOURNEY IS BETTER THAN THE DESTINATION
          </Text>
          <Text className="absolute top-2 pl-4 text-7xl  text-egoist-red font-bold">
            THE JOURNEY IS BETTER THAN THE DESTINATION
          </Text>
        </View>

        <View className="space-y-8">
          <View>
            <Text className="text-center font-bold text-egoist-red text-xl">
              LAST WEEK
            </Text>
            <Text className="text-center font-bold text-egoist-white text-xl">
              232 LBS
            </Text>
          </View>
          <View>
            <Text className="text-center font-bold text-egoist-red text-xl">
              THIS WEEK
            </Text>
            <Text className="text-center font-bold text-egoist-white text-xl">
              232 LBS
            </Text>
          </View>

          <View className="ml-auto">
            <Pressable
              className="flex flex-row items-center space-x-4 active:scale-95"
              onPress={async () => {
                // send a request to show that you viewed
                // const setViewedForReport = await fetch(
                //   `${sanitizedConfig.API_URL}/api/v1/progress-report/view`,
                //   {
                //     method: "POST",
                //     headers: {
                //       Authorization: `Bearer ${tokens?.jwt_token}`,
                //     },
                //     body: JSON.stringify({ reportId: "", viewed: true }),
                //   }
                // );

                if (router.canDismiss()) {
                  router.dismiss();
                } else {
                  router.replace("/(tabs)/home");
                }
              }}
            >
              <Text className="text-white text-2xl font-bold">CONTINUE</Text>
              <Feather size={36} name="arrow-right" color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
