import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import sanitizedConfig from "@/config";
import { captureException } from "@sentry/react-native";
import { useAtomValue } from "jotai/react";
import { authAtom } from "@/stores/auth";

export function useNotifications() {
  const auth = useAtomValue(authAtom);
  async function registerForPushNotificationsAsync() {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      if (existingStatus === "granted") {
        return;
      }

      await Notifications.requestPermissionsAsync();
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas.projectId,
        })
      ).data;

      // save expo token
      const endpoint = `${sanitizedConfig.API_URL}/api/v1/user/update`;
      await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${auth?.jwt_token}`,
        },
        body: JSON.stringify({ expo_token: token }),
      });
    } catch (err) {
      captureException(err);
    }
  }

  const handleNotificationResponse = (
    response: Notifications.NotificationResponse
  ) => {
    const data = response.notification.request.content.data as { url: string };
    const redirect = Linking.createURL(data.url);
    Linking.openURL(redirect);
  };

  return { handleNotificationResponse, registerForPushNotificationsAsync };
}
