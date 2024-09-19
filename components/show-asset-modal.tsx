import Video from "react-native-video";
import { formatDate } from "@/lib/helpers";
import { ProgressEntry, ProgressVideo } from "@/types";
import { BlurView } from "expo-blur";
import {
  Modal,
  Pressable,
  View,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";

export default function AssetModal(props: {
  assetType: "video" | "image";
  onPress: () => void;
  asset: ProgressEntry | ProgressVideo;
}) {
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [errorAsset, setErrorAsset] = useState("");
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
            {loadingAsset && (
              <View className="w-full h-4/5 my-auto flex-1  rounded-xl items-center justify-center">
                <ActivityIndicator size="large" />
              </View>
            )}
            {errorAsset !== "" && (
              <View className="w-full h-4/5 my-auto flex-1  rounded-xl items-center justify-center">
                <Text className="text-xl text-red-600 font-semibold">
                  {errorAsset}
                </Text>
              </View>
            )}
            {props.assetType === "image" ? (
              <Image
                className={`w-full h-4/5 my-auto object-cover rounded-xl ${
                  (loadingAsset || errorAsset !== "") && "hidden"
                }`}
                source={{
                  uri: props.asset.blobKey,
                }}
                onLoadStart={() => setLoadingAsset(true)}
                onLoadEnd={() => setLoadingAsset(false)}
                onError={() => setErrorAsset("Unable to load asset.")}
              />
            ) : (
              <Video
                source={{ uri: props.asset.blobKey }}
                className={`w-full h-4/5 my-auto object-cover rounded-xl ${
                  (loadingAsset || errorAsset !== "") && "hidden"
                }`}
                onLoadStart={() => setLoadingAsset(true)}
                onLoad={() => setLoadingAsset(false)}
                onError={() => setErrorAsset("Unable to load asset.")}
              />
            )}
          </View>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
