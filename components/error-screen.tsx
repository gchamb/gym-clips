import Button from "./ui/button";
import EgoistView from "./ui/egoist-view";
import { View, Image, Text } from "react-native";

export default function ErrorScreen({
  error,
  refetch,
}: {
  error: string;
  refetch: () => void;
}) {
  return (
    <EgoistView>
      <View className="flex-1 items-center justify-center space-y-8">
        <Image
          source={require("@/assets/images/egoist-logo.png")}
          className="w-[150px] h-[150px]"
        />
        <Text className="text-white text-xl font-semibold">{error}</Text>
        <Button className="p-4" text="Try Again" onPress={refetch} />
      </View>
    </EgoistView>
  );
}
