import { View } from "react-native";

export default function Separator(props: { className?: string }) {
  return (
    <View
      className={`flex-1 border-b opacity-50 border-white ${props.className}`}
    ></View>
  );
}
