import { useRef, useState } from "react";
import { Text, View, TextInput, TextInputProps } from "react-native";

interface MyTextInputProps extends TextInputProps {
  currentValue: string;
  previewText?: string;
}

export default function Input(props: MyTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput | null>();
  return (
    <View className="relative h-[70px]">
      <TextInput
        ref={(ref) => {
          if (ref === null) return;
          inputRef.current = ref;
        }}
        className="border-egoist-white border h-full rounded-xl pl-4 z-[10]"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {!isFocused && props.currentValue.trim() === "" && (
        <Text className="absolute text-egoist-white z-[0] left-4 top-5 text-xl">
          {props.previewText}
        </Text>
      )}
    </View>
  );
}
