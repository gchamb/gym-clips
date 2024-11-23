import Button from "./ui/button";
import Separator from "./ui/separator";

import { BlurView } from "expo-blur";
import { Modal, View, Text, Image } from "react-native";
import { useNotifications } from "@/hooks/expo";

export default function NotificationModal(props: { onClose: () => void }) {
  const { registerForPushNotificationsAsync } = useNotifications();
  return (
    <Modal transparent animationType="fade">
      <BlurView className="flex-1">
        <View className="bg-egoist-black w-11/12 m-auto rounded-2xl drop-shadow-2xl p-2 items-center space-y-4">
          <View>
            <Text className="text-3xl text-egoist-white font-semibold text-center">
              Want Reminders?
            </Text>
            <Text className="text-xs text-center text-egoist-white">
              Hold yourself accountable to earn your streak.
            </Text>
          </View>

          <View className="space-y-4">
            <View className="flex flex-row space-x-4">
              <View className="w-12 h-12">
                <Image
                  source={require("@/assets/images/egoist-logo.png")}
                  className="w-full h-full"
                />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">Egoist</Text>
                <Text className="text-white text-sm">
                  Time for your daily progress picture
                </Text>
              </View>
            </View>
            <View className="h-2">
              <Separator className="" />
            </View>
            <View className="flex flex-row space-x-4">
              <View className="w-12 h-12">
                <Image
                  source={require("@/assets/images/egoist-logo.png")}
                  className="w-full h-full"
                />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">Egoist</Text>
                <Text className="text-white text-sm">
                  Your progress video is ready
                </Text>
              </View>
            </View>
          </View>
          <Button
            text="Select"
            className="p-2 w-full"
            onPress={async () => {
              await registerForPushNotificationsAsync();
              props.onClose();
            }}
          />
        </View>
      </BlurView>
    </Modal>
  );
}
