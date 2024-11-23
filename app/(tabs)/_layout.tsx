import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

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
