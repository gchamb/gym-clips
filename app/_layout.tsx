import mobileAds from "react-native-google-mobile-ads";
// import * as SplashScreen from "expo-splash-screen";
// import { SplashScreen } from "expo-router";
import * as Sentry from "@sentry/react-native";
import * as Notifications from "expo-notifications";
import Purchases from "react-native-purchases";
import sanitizedConfig from "@/config";
import Aptabase, { trackEvent } from "@aptabase/react-native";
import "react-native-reanimated";

import { router, Stack, usePathname } from "expo-router";
import { PortalHost } from "@/components/primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAtom } from "jotai/react";
import { authAtom } from "@/stores/auth";
import { useNotifications } from "@/hooks/expo";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync().catch(err => Sentry.captureException(err));

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

Sentry.init({
  dsn: "https://a38a1ffadde38ebe85e20f70defbffd3@o4505398186541056.ingest.us.sentry.io/4507977137979392",
  debug: false,
  enabled: !__DEV__,
});

Aptabase.init(sanitizedConfig.APTABASE_API_KEY);

export default function RootLayout() {
  const pathname = usePathname();
  const [auth, setAuth] = useAtom(authAtom);
  const { handleNotificationResponse } = useNotifications();
  useEffect(() => {
    trackEvent("screen_tracking", { screen: pathname });
  }, [pathname]);

  useEffect(() => {
    if (__DEV__) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);
      Aptabase.dispose();
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

    const validateJwt = async () => {
      if (auth === null) {
        return;
      }

      try {
        // validate the current jwt token
        const endpoint = `${sanitizedConfig.API_URL}/api/v1/auth/refresh`;
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.refresh_token}`,
          },
        });

        if (!response.ok) {
          setAuth(null);
          router.replace("/");
          return;
        }

        const { jwt_token } = (await response.json()) as { jwt_token: string };

        const { jwt_token: temp_token, ...rest } = auth;

        setAuth({ jwt_token, ...rest });
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    inititalize();
    validateJwt();

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    return () => {
      if (responseListener) {
        Notifications.removeNotificationSubscription(responseListener);
      }
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/signin" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
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
