import Button from "@/components/ui/button";
import EgoistView from "@/components/ui/egoist-view";
import sanitizedConfig from "@/config";
import useUser from "@/hooks/useUser";
import { authAtom } from "@/stores/auth";
import { captureException } from "@sentry/react-native";
import { useAtomValue } from "jotai/react";
import { useState } from "react";
import { Text, View, Image, ActivityIndicator, Pressable } from "react-native";

export default function Inspiration() {
  const authToken = useAtomValue(authAtom);
  const { data, refetch } = useUser();

  const [loading, setLoading] = useState(false);

  const handleConsentUpdate = async () => {
    if (data === undefined || data === null) {
      return;
    }
    console.log(data);
    try {
      setLoading(true);
      await fetch(`${sanitizedConfig.API_URL}/api/v1/user/update`, {
        method: "PATCH",
        body: JSON.stringify({
          inspiration_consent: !data.inspirationConsent,
        }),
        headers: {
          Authorization: `Bearer ${authToken?.jwt_token}`,
        },
      });

      await refetch();
    } catch (err) {
      captureException(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EgoistView>
      <View className="w-11/12 mx-auto space-y-24">
        <View className="space-y-2">
          <View className="mt-8 space-y-4">
            <View className="w-[75px] rounded-2xl h-[75px] mx-auto">
              <Image
                source={require("@/assets/images/egoist-logo.png")}
                className="w-full h-full"
              />
            </View>
          </View>
          <View>
            <Text className="text-6xl font-bold text-white text-center z-[20]">
              INSPIRE
            </Text>
            <Text className="m-[-36px] text-6xl font-bold text-egoist-red text-center">
              INSPIRE
            </Text>
          </View>
          <Text className="text-2xl text-white text-center">
            coming soon....
          </Text>
        </View>

        <View className="space-y-8">
          <View>
            <Text className="text-xl text-white mx-auto text-center">
              Consent to showing your
            </Text>
            <Text className="text-xl text-white mx-auto text-center">
              progress videos to{" "}
              <Text className="text-egoist-red font-bold underline">
                inspire others
              </Text>
            </Text>
          </View>

          <View className="space-y-6">
            <Pressable
              className={`p-4 w-2/3 mx-auto rounded-lg ${
                data?.inspirationConsent || loading
                  ? "bg-slate-700"
                  : "bg-egoist-red"
              }`}
              disabled={data?.inspirationConsent || loading}
              onPress={handleConsentUpdate}
            >
              {loading && <ActivityIndicator />}
              <Text
                className={`font-semibold text-lg text-center ${
                  data?.inspirationConsent || loading
                    ? "text-slate-400"
                    : "text-egoist-white"
                }`}
              >
                {!loading && (
                  <>
                    {data?.inspirationConsent && !loading
                      ? "CONSENTED"
                      : "I CONSENT"}
                  </>
                )}
              </Text>
            </Pressable>
            <Text className="text-center text-white text-xs">
              you’ll be able to remove consent at any time
            </Text>
          </View>
        </View>
      </View>
    </EgoistView>
  );
}
