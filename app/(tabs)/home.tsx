import PictureCapture from "@/components/picture-capture";
import EgoistView from "@/components/ui/egoist-view";
import { ScrollView, Text, View } from "react-native";

const d = ["July", "August", "September", "October", "Novemember"];

export default function Home() {
  return (
    <EgoistView className="relative">
      <View className="flex-1 mt-10 space-y-8">
        <View>
          <Text className="text-egoist-white text-lg text-center">
            Daily Progress
          </Text>
          <Text className="text-egoist-red text-sm text-center">Show All</Text>
        </View>

        {/* dummy view here so the spacing is recognized */}
        <View />
        <PictureCapture liftImage={() => {}} />

        <View>
          <Text className="text-egoist-white text-lg text-center">
            Progress Videos
          </Text>
          <Text className="text-egoist-red text-sm text-center">Show All</Text>

          <ScrollView
            horizontal
            contentContainerStyle={{ marginTop: 10 }}
            showsHorizontalScrollIndicator={false}
          >
            {d.map((value) => (
              <View className="bg-white w-[150px] h-[150px] ml-4 flex justify-center items-center  rounded-lg">
                <Text className="text-lg font-bold">{value}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View className="absolute h-[75px] bottom-0 left-0 right-0 bg-white flex justify-center items-center">
        <Text className="text-lg font-bold">Placeholder Ad</Text>
      </View>
    </EgoistView>
  );
}
