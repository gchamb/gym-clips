import EmailSubmit from "@/components/email-submit";
import EgoistView from "@/components/ui/egoist-view";
import { useState } from "react";
import { KeyboardAvoidingView, View, Image, Dimensions } from "react-native";

export default function SignUp() {
  const [hideLogo, setHideLogo] = useState(false);
  const width = Dimensions.get("screen").width
  
  return (
    <EgoistView>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 w-11/12 mx-auto space-y-20"
      >
        {!hideLogo ? <View className="mt-20 w-[150px] rounded-2xl h-[150px] mx-auto  justify-center items-center">
          <Image
            source={require("@/assets/images/egoist-logo.png")}
            className="w-full h-full"
          />
        </View> : <View></View>}
        

        <View>
          <EmailSubmit type="Sign up" onFocus={() => {
            if (width <= 375) {
              setHideLogo(true)
            }
          }} onBlur={() => {
            if (width <= 375) {
              setHideLogo(false)
            }
          }} />
        </View>
      </KeyboardAvoidingView>
    </EgoistView>
  );
}
