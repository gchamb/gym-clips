import EgoistView from "@/components/ui/egoist-view";
import AssetModal from "@/components/show-asset-modal";
import VideoPreview from "@/components/video-preview";
import LoadingScreen from "@/components/loading-screen";
import ErrorScreen from "@/components/error-screen";

import {
  formatDataByMonth,
  Months,
  isSectionList,
  isProgressVideo,
} from "@/lib/helpers";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai/react";
import { authAtom } from "@/stores/auth";
import { ProgressEntry, ProgressVideo } from "@/types";
import { majorInteractionsAtom } from "@/stores/tracking";

export default function ShowAllAssets() {
  const authTokens = useAtomValue(authAtom);
  const setMajorInteractions = useSetAtom(majorInteractionsAtom);

  const { type = "progress-entry" } = useLocalSearchParams<{ type: string }>();
  const [selectedAsset, setSelectedAsset] = useState<
    ProgressEntry | ProgressVideo | null
  >(null);
  const [selectedFrequency, setSelectedFrequency] = useState<
    "monthly" | "weekly"
  >("weekly");

  const queryKey = `get${
    type === "progress-entry" ? "Entries" : "Videos"
  } ?frequency=${selectedFrequency}`;

  const { data, isLoading, isRefetching, refetch, error, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: ({ pageParam }) =>
        getAssets(authTokens, {
          type: [type],
          frequency: selectedFrequency,
          take: 100,
          page: pageParam,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage.hasNextPage) {
          return;
        }
        return pages.length + 1;
      },
      select: (data) => {
        if (type === "progress-entry") {
          const flattenedData = data.pages.flatMap((d) => {
            return formatDataByMonth(d.entries);
          });

          const noDups: typeof flattenedData = [];

          // we want no duplicate sections showing
          for (const currentData of flattenedData) {
            const titles = noDups.map((d) => d.title);
            if (!titles.includes(currentData.title)) {
              // if not a duplicate then just add
              noDups.push(currentData);
            } else {
              // if there are duplicate keys then the entries have been broken into different portions
              // based on the take value we set
              const findDup = noDups.find((d) => d.title === currentData.title);
              if (
                findDup !== undefined &&
                currentData.data[0].length !== findDup.data[0].length
              ) {
                findDup.data[0] = [...findDup.data[0], ...currentData.data[0]];
              }
            }
          }

          return noDups;
        } else {
          return data.pages.flatMap((p) => p.videos);
        }
      },
    });

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
        {type === "progress-entry" && isSectionList(data) && (
          <SectionList
            sections={data ?? []}
            showsVerticalScrollIndicator={false}
            // keyExtractor={(item, index) => item + index}
            onEndReached={async () => {
              await fetchNextPage();
            }}
            onEndReachedThreshold={0.3}
            ListHeaderComponent={() => {
              return (
                <View>
                  <View className="mt-4">
                    <Text className="text-white text-center text-lg font-semibold">
                      Progress
                    </Text>
                    {/* Progress Entry */}
                    {/* Progress Video */}
                    <View className="flex flex-row items-center space-x-2  mx-auto">
                      <Pressable
                        onPress={() =>
                          router.setParams({ type: "progress-entry" })
                        }
                      >
                        <Text
                          className={`text-4xl font-semibold ${
                            type === "progress-entry"
                              ? "text-egoist-white"
                              : "text-slate-700"
                          }`}
                        >
                          Pictures
                        </Text>
                      </Pressable>
                      <Text className="text-4xl font-semibold text-egoist-white m-1">
                        /
                      </Text>
                      <Pressable
                        onPress={() =>
                          router.setParams({ type: "progress-video" })
                        }
                      >
                        <Text
                          className={`text-4xl font-semibold ${
                            type === "progress-video"
                              ? "text-egoist-white"
                              : "text-slate-700"
                          }`}
                        >
                          Videos
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            }}
            renderItem={({ item }) => (
              <View className="my-6">
                <FlatList
                  data={item}
                  viewabilityConfig={{
                    minimumViewTime: 10000,
                    viewAreaCoveragePercentThreshold: 10,
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
                  <Text className="text-egoist-white text-4xl font-bold text-center">
                    {displayDate}
                  </Text>
                </View>
              );
            }}
          />
        )}
        {type === "progress-video" && isProgressVideo(data) && (
          <View className="">
            <FlatList
              data={data}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              onEndReached={async () => {
                await fetchNextPage();
              }}
              onEndReachedThreshold={0.3}
              ListHeaderComponent={() => {
                return (
                  <View>
                    <View>
                      <View className="mt-4">
                        <Text className="text-white text-center text-lg font-semibold">
                          Progress
                        </Text>
                        {/* Progress Entry */}
                        {/* Progress Video */}
                        <View className="flex flex-row items-center space-x-2  mx-auto">
                          <Pressable
                            onPress={() =>
                              router.setParams({ type: "progress-entry" })
                            }
                          >
                            <Text
                              className={`text-4xl font-semibold ${
                                type === "progress-entry"
                                  ? "text-egoist-white"
                                  : "text-slate-700"
                              }`}
                            >
                              Pictures
                            </Text>
                          </Pressable>
                          <Text className="text-4xl font-semibold text-egoist-white m-1">
                            /
                          </Text>
                          <Pressable
                            onPress={() =>
                              router.setParams({ type: "progress-video" })
                            }
                          >
                            <Text
                              className={`text-4xl font-semibold ${
                                type === "progress-video"
                                  ? "text-egoist-white"
                                  : "text-slate-700"
                              }`}
                            >
                              Videos
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                    <View className="flex flex-row items-center space-x-2">
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
                      <Text className="text-4xl font-semibold text-egoist-white m-1">
                        /
                      </Text>
                      <Pressable
                        onPress={() => setSelectedFrequency("monthly")}
                      >
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
                    </View>
                  </View>
                );
              }}
              contentContainerStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // padding: 5,
                // padding: "5px",
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
