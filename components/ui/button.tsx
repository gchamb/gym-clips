import {
  Text,
  PressableProps,
  Pressable,
  ActivityIndicator,
} from "react-native";

interface MyButtonProps extends PressableProps {
  text: string;
  textClass?: string;
  isLoading?: boolean;
}

export default function Button(props: MyButtonProps) {
  return (
    <Pressable
      className={`flex flex-row space-x-4 justify-center items-center rounded-xl bg-egoist-red p-8 active:scale-95`}
      {...props}
    >
      <Text
        className={`text-white text-2xl font-bold ${
          props.isLoading && "text-slate-500"
        } ${props.textClass}`}
      >
        {props.text}
      </Text>

      {props.isLoading && <ActivityIndicator size="small" />}
    </Pressable>
  );
}
