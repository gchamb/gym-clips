import EgoistBannerAd from "@/components/ui/banner-ad";
import EgoistView from "@/components/ui/egoist-view";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, View, Image, Pressable, FlatList } from "react-native";

const img =
  "https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2024/06/George-Bamfo-Jrs-Ab-Workout-in-the-gym-and-on-sunday-mornings.jpg?quality=86&strip=all";

const count = new Array(6).fill(null);

export default function Home2() {
  return (
    <EgoistView>
      <View className="w-11/12 mx-auto space-y-8">
        <View className="w-[50px] h-[50px] mx-auto">
          <Image
            source={require("@/assets/images/egoist-logo.png")}
            className="w-full h-full"
          />
        </View>
        {/* Weights */}
        <View className="flex flex-row items-center justify-center space-x-4 m-2">
          <Pressable className="relative bg-egoist-red w-1/2  rounded-lg p-2 space-y-4 justify-center active:scale-95">
            <View className="absolute right-4 top-2">
              <Feather name="edit-2" color="white" size={20} />
            </View>
            <Text className="text-center text-white">Current Weight</Text>
            <Text className="text-center text-white text-7xl font-bold">
              152
            </Text>
            <Text className="text-center text-white text-xl font-bold">
              lbs
            </Text>
          </Pressable>

          <Pressable className="relative bg-egoist-red w-1/2  rounded-lg p-2 space-y-4 justify-center active:scale-95">
            <View className="absolute right-4 top-2">
              <Feather name="edit-2" color="white" size={20} />
            </View>
            <Text className="text-center text-white">Goal Weight</Text>
            <Text className="text-center text-white text-7xl font-bold">
              152
            </Text>
            <Text className="text-center text-white text-xl font-bold">
              lbs
            </Text>
          </Pressable>
        </View>
        {/* Daily Streak */}
        <View>
          <Text className="text-7xl font-semibold text-white text-center">
            0
          </Text>
          <Text className="text-xl font-semibold text-white text-center">
            days in the gym
          </Text>
        </View>

        <View className="mx-auto space-y-4">
          <FlatList
            data={count}
            scrollEnabled={false}
            numColumns={3}
            renderItem={({ item }) => {
              return (
                <Pressable
                  className="p-1"
                  onPress={() => {
                    //   setMajorInteractions(async (prev) => {
                    //     return (await prev) + 1;
                    //   });
                    //   setSelectedAsset(item);
                  }}
                >
                  <Image
                    source={{
                      uri: img,
                    }}
                    className="w-[80px] h-[80px]"
                  />
                </Pressable>
              );
            }}
          />

          <Link
            href="/(others)/show-all-assets?type=progress-entry"
            className="text-white text-xl text-center underline"
          >
            View All
          </Link>
        </View>
      </View>
      <EgoistBannerAd />
    </EgoistView>
  );
}
