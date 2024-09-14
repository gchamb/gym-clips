import { View, Image, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Months } from "@/lib/helpers";

export default function ProgressReport() {
  const { last_weight, current_weight, frequency, created_at, report_id } =
    useLocalSearchParams<{
      report_id: string;
      last_weight: string;
      current_weight: string;
      frequency: string;
      created_at: string;
    }>();

  console.log(last_weight, current_weight, frequency, created_at, report_id);
  const dateSplit = created_at.split("T")[0].split("-");
  const month = Months[parseInt(dateSplit[1]) - 1];
  const date =
    frequency === "monthly"
      ? `Month of ${month}`
      : `Week of ${month} ${dateSplit[2]}`;

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
            {date}
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
              {last_weight} LBS
            </Text>
          </View>
          <View>
            <Text className="text-center font-bold text-egoist-red text-xl">
              THIS WEEK
            </Text>
            <Text className="text-center font-bold text-egoist-white text-xl">
              {current_weight} LBS
            </Text>
          </View>

          <View className="ml-auto">
            <Pressable
              className="flex flex-row items-center space-x-4 active:scale-95"
              onPress={() => {
                router.replace("/(tabs)/home");
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
