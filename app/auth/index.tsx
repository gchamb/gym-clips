import Button from "@/components/ui/button";
import EgoistView from "@/components/ui/egoist-view";
import Input from "@/components/ui/input";
import Separator from "@/components/ui/separator";
import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Auth() {
  const [hideImageCarousel, setHideImageCarousel] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <EgoistView>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 w-11/12 mx-auto"
      >
        {!hideImageCarousel && (
          <View className="w-[200px] bg-egoist-red h-[300px] mx-auto my-auto rounded-lg flex justify-center items-center">
            <Text className="text-white ">Carousel of Images Here</Text>
          </View>
        )}

        <View className="mt-auto mb-10 space-y-4">
          <Button text="Sign in with Google" />
          <View className="flex flex-row items-center">
            <Separator />
            <Text className="text-egoist-white text-lg px-4">or</Text>
            <Separator />
          </View>
          <View className="space-y-4">
            <View>
              <Input
                onFocus={() => setHideImageCarousel(true)}
                onBlur={() => setHideImageCarousel(false)}
                currentValue={email}
                onChangeText={(text) => setEmail(text)}
                previewText="Email"
              />
            </View>
            <View>
              <Input
                onFocus={() => setHideImageCarousel(true)}
                onBlur={() => setHideImageCarousel(false)}
                currentValue={email}
                secureTextEntry
                onChangeText={(text) => setEmail(text)}
                previewText="Password"
              />
            </View>
            <Button className="p-2" text="Sign In" />
            <Link href="/auth/signup">
              <Text className="text-center text-egoist-white underline">
                Create An Account
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </EgoistView>
  );
}
