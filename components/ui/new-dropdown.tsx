import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import Separator from "./separator";

export default function NewDropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);

  return (
    <View className="relative">
      {/* Dropdown */}
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        className="flex flex-row justify-between items-center border border-white rounded-lg p-2 h-[50px] z-0"
      >
        <Text className="text-white text-lg">{value || "Placeholder"}</Text>
        <Feather name="chevron-down" size={24} color="white" />
      </Pressable>

      {/* Dropdown Items */}
      {open && (
        <ScrollView
          className="absolute left-0 right-0 top-14 bg-white rounded-lg z-[9999] space-y-4"
          contentContainerStyle={{ padding: 10 }}
        >
          {items.map((item) => (
            <View key={item.value} className="z-[40]">
              <Pressable
                onPress={() => {
                  //   setValue(item.label);
                  setOpen(false);
                }}
              >
                <Text className="text-black text-lg">{item.label}</Text>
              </Pressable>
              <Separator />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
