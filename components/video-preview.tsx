import { Months } from "@/lib/helpers";
import { ProgressVideo } from "@/types";
import { Pressable, View, Text } from "react-native";

export default function VideoPreview({
  item,
  onPress,
  color,
}: {
  item: ProgressVideo;
  onPress: () => void;
  color: "red" | "white";
}) {
  const dateSplit = item.createdAt.split("T")[0].split("-");
  const month = Months[parseInt(dateSplit[1]) - 1];
  const date =
    item.frequency === "monthly"
      ? `Month of ${month}`
      : `Week of ${month} ${dateSplit[2]}`;

  return (
    <Pressable onPress={onPress}>
      <View
        className={`bg-egoist-${color} w-[175px] h-[175px] rounded-xl flex justify-center m-1`}
      >
        <Text
          className={`text-3xl p-2 font-semibold text-${
            color === "white" ? "black" : "egoist-white"
          }`}
        >
          {date}
        </Text>
      </View>
    </Pressable>
  );
}