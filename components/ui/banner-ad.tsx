import Purchases from "react-native-purchases";

import { useQuery } from "@tanstack/react-query";
import { View, Text } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useAtomValue } from "jotai/react";
import { trackingAtom } from "@/stores/tracking";

export default function EgoistBannerAd() {
  const { data } = useQuery({
    queryKey: ["customerInfo"],
    queryFn: () => Purchases.getCustomerInfo(),
  });
  const tracking = useAtomValue(trackingAtom);

  if (data !== undefined && data.activeSubscriptions.length > 0) {
    return <></>;
  }

  return (
    <View className="absolute h-[75px] bottom-0 left-0 right-0 bg-white flex justify-center items-center">
      <BannerAd
        unitId={
          __DEV__ ? TestIds.BANNER : "ca-app-pub-8416340468270342/3096781759"
        }
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: !tracking,
        }}
      />
    </View>
  );
}
