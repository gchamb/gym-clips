import { ReactNode } from "react";
import { SafeAreaView } from "react-native";

export default function EgoistView(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <SafeAreaView className={`flex-1 bg-egoist-black ${props.className}`}>
      {props.children}
    </SafeAreaView>
  );
}
