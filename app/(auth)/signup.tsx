import EmailSubmit from "@/components/email-submit";
import EgoistView from "@/components/ui/egoist-view";
import { KeyboardAvoidingView, View, Image } from "react-native";

export default function SignUp() {
  return (
    <EgoistView>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 w-11/12 mx-auto space-y-20"
      >
        <View className="mt-20 w-[150px] rounded-2xl h-[150px] mx-auto  justify-center items-center">
          <Image
            source={require("@/assets/images/egoist-logo.png")}
            width={150}
            height={150}
          />
        </View>

        <View>
          <EmailSubmit type="Sign up" />
        </View>
      </KeyboardAvoidingView>
    </EgoistView>
  );
}
