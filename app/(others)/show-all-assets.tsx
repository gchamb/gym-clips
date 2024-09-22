import EgoistView from "@/components/ui/egoist-view";
import AssetModal from "@/components/show-asset-modal";
import VideoPreview from "@/components/video-preview";
import LoadingScreen from "@/components/loading-screen";
import ErrorScreen from "@/components/error-screen";

import { formatDataByMonth, Months } from "@/lib/helpers";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  SectionList,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { getAssets } from "@/lib/query-functions";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai/react";
import { authAtom } from "@/stores/auth";
import { ProgressEntry, ProgressVideo } from "@/types";
import { majorInteractionsAtom } from "@/stores/tracking";

export default function ShowAllAssets() {
  const authTokens = useAtomValue(authAtom);
  const setMajorInteractions = useSetAtom(majorInteractionsAtom);

  const { type } = useLocalSearchParams<{ type: string }>();
  const [selectedAsset, setSelectedAsset] = useState<
    ProgressEntry | ProgressVideo | null
  >(null);
  const [selectedFrequency, setSelectedFrequency] = useState<
    "monthly" | "weekly"
  >("monthly");

  const queryKey = `get${
    type === "progress-entry" ? "Entries" : "Videos"
  } ?frequency=${selectedFrequency}`;
  const { isLoading, data, refetch, isRefetching, error } = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getAssets(authTokens, {
        type: [type],
        frequency: selectedFrequency,
        take: 100,
        page: 1,
      }),
  });
  const progressEntriesByMonth = useMemo(() => {
    if (data === undefined) return;
    if (type !== "progress-entry") return;

    return formatDataByMonth(data.entries);
  }, [data, type]);

  useEffect(() => {
    setMajorInteractions(async (prev) => {
      return (await prev) + 1;
    });
  }, []);

  if (isLoading || isRefetching || data === undefined) {
    return <LoadingScreen />;
  }
  if (error) {
    return (
      <ErrorScreen
        error={
          error instanceof Error ? error.message : "Unable to fetch assets."
        }
        refetch={refetch}
      />
    );
  }
  console.log(Dimensions.get("screen").width)
  return (
    <EgoistView>
      {selectedAsset !== null && (
        <AssetModal
          assetType={type === "progress-entry" ? "image" : "video"}
          asset={selectedAsset}
          onPress={() => setSelectedAsset(null)}
        />
      )}
      <View className="w-11/12 mx-auto">
        {type === "progress-entry" ? (
          <SectionList
            sections={progressEntriesByMonth ?? []}
            showsVerticalScrollIndicator={false}
            // keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <View className="my-6">
                <FlatList
                  data={item}
                  viewabilityConfig={{
                    minimumViewTime: 10000,
                    viewAreaCoveragePercentThreshold: 10,
                    //   itemVisiblePercentThreshold: 40,
                    waitForInteraction: false,
                  }}
                  numColumns={Dimensions.get("screen").width > 400 ? 5 : 4}
                  renderItem={({ item }) => {
                    return (
                      <Pressable
                        className="p-1"
                        onPress={() => {
                          setMajorInteractions(async (prev) => {
                            return (await prev) + 1;
                          });
                          setSelectedAsset(item);
                        }}
                      >
                        <Image
                          source={{
                            uri: item.blobKey,
                          }}
                          className="w-[70px] h-[70px]"
                        />
                      </Pressable>
                    );
                  }}
                />
              </View>
            )}
            renderSectionHeader={({ section }) => {
              const titleSplit = section.title.split("-");

              const displayDate = `${Months[parseInt(titleSplit[1]) - 1]} ${
                titleSplit[0]
              }`;

              return (
                <View>
                  <Text className="text-egoist-white text-4xl font-bold">
                    {displayDate}
                  </Text>
                </View>
              );
            }}
          />
        ) : (
          <View className="space-y-8">
            <View>
              <View className="flex flex-row items-center space-x-2">
                <Pressable onPress={() => setSelectedFrequency("monthly")}>
                  <Text
                    className={`text-4xl font-semibold ${
                      selectedFrequency === "monthly"
                        ? "text-egoist-white"
                        : "text-slate-700"
                    }`}
                  >
                    Monthly
                  </Text>
                </Pressable>
                <Text className="text-4xl font-semibold text-egoist-white m-1">
                  /
                </Text>
                <Pressable onPress={() => setSelectedFrequency("weekly")}>
                  <Text
                    className={`text-4xl font-semibold ${
                      selectedFrequency === "monthly"
                        ? "text-slate-700"
                        : "text-egoist-white"
                    }`}
                  >
                    Weekly
                  </Text>
                </Pressable>
              </View>
              <Text className="text-sm font-semibold text-egoist-white">
                Progress Videos
              </Text>
            </View>

            <FlatList
              data={data?.videos ?? []}
              numColumns={2}
              contentContainerStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              renderItem={({ item }) => (
                <VideoPreview
                  item={item}
                  onPress={() => setSelectedAsset(item)}
                  color="red"
                  makeLarge
                />
              )}
            />
          </View>
        )}
      </View>
    </EgoistView>
  );
}
