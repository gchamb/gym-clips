import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/signin" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />
      {/* <Stack.Screen name="+not-found" /> */}
    </Stack>
  );
}
