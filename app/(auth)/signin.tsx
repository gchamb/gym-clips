import * as Sentry from "@sentry/react-native";
import * as AppleAuthentication from "expo-apple-authentication";

import Button from "@/components/ui/button";
import EgoistView from "@/components/ui/egoist-view";
import Separator from "@/components/ui/separator";
import EmailSubmit from "@/components/email-submit";
import sanitizedConfig from "@/config";
import Purchases from "react-native-purchases";
import { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Text,
  View,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useSetAtom } from "jotai/react";
import { authAtom } from "@/stores/auth";
import { router } from "expo-router";
import { AuthTokens } from "@/types";
// import Carousel from "react-native-reanimated-carousel";
import { trackEvent } from "@aptabase/react-native";

GoogleSignin.configure({
  webClientId:
    "491718666551-eo0utlq6sl7e92ahr9tnhmelv8e1c7b1.apps.googleusercontent.com",
  iosClientId:
    "491718666551-0idqorsrddrqi82rt5e6q6ioonaeptid.apps.googleusercontent.com",
  offlineAccess: true,
});

export default function Auth() {
  const [hideImageCarousel, setHideImageCarousel] = useState(false);

  const setAuthTokens = useSetAtom(authAtom);

  const signInWithGoogle = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the user auth code
      const { serverAuthCode } = await GoogleSignin.signIn();

      if (serverAuthCode === null) {
        throw new Error("Authorization code wasn't created.");
      }

      // validate and call to our backend
      const endpoint = `${sanitizedConfig.API_URL}/api/v1/auth/google`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: serverAuthCode,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to sign in with google.");
      }

      const authRes = (await response.json()) as NonNullable<AuthTokens>;

      setAuthTokens(authRes);

      await Purchases.logIn(authRes.uid);

      trackEvent("sign_in", { method: "google" });

      if (authRes.is_onboarded) {
        router.replace("/home");
      } else {
        router.replace("/(auth)/onboarding");
      }
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = credential;

      if (identityToken === null) {
        throw new Error("identity Token wasn't created.");
      }

      // validate and call to our backend
      const endpoint = `${sanitizedConfig.API_URL}/api/v1/auth/apple`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: identityToken,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to sign in with apple.");
      }

      const authRes = (await response.json()) as NonNullable<AuthTokens>;

      setAuthTokens(authRes);

      await Purchases.logIn(authRes.uid);

      trackEvent("sign_in", { method: "apple" });

      if (authRes.is_onboarded) {
        router.replace("/home");
      } else {
        router.replace("/(auth)/onboarding");
      }
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  return (
    <EgoistView>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 w-11/12 mx-auto"
      >
        {!hideImageCarousel && (
          <View className="my-auto w-[125px] rounded-2xl h-[125px] mx-auto  justify-center items-center">
            <Image
              source={require("@/assets/images/egoist-logo.png")}
              className="w-full h-full"
            />
          </View>
        )}

        <View className="my-auto space-y-4">
          <Button onPress={signInWithGoogle} text="Sign in with Google" />
          <Button onPress={signInWithApple} text="Sign in with Apple" />
          <View className="flex flex-row items-center pb-4">
            <Separator />
            <Text className="text-egoist-white text-lg px-4">or</Text>
            <Separator />
          </View>

          <EmailSubmit
            type="Sign in"
            onBlur={() => setHideImageCarousel(false)}
            onFocus={() => setHideImageCarousel(true)}
          />
        </View>
      </KeyboardAvoidingView>
    </EgoistView>
  );
}
