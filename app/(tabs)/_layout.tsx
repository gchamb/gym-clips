import { router, Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#A91D3A",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#64748B",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused }) => {
            return (
              <Feather
                size={28}
                name="home"
                color={`${focused ? "white" : "#64748b"}`}
              />
            );
          },
          headerLeft: () => {
            return (
              <View className="pl-6">
                <Image
                  className="w-[75px] h-[75px]"
                  source={require("@/assets/images/egoist-letter.png")}
                />
              </View>
            );
          },
          headerRight: () => {
            return (
              <View className="pr-6">
                <Pressable
                  className="active:scale-95"
                  onPress={() => router.push("/(others)/daily-entry")}
                >
                  <Feather color="#A91D3A" name="plus" size={28} />
                </Pressable>
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
}
