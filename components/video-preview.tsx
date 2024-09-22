import { Months } from "@/lib/helpers";
import { majorInteractionsAtom } from "@/stores/tracking";
import { ProgressVideo } from "@/types";
import { useSetAtom } from "jotai/react";
import { Pressable, View, Text, Dimensions } from "react-native";

export default function VideoPreview({
  item,
  onPress,
  color,
  makeLarge
}: {
  item: ProgressVideo;
  onPress: () => void;
  color: "red" | "white";
  makeLarge?:true
}) {
  const dateSplit = item.createdAt.split("T")[0].split("-");
  const month = Months[parseInt(dateSplit[1]) - 1];
  const date =
    item.frequency === "monthly"
      ? `Month of ${month}`
      : `Week of ${month} ${dateSplit[2]}`;
  const width = Dimensions.get("screen").width
  const setMajorInteractions = useSetAtom(majorInteractionsAtom);

  return (
    <Pressable
      onPress={() => {
        setMajorInteractions(async (prev) => {
          return (await prev) + 1;
        });

        onPress();
      }}
    >
      <View
        className={`bg-egoist-${color} ${width > 400 || makeLarge ? 'w-[175px] h-[175px]' : 'w-[130px] h-[130px]'} rounded-xl flex justify-center m-1`}
      >
        <Text
          className={`${width > 400 || makeLarge ? 'text-3xl' : 'text-2xl'} p-2 font-semibold text-${
            color === "white" ? "black" : "egoist-white"
          }`}
        >
          {date}
        </Text>
      </View>
    </Pressable>
  );
}
