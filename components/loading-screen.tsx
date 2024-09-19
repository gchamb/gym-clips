import EgoistView from "./ui/egoist-view";
import { View, ActivityIndicator, Image, Text } from "react-native";

export default function LoadingScreen() {
  return (
    <EgoistView>
      <View className="flex-1 items-center justify-center space-y-8">
        <Image
          source={require("@/assets/images/egoist-logo.png")}
          className="w-[150px] h-[150px]"
        />
        <Text className="text-white text-xl font-semibold">
          Loading Assets..
        </Text>
        <ActivityIndicator size="large" />
      </View>
    </EgoistView>
  );
}
