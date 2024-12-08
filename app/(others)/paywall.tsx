import React, { useEffect } from "react";
import RevenueCatUI from "react-native-purchases-ui";
import { View, Text } from "react-native";
import { Href, router, useLocalSearchParams } from "expo-router";
import { trackEvent } from "@aptabase/react-native";
import { captureException } from "@sentry/react-native";

export default function Paywall() {
  const { nextScreen } = useLocalSearchParams<{ nextScreen?: string }>();

  useEffect(() => {
    trackEvent("paywall_shown");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <RevenueCatUI.Paywall
        options={{
          displayCloseButton: true,
          offering: {
            identifier: "cheaper offering",
            serverDescription: "",
            metadata: {},
            availablePackages: [],
            lifetime: null,
            annual: null,
            sixMonth: null,
            threeMonth: null,
            twoMonth: null,
            monthly: null,
            weekly: null
          },
        }}
        onDismiss={() => {
          if (nextScreen) {
            router.replace(`/${nextScreen}` as Href<string>);
          } else {
            router.dismiss();
          }
        }}
        onPurchaseStarted={() => trackEvent("paywall_started")}
        onPurchaseCompleted={() => trackEvent("paywall_completed")}
        onPurchaseCancelled={() => trackEvent("paywall_cancelled")}
        onPurchaseError={({ error }) => {
          captureException(error);
        }}
      />
    </View>
  );
}
