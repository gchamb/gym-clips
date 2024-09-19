import PictureCapture from "@/components/picture-capture";
import Carousel from "react-native-reanimated-carousel";
import EgoistView from "@/components/ui/egoist-view";
import BannerAd from "@/components/ui/banner-ad";
import VideoPreview from "@/components/video-preview";
import AssetModal from "@/components/show-asset-modal";
import useAd from "@/hooks/useAd";

import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { getAssets } from "@/lib/query-functions";
import { authAtom } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai/react";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { formatDate } from "@/lib/helpers";
import { Link } from "expo-router";
import { ProgressEntry, ProgressVideo } from "@/types";
import { trackingAtom } from "@/stores/tracking";
import ErrorScreen from "@/components/error-screen";
import { captureException } from "@sentry/react-native";

export default function Home() {
  const authTokens = useAtomValue(authAtom);
  const setTracking = useSetAtom(trackingAtom);

  const { isLoading, data, refetch, error } = useQuery({
    queryKey: ["getAssets"],
    queryFn: () => getAssets(authTokens),
  });
  const [showVideoPreview, setShowVideoPreview] =
    useState<ProgressVideo | null>(null);

  const { isTimeToShowAd, isReady, showAd, isShowing } = useAd();

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
          blobKey: "placeholder",
          createdAt: "placeholder",
          currentWeight: 0,
        },
      ];
    }
    return data.entries;
  }, [data?.entries, getTodaysEntryIndex]);

  useEffect(() => {
    const checkForPermissions = async () => {
      try {
        const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        if (result !== RESULTS.GRANTED) {
          // The permission has not been requested, so request it.
          const status = await request(
            PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
          );

          setTracking(status === RESULTS.GRANTED ? true : false);
        }

        if (result === RESULTS.GRANTED) {
          setTracking(true);
        }
      } catch (err) {
        captureException(err);
      }
    };

    const onInit = async () => {
      await checkForPermissions();
    };
    onInit();
  }, []);

  useEffect(() => {
    const timeToShowAd = async () => {
      if (isShowing) return;

      if (isReady && isTimeToShowAd) {
        showAd();
      }
    };

    timeToShowAd();
  }, [isReady, isTimeToShowAd]);

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
    <EgoistView className="relative">
      {showVideoPreview !== null && (
        <AssetModal
          assetType="video"
          asset={showVideoPreview}
          onPress={() => setShowVideoPreview(null)}
        />
      )}
      <View className="flex-1 mt-10 space-y-8">
        <View className="space-y-4">
          <View>
            <Text className="text-egoist-white text-lg text-center">
              Daily Progress
            </Text>
            <Link
              href="/(others)/show-all-assets?type=progress-entry"
              className="text-egoist-red text-sm text-center"
            >
              Show All
            </Link>
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
                        <PictureCapture default={item.blobKey} />
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
          <Link
            href="/(others)/show-all-assets?type=progress-video"
            className="text-egoist-red text-sm text-center"
          >
            Show All
          </Link>

          {isLoading || data === undefined ? (
            <View className="items-center justify-center h-[175px]">
              <ActivityIndicator />
            </View>
          ) : (
            <>
              {data.videos.length > 0 ? (
                <ScrollView
                  horizontal
                  contentContainerStyle={{ marginTop: 10 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {data?.videos.map((item) => (
                    <VideoPreview
                      key={item.id}
                      item={item}
                      color="white"
                      onPress={() => {
                        setShowVideoPreview(item);
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View className="h-[175px] items-center justify-center">
                  <Text className="text-2xl text-white font-semibold">
                    No Progress Videos Yet!
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>

      <BannerAd />
    </EgoistView>
  );
}
