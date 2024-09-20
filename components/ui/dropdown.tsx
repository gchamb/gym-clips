import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import * as SelectPrimitive from "../primitives/select";
import { Option } from "./select";

export default function Dropdown({
  items,
  placeholder,
  onValueChanged,
}: {
  items: string[];
  placeholder: string;
  onValueChanged: (option: Option) => void;
}) {
  return (
    <SelectPrimitive.Root onValueChange={onValueChanged}>
      <SelectPrimitive.Trigger className="h-[62px] p-4 border  rounded-2xl border-white">
        <SelectPrimitive.Value
          className="text-xl text-white"
          placeholder={placeholder}
        />

        <View className="absolute right-4 top-4">
          <Feather name="chevron-down" color="white" size={24} />
        </View>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Overlay style={StyleSheet.absoluteFill}>
          <SelectPrimitive.Content className="bg-black w-full text-white w-11/12 mx-auto p-2 rounded-xl mt-2 ">
            <SelectPrimitive.Group className="max-h-[200px]">
              <ScrollView>
                {items.map((item, idx) => {
                  return (
                    <SelectPrimitive.Item
                      key={idx}
                      className="active:bg-egoist-red p-1 rounded"
                      label={item}
                      value={item}
                    >
                      <Text className="text-white text-lg">
                        {item}
                      </Text>
                      <SelectPrimitive.ItemIndicator />
                    </SelectPrimitive.Item>
                  );
                })}
              </ScrollView>
            </SelectPrimitive.Group>
          </SelectPrimitive.Content>
        </SelectPrimitive.Overlay>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
