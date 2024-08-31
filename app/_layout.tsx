import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { PortalHost } from "@/components/primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
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
          {/* <Stack.Screen name="+not-found" /> */}
        </Stack>
        <PortalHost />
      </QueryClientProvider>
    </>
  );
}
