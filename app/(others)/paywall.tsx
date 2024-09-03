import React from "react";
import RevenueCatUI from "react-native-purchases-ui";
import { View, Text } from "react-native";
import { Href, router, useLocalSearchParams } from "expo-router";

export default function Paywall() {
  const { nextScreen } = useLocalSearchParams<{ nextScreen?: string }>();

  return (
    <View style={{ flex: 1 }}>
      <RevenueCatUI.Paywall
        options={{ displayCloseButton: true }}
        onDismiss={() => {
          if (nextScreen) {
            router.replace(`/${nextScreen}` as Href<string>);
          } else {
            router.dismiss();
          }
        }}
      />
    </View>
  );
}
