import Button from "@/components/ui/button";
import EgoistView from "@/components/ui/egoist-view";
import Input from "@/components/ui/input";
import Separator from "@/components/ui/separator";
import { Link } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Text,
  View,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  iosClientId:
    "491718666551-0idqorsrddrqi82rt5e6q6ioonaeptid.apps.googleusercontent.com",
});

export default function Auth() {
  const [hideImageCarousel, setHideImageCarousel] = useState(false);
  const [email, setEmail] = useState("");
  const [images, _] = useState([
    require("@/assets/images/carousel/lee-priest.jpg"),
    require("@/assets/images/carousel/arnold.jpeg"),
    require("@/assets/images/carousel/chris-1.webp"),
  ]);

  return (
    <EgoistView>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 w-11/12 mx-auto"
      >
        {!hideImageCarousel && (
          // need to make this better because this sucks
          <FlatList
            className="w-[200px] mx-auto my-auto rounded-lg"
            horizontal
            showsHorizontalScrollIndicator={false}
            data={images}
            renderItem={({ item, index }) => (
              <View className="w-[200px] bg-egoist-red h-[300px] mx-auto my-auto rounded-lg flex justify-center items-center">
                <Image
                  key={index}
                  className="rounded-lg"
                  source={item}
                  style={{
                    width: "100%",
                    height: "100%",

                    objectFit: "cover",
                  }}
                />
              </View>
            )}
          ></FlatList>
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
            <Link href="/auth">
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
