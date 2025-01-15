import { ReactNode } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { usePathname } from "expo-router";

const excludePaths = ["/show-all-assets", "/"]

export default function EgoistView(props: {
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <SafeAreaView className={`flex-1 bg-egoist-black ${props.className}`}>
      {!excludePaths.includes(pathname) ? <ScrollView>{props.children}</ScrollView>: <>{props.children}</>}
    </SafeAreaView>
  );
}
