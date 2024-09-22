import EgoistView from "./ui/egoist-view"
import {View, Image, Text} from "react-native"

export default function DontSupport(){
    return <EgoistView>
        <View className="w-11/12 mx-auto space-y-16">
        <View className={`mt-20 w-[150px] h-[150px] rounded-2xl  mx-auto justify-center items-center`}>
        <Image
          source={require("@/assets/images/egoist-logo.png")}
          className="w-full h-full"
        />
      </View>

      <View>
        <Text className="text-white text-4xl font-bold text-center">We don't support this device.</Text>
      </View>
        </View>
    </EgoistView>
}