import mobileAds from "react-native-google-mobile-ads";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import Purchases from "react-native-purchases";
import sanitizedConfig from "@/config";
import "react-native-reanimated";

import { Stack } from "expo-router";
import { PortalHost } from "@/components/primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

Sentry.init({
  dsn: "https://a38a1ffadde38ebe85e20f70defbffd3@o4505398186541056.ingest.us.sentry.io/4507977137979392",
  debug: false,
  enabled: !__DEV__,
});

export default function RootLayout() {
  useEffect(() => {
    if (__DEV__) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);
    } else {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    const inititalize = async () => {
      // will add andrioid later potentially
      if (Platform.OS === "ios") {
        Purchases.configure({
          apiKey: sanitizedConfig.REVENUE_CAT_KEY as string,
        });
      }

      await mobileAds()
        .initialize()
        .catch((err) => Sentry.captureException(err));
    };

    inititalize();
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/signin" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)/onboarding"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(others)/daily-entry"
            options={{
              headerTitle: "",
              headerTransparent: true,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="(others)/paywall"
            options={{
              headerTitle: "",
              headerTransparent: true,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="(others)/show-all-assets"
            options={{
              headerTitle: "",
              headerTransparent: true,
              presentation: "modal",
              headerShown: true,
            }}
          />
          {/* <Stack.Screen name="+not-found" /> */}
        </Stack>
        <PortalHost />
      </QueryClientProvider>
    </>
  );
}
