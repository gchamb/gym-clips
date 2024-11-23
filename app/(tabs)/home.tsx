import ChangeGoalWeightModal from "@/components/change-goal-weight-modal";
import AssetModal from "@/components/show-asset-modal";
import EgoistBannerAd from "@/components/ui/banner-ad";
import EgoistView from "@/components/ui/egoist-view";
import useUser from "@/hooks/useUser";
import LottieView from "lottie-react-native";

import { getAssets } from "@/lib/query-functions";
import { authAtom } from "@/stores/auth";
import { majorInteractionsAtom } from "@/stores/tracking";
import { ProgressEntry, ProgressVideo } from "@/types/types";
import { Feather } from "@expo/vector-icons";
import { captureException } from "@sentry/react-native";
import { useQuery } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";

export default function Home2() {
  const { type } = useLocalSearchParams<{ type?: string }>();

  const confettiRef = useRef<LottieView>(null);
  const [selectedAsset, setSelectedAsset] = useState<ProgressEntry | null>(
    null
  );
  const [showGoalWeightModal, setShowGoalWeightModal] = useState(false);
  const [applause, setApplauseSound] = useState<Audio.Sound | undefined>();

  const authTokens = useAtomValue(authAtom);
  const setMajorInteractions = useSetAtom(majorInteractionsAtom);
  const { isLoading: isAssetLoading, data: assetData } = useQuery({
    queryKey: ["getAssets"],
    queryFn: () =>
      getAssets(authTokens, {
        type: ["progress-entry"],
        take: 6,
        page: 1,
        frequency: "monthly",
      }),
  });
  const { data, isLoading, refetch } = useUser();

  const picAssets = useMemo(() => {
    if (assetData?.entries === undefined) {
      return;
    }

    const result = [];

    for (let i = 0; i < 6; i++) {
      if (i >= assetData.entries.length) {
        result.push(null);
      } else {
        result.push(assetData.entries[i]);
      }
    }
    refetch();
    return result;
  }, [assetData?.entries]);

  useEffect(() => {
    const preloadSounds = async () => {
      try {
        const applause = require("@/assets/other/applause.mp3");

        const { sound } = await Audio.Sound.createAsync(applause);

        await sound.setVolumeAsync(0.5);

        setApplauseSound(sound);
      } catch (err) {
        console.error("error occurred loading in audio", err);
        captureException(err);
      }
    };

    preloadSounds();
  }, []);

  return (
    <EgoistView>
      {type === "entry-success" && applause && (
        <LottieView
          key={Math.random()}
          ref={confettiRef}
          source={require("@/assets/other/confetti.json")}
          onLayout={async () => {
            await applause.playFromPositionAsync(0);
            console.log("SHOULD BE PLAYING");
            const timeout = setTimeout(async () => {
              await applause.stopAsync();
              clearTimeout(timeout);
            }, 2500);
          }}
          onAnimationFinish={() => {
            router.setParams({
              type: undefined,
            });
          }}
          autoPlay
          loop={false}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            pointerEvents: "none",
          }}
          resizeMode="cover"
        />
      )}
      {selectedAsset !== null && (
        <AssetModal
          assetType="image"
          asset={selectedAsset}
          onPress={() => setSelectedAsset(null)}
        />
      )}
      {showGoalWeightModal && (
        <ChangeGoalWeightModal
          onClose={() => setShowGoalWeightModal(false)}
          onComplete={async () => await refetch()}
        />
      )}
      <View className="w-11/12 mx-auto space-y-8">
        <View className="w-[50px] h-[50px] mx-auto">
          <Image
            source={require("@/assets/images/egoist-logo.png")}
            className="w-full h-full"
          />
        </View>
        {/* Weights */}
        <View className="flex flex-row items-center justify-center space-x-4 m-2">
          <Pressable
            className="relative bg-egoist-red w-1/2  rounded-2xl p-2 space-y-4 justify-center active:scale-95"
            onPress={() => router.push("/(tabs)/entry")}
          >
            <View className="absolute right-4 top-2">
              <Feather name="edit-2" color="white" size={20} />
            </View>
            <Text className="text-center text-white">Current Weight</Text>
            <Text className="text-center text-white text-7xl font-bold">
              {isLoading && <ActivityIndicator />}
              {!isLoading && data === undefined && ""}
              {!isLoading && data && data.currentWeight}
            </Text>
            <Text className="text-center text-white text-xl font-bold">
              lbs
            </Text>
          </Pressable>

          <Pressable
            className="relative bg-egoist-red w-1/2  rounded-2xl p-2 space-y-4 justify-center active:scale-95"
            onPress={() => setShowGoalWeightModal(true)}
          >
            <View className="absolute right-4 top-2">
              <Feather name="edit-2" color="white" size={20} />
            </View>
            <Text className="text-center text-white">Goal Weight</Text>
            <Text className="text-center text-white text-7xl font-bold">
              {isLoading && <ActivityIndicator />}
              {!isLoading && data === undefined && ""}
              {!isLoading && data && data.goalWeight}
            </Text>
            <Text className="text-center text-white text-xl font-bold">
              lbs
            </Text>
          </Pressable>
        </View>
        {/* Daily Streak */}
        <View>
          <Text className="text-7xl font-semibold text-white text-center">
            {data?.streak ?? 0}
          </Text>
          <Text className="text-xl font-semibold text-white text-center">
            days in the gym
          </Text>
        </View>

        <View className="mx-auto space-y-4">
          <FlatList
            data={picAssets}
            scrollEnabled={false}
            numColumns={3}
            renderItem={({ item }) => {
              if (item === null) {
                return (
                  <View className="w-[80px] h-[80px] m-1 border border-egoist-red rounded-lg flex items-center justify-center">
                    <View className="w-[50px] h-[50px] mx-auto">
                      <Image
                        source={require("@/assets/images/egoist-logo.png")}
                        className="w-full h-full"
                      />
                    </View>
                  </View>
                );
              }

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
                    className="w-[80px] h-[80px] rounded-lg"
                  />
                </Pressable>
              );
            }}
          />

          {assetData && assetData.entries.length > 0 && (
            <Link
              href="/(others)/show-all-assets?type=progress-entry"
              className="text-white text-xl text-center underline"
            >
              View All
            </Link>
          )}
        </View>
      </View>
      <EgoistBannerAd />
    </EgoistView>
  );
}
