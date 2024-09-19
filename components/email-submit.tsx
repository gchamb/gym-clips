import Button from "./ui/button";
import Input from "./ui/input";
import sanitizedConfig from "@/config";
import Purchases from "react-native-purchases";
import { View, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link, router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { authFormSchema } from "@/types/schemas";
import { AuthSchema, AuthTokens } from "@/types";
import { authAtom } from "@/stores/auth";
import { useSetAtom } from "jotai/react";
import { useState } from "react";

type EmailSubmitProps = {
  type: "Sign in" | "Sign up";
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
};

export default function EmailSubmit(props: EmailSubmitProps) {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<AuthSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(authFormSchema),
  });
  const setAuthTokens = useSetAtom(authAtom);
  const [loading, setLoading] = useState(false);

  const handleEmailFlow = async (fields: AuthSchema) => {
    try {
      setLoading(true);
      // validate and call to our backend
      const formType = props.type.toLowerCase().split(" ").join("");

      const endpoint = `${sanitizedConfig.API_URL}/api/v1/auth/${formType}`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        throw new Error("Invalid Email or Password");
      }

      const authRes = (await response.json()) as NonNullable<AuthTokens>;

      setAuthTokens(authRes);

      await Purchases.logIn(authRes.uid);

      if (authRes.is_onboarded) {
        router.replace("/home");
      } else {
        router.replace("/(auth)/onboarding");
      }
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={`space-y-4 ${props.className}`}>
      {errors.root?.message && (
        <Text className="text-xs text-red-700 text-center">
          {errors.root.message}
        </Text>
      )}
      <View className="space-y-2">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-egoist-white text-lg"
              onFocus={() => {
                props.onFocus?.();
              }}
              onBlur={() => {
                onBlur();
                props.onBlur?.();
              }}
              currentValue={value}
              onChangeText={onChange}
              previewText="Email"
            />
          )}
          name="email"
        />
        {errors.email?.message && (
          <Text className="text-xs text-red-700">{errors.email.message}</Text>
        )}
      </View>
      <View className="space-y-2">
        <Controller
          control={control}
          name="password"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-egoist-white text-lg"
              onFocus={() => {
                props.onFocus?.();
              }}
              onBlur={() => {
                onBlur();
                props.onBlur?.();
              }}
              currentValue={value}
              secureTextEntry
              onChangeText={onChange}
              previewText="Password"
            />
          )}
        />
        {errors.password?.message && (
          <Text className="text-xs text-red-700">
            {errors.password.message}
          </Text>
        )}
      </View>
      <Button
        className="p-2"
        text={props.type}
        onPress={handleSubmit(handleEmailFlow)}
        disabled={loading}
        isLoading={loading}
      />
      {props.type === "Sign in" ? (
        <Link href="/signup">
          <Text className="text-center text-egoist-white underline">
            Create An Account
          </Text>
        </Link>
      ) : (
        <Link href="/signin">
          <Text className="text-center text-egoist-white underline">
            Already have an account
          </Text>
        </Link>
      )}
    </View>
  );
}
