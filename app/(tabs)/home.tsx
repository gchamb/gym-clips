import ChangeGoalWeightModal from "@/components/change-goal-weight-modal";
import AssetModal from "@/components/show-asset-modal";
import EgoistView from "@/components/ui/egoist-view";
import useUser from "@/hooks/useUser";
import LottieView from "lottie-react-native";
import * as Notifications from "expo-notifications";
import NotificationModal from "@/components/notication-modal";
import useAd from "@/hooks/useAd";

import { getAssets } from "@/lib/query-functions";
import { authAtom } from "@/stores/auth";
import { majorInteractionsAtom, trackingAtom } from "@/stores/tracking";
import { ProgressEntry } from "@/types/types";
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
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";

const dummy = new Array(6).fill(null);

export default function Home() {
  const { type } = useLocalSearchParams<{ type?: string }>();

  const confettiRef = useRef<LottieView>(null);
  const [selectedAsset, setSelectedAsset] = useState<ProgressEntry | null>(
    null
  );
  const [showGoalWeightModal, setShowGoalWeightModal] = useState(false);
  const [applause, setApplauseSound] = useState<Audio.Sound | undefined>();

  const [showNotificationModal, setNotificationModal] = useState(false);

  // atoms
  const setTracking = useSetAtom(trackingAtom);
  const authTokens = useAtomValue(authAtom);
  const setMajorInteractions = useSetAtom(majorInteractionsAtom);

  const {
    isLoading: isAssetLoading,
    data: assetData,
    refetch: refetchAssets,
  } = useQuery({
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
  const { isTimeToShowAd, isReady, showAd, isShowing } = useAd();

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

  const checkForTrackingPermissions = async () => {
    try {
      // tracking
      const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (result !== RESULTS.GRANTED) {
        // The permission has not been requested, so request it.
        const status = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);

        setTracking(status === RESULTS.GRANTED ? true : false);
      }

      if (result === RESULTS.GRANTED) {
        setTracking(true);
      }
    } catch (err) {
      captureException(err);
    }
  };

  const checkForNotificationPermissions = async () => {
    try {
      const currentPermissions = await Notifications.getPermissionsAsync();

      if (currentPermissions.granted) {
        return;
      }

      if (currentPermissions.canAskAgain) {
        setNotificationModal(true);
      }
    } catch (err) {
      captureException(err);
    }
  };

  const preloadSounds = async () => {
    try {
      const applause = require("@/assets/other/applause.mp3");

      const { sound } = await Audio.Sound.createAsync(applause);

      await sound.setVolumeAsync(0.5);

      setApplauseSound(sound);
    } catch (err) {
      captureException(err);
    }
  };

  useEffect(() => {
    const timeToShowAd = async () => {
      if (isShowing) return;

      if (isReady && isTimeToShowAd) {
        showAd();
      }
    };

    timeToShowAd();
  }, [isReady, isTimeToShowAd]);

  useEffect(() => {
    const onInit = async () => {
      preloadSounds(); // preload in background
      await checkForTrackingPermissions();
      await checkForNotificationPermissions();
    };

    onInit();
  }, []);

  return (
    <EgoistView>
      {showNotificationModal && (
        <NotificationModal onClose={() => setNotificationModal(false)} />
      )}
      {type === "entry-success" && applause && (
        <LottieView
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
      <View className="w-11/12 mx-auto space-y-6">
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
            {isLoading && (
              <View className="flex items-center justify-center h-12">
                <ActivityIndicator />
              </View>
            )}
            <Text className="text-center text-white text-7xl font-bold">
              {!isLoading && data === undefined && 0}
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
            {isLoading && (
              <View className="flex items-center justify-center h-12">
                <ActivityIndicator />
              </View>
            )}
            <Text className="text-center text-white text-7xl font-bold">
              {!isLoading && data === undefined && 0}
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
            data={isAssetLoading || !data ? dummy : picAssets}
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
                    onError={() => refetchAssets()}
                    className="w-[80px] h-[80px] rounded-lg"
                  />
                </Pressable>
              );
            }}
          />

          {assetData && assetData.entries.length > 0 && (
            <Link
              href="/show-all-assets?type=progress-entry"
              className="text-white text-xl text-center underline"
            >
              View All
            </Link>
          )}
        </View>
      </View>
    </EgoistView>
  );
}
