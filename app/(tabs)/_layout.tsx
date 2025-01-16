import Ionicons from "@expo/vector-icons/Ionicons";
import Purchases from "react-native-purchases";
import { router, Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";

export default function TabsLayout() {

  useEffect(() => {
    const checkPaywall = async () => {
      const purchases = await Purchases.getCustomerInfo();
      if (purchases.activeSubscriptions.length === 0) {
        router.replace("/paywall?nextScreen=home&displayCloseButton=false");
      }
    };
    checkPaywall();
  }, []);
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
        name="show-all-assets"
        options={{
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused }) => {
            return (
              <Feather
                size={28}
                name="file"
                color={`${focused ? "white" : "#64748b"}`}
              />
            );
          },
          unmountOnBlur: true,
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
        name="inspiration"
        options={{
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name="sparkles-outline"
                size={28}
                color={`${focused ? "white" : "#64748b"}`}
              />
            );
          },
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
