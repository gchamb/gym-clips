import EgoistView from "@/components/ui/egoist-view";
import { Feather } from "@expo/vector-icons";
import { View, Text, Image } from "react-native";

export default function Howto() {
  return (
    <EgoistView>
      <View className="w-11/12 mx-auto">
        {/* Heading */}
        <View>
          <View className="w-16 h-16 mx-auto">
            <Image
              source={require("@/assets/images/egoist-logo.png")}
              className="w-full h-full"
            />
          </View>
          <Text className="text-white text-3xl text-center font-semibold">
            How to Submit An Progress Picture Entry?
          </Text>
        </View>

        {/* Step by Step Guide */}
        <View className="mt-4 space-y-8">
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-egoist-red text-2xl font-bold">1.</Text>
            <Text className="text-white text-xl">Click on the</Text>
            <Feather
              name="camera"
              color="red"
              size={20}
              accessibilityHint="camera"
            />
            <Text className="text-white text-xl">icon</Text>
          </View>
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-egoist-red text-2xl font-bold">2.</Text>
            <Text className="text-white text-xl">
              Allow camera permissions for Egoist
            </Text>
          </View>
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-egoist-red text-2xl font-bold">3.</Text>
            <Text className="text-white text-xl">
              Snap your progress picture
            </Text>
          </View>
          <View className="flex flex-row items-start space-x-2">
            <Text className="text-egoist-red text-2xl font-bold">4.</Text>
            <Text className="text-white text-xl">
              Once saved, select your weight from the dropdown and submit.
            </Text>
          </View>

          <View>
            <Text className="text-egoist-red text-2xl font-bold text-center underline ">
              Note
            </Text>
            <Text className="text-lg text-white text-center font-semibold">
              Your current weight is based on your most recent progress picture
              entry
            </Text>
          </View>
        </View>
      </View>
    </EgoistView>
  );
}
