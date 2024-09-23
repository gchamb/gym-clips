import Purchases from "react-native-purchases";

import { majorInteractionsAtom, trackingAtom } from "@/stores/tracking";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai/react";
import { useEffect, useState } from "react";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { captureException } from "@sentry/react-native";

export default function useAd() {
  const tracking = useAtomValue(trackingAtom);

  const { isLoaded, load, show, error, isClosed, isShowing } =
    useInterstitialAd(
      __DEV__ ? TestIds.INTERSTITIAL : "ca-app-pub-8416340468270342/8260139798",
      {
        requestNonPersonalizedAdsOnly: !tracking,
      }
    );
  const [majorInteractions, setMajorInteractions] = useAtom(
    majorInteractionsAtom
  );
  const [isTimeToShowAd, setIsTimeToShowAd] = useState(false);

  const { data } = useQuery({
    queryKey: ["customerInfo"],
    queryFn: () => Purchases.getCustomerInfo(),
  });

  useEffect(() => {
    if (!isLoaded) {
      load();
    }

    if (
      data?.activeSubscriptions.length === 0 &&
      majorInteractions > 0 &&
      majorInteractions % 10 === 0
    ) {
      setIsTimeToShowAd(true);
    } else {
      setIsTimeToShowAd(false);
    }
  }, [majorInteractions, data, isLoaded]);

  useEffect(() => {
    if (error){
      captureException(error)
    }
    if (isClosed) {
      setIsTimeToShowAd(false);
      setMajorInteractions(0);
    }
  }, [isClosed, error]);

  return {
    isTimeToShowAd,
    isReady: isLoaded,
    showAd: show,
    isShowing,
  };
}
