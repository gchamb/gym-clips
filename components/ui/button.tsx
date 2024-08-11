import {
  TouchableOpacity,
  Text,
  PressableProps,
  Pressable,
} from "react-native";

interface MyButtonProps extends PressableProps {
  text: string;
  textClass?: string;
}

export default function Button(props: MyButtonProps) {
  return (
    <Pressable
      className={`flex justify-center items-center rounded-xl bg-egoist-red p-8 active:scale-95`}
      {...props}
    >
      <Text className="text-white text-2xl font-bold">{props.text}</Text>
    </Pressable>
  );
}
