import Video from "react-native-video";
import { formatDate } from "@/lib/helpers";
import { ProgressEntry, ProgressVideo } from "@/types";
import { BlurView } from "expo-blur";
import { Modal, Pressable, View, Text, Image } from "react-native";

export default function AssetModal(props: {
  assetType: "video" | "image";
  onPress: () => void;
  asset: ProgressEntry | ProgressVideo;
}) {
  return (
    <Modal className="flex-1" presentationStyle="overFullScreen" transparent>
      <BlurView className="flex-1 justify-center items-center flex-col">
        <Pressable className="flex-1 w-full" onPress={props.onPress}>
          <View className="w-3/4 h-2/3 m-auto">
            <View>
              <Text className="text-xl text-center text-egoist-white font-semibold">
                {formatDate(props.asset.createdAt.split("T")[0])}
              </Text>

              {"currentWeight" in props.asset && (
                <Text className="text-xl text-center text-egoist-white font-semibold">
                  {props.asset.currentWeight} LBs
                </Text>
              )}
            </View>
            {props.assetType === "image" ? (
              <Image
                className="w-full h-4/5 my-auto object-cover rounded-xl"
                source={{
                  uri: props.asset.blobKey,
                }}
              />
            ) : (
              <Video
                source={{ uri: props.asset.blobKey }}
                className="w-full h-4/5 my-auto object-cover rounded-xl"
              />
            )}
          </View>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
