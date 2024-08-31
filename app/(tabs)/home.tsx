import PictureCapture from "@/components/picture-capture";
import Carousel from "react-native-reanimated-carousel";
import EgoistView from "@/components/ui/egoist-view";
import PlaceholderAd from "@/components/ui/placeholder-ad";
import getAssets from "@/lib/query-functions";
import { authAtom } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai/react";
import { useCallback } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { formatDate } from "@/lib/helpers";
import { useFocusEffect } from "expo-router";
import { ProgressEntry } from "@/types";

const REMOVE_LATER_WHEN_VIDEOS_ARE_COMPLETED = [
  "July",
  "August",
  "September",
  "October",
  "Novemember",
];

export default function Home() {
  const authTokens = useAtomValue(authAtom);
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["getAssets"],
    queryFn: () => getAssets(authTokens),
  });

  // derived and not that compute intensive (max 5 entries) so a rerender is on this fine
  const getTodaysEntryIndex = data?.entries.findIndex((entry, idx) => {
    return (
      entry.createdAt.split("T")[0] === new Date().toLocaleDateString("en-CA")
    );
  });

  const carouselData = useCallback((): ProgressEntry[] => {
    if (data === undefined) {
      return [];
    }

    if (getTodaysEntryIndex === undefined || getTodaysEntryIndex === -1) {
      return [
        ...data.entries,
        {
          id: "placeholder",
          azureBlobKey: "placeholder",
          createdAt: "placeholder",
          currentWeight: 0,
        },
      ];
    }
    return data.entries;
  }, [data?.entries, getTodaysEntryIndex]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  console.log(isLoading, data);

  return (
    <EgoistView className="relative">
      <View className="flex-1 mt-10 space-y-8">
        <View className="space-y-4">
          <View>
            <Text className="text-egoist-white text-lg text-center">
              Daily Progress
            </Text>
            <Text className="text-egoist-red text-sm text-center">
              Show All
            </Text>
          </View>

          <View className="h-[300px] w-[200px] mx-auto flex justify-center items-center">
            {isLoading && <PictureCapture showOnlySkeleton />}
            {!isLoading && data?.entries.length === 0 && <PictureCapture />}
            {data !== undefined && data.entries.length > 0 && (
              <Carousel
                width={Dimensions.get("screen").width}
                height={300}
                defaultIndex={
                  getTodaysEntryIndex === -1 ||
                  getTodaysEntryIndex === undefined
                    ? carouselData().length - 1
                    : getTodaysEntryIndex
                }
                data={carouselData()}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => {
                  if (item.id === "placeholder") {
                    return <PictureCapture openDailyEntry />;
                  }

                  return (
                    <View className="space-y-4 h-full">
                      <Text className="text-white font-semibold text-lg text-center">
                        {formatDate(item.createdAt)}
                      </Text>
                      <View>
                        <PictureCapture default={item.azureBlobKey} />
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>

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
            {REMOVE_LATER_WHEN_VIDEOS_ARE_COMPLETED.map((value) => (
              <View
                key={value}
                className="bg-white w-[150px] h-[150px] ml-4 flex justify-center items-center  rounded-lg"
              >
                <Text className="text-lg font-bold">{value}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <PlaceholderAd />
    </EgoistView>
  );
}
