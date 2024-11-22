import useUser from "@/hooks/useUser";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

export default function TabsLayout() {
  const { isLoading, data } = useUser();
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
              <View className="pr-8">
                <Text className="text-egoist-white text-xl font-bold">
                  {isLoading ? "Loading..." : `${data?.goalWeight ?? 0} lbs`}
                </Text>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="home2"
        options={{
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused }) => {
            return (
              <Feather
                size={28}
                name="anchor"
                color={`${focused ? "white" : "#64748b"}`}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="entry"
        options={{
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused }) => {
            return (
              <Feather
                size={28}
                name="plus"
                color={`${focused ? "white" : "#64748b"}`}
              />
            );
          },
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused }) => {
            return (
              <Feather
                size={28}
                name="settings"
                color={`${focused ? "white" : "#64748b"}`}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
