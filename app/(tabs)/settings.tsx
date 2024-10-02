import Button from "@/components/ui/button";
import EgoistView from "@/components/ui/egoist-view";
import Input from "@/components/ui/input";
import sanitizedConfig from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";
import * as WebBrowser from "expo-web-browser";
import useUser from "@/hooks/useUser";
import BannerAd from "@/components/ui/banner-ad";

import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ActivityIndicator, Modal, Text, View } from "react-native";
import { useAtom } from "jotai/react";
import { authAtom } from "@/stores/auth";
import { skusTiers } from "@/types";
import { useState } from "react";
import { BlurView } from "expo-blur";

export default function Settings() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["customerInfo"],
    queryFn: () => Purchases.getCustomerInfo(),
  });
  const [authToken, setAuthAtom] = useAtom(authAtom);
  const [goalWeight, setGoalWeight] = useState("");
  const [openGoalWeightModal, setOpenGoalWeightModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { refetch: refetchUser } = useUser();

  const saveChangedGoalWeight = async () => {
    if (goalWeight === "") {
      setError("Must enter in a value");
      return;
    }

    const castedGoalWeight = parseInt(goalWeight);
    if (castedGoalWeight < 70 || castedGoalWeight > 500) {
      setError("Invalid goal weight");
      return;
    }

    try {
      setLoading(true);

      if (error !== "") {
        setError("");
      }

      const response = await fetch(
        `${sanitizedConfig.API_URL}/api/v1/user/update`,
        {
          method: "PATCH",
          body: JSON.stringify({ goal_weight: castedGoalWeight }),
          headers: {
            Authorization: `Bearer ${authToken?.jwt_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to save goal weight");
      }

      await refetchUser();

      clearState();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save goal weight"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);

      if (error !== "") {
        setError("");
      }

      const response = await fetch(`${sanitizedConfig.API_URL}/api/v1/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken?.jwt_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to delete account right now.");
      }

      setAuthAtom(null);
      clearState();
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete account right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearState = () => {
    setOpenDeleteModal(false);
    setGoalWeight("");
    setOpenGoalWeightModal(false);
    setError("");
  };

  if (isLoading || data === undefined) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }
  // data.activeSubscriptions = ["egoist_499_1m_lockedin", ""]; // for testing

  return (
    <EgoistView>
      {openGoalWeightModal && (
        <Modal transparent animationType="fade">
          <BlurView className="flex-1">
            <View className="bg-egoist-black w-11/12 h-1/3 m-auto rounded-2xl drop-shadow-2xl p-2 flex justify-evenly space-y-4">
              <Text className="text-egoist-white text-3xl font-semibold text-center">
                Goal Weight Change
              </Text>
              <View className="space-y-2">
                {error !== "" && (
                  <Text className="text-sm text-red-600 text-center">
                    {error}
                  </Text>
                )}
                <Input
                  keyboardType="numeric"
                  className="w-[100px] mx-auto text-center p-0 text-2xl text-egoist-white"
                  currentValue={goalWeight}
                  onChangeText={(text) => setGoalWeight(text)}
                  placeholder="115"
                />
              </View>
              <View className="space-y-2">
                <Button
                  className="p-2"
                  text="Save"
                  disabled={loading}
                  isLoading={loading}
                  onPress={saveChangedGoalWeight}
                />
                <Button
                  className="p-2"
                  text="Cancel"
                  disabled={loading}
                  onPress={() => clearState()}
                />
              </View>
            </View>
          </BlurView>
        </Modal>
      )}
      {openDeleteModal && (
        <Modal transparent animationType="fade">
          <BlurView className="flex-1">
            <View className="bg-egoist-black w-11/12 h-1/3 m-auto rounded-2xl drop-shadow-2xl p-2 flex justify-evenly space-y-4">
              <Text className="text-egoist-white text-3xl font-semibold text-center">
                Delete Account
              </Text>
              <View className="">
                {error !== "" && (
                  <Text className="text-sm text-red-600 text-center">
                    {error}
                  </Text>
                )}
              </View>
              <View className="space-y-2">
                <Button
                  className="p-2"
                  text="Delete"
                  disabled={loading}
                  isLoading={loading}
                  onPress={deleteAccount}
                />
                <Button
                  className="p-2"
                  text="Cancel"
                  disabled={loading}
                  onPress={() => clearState()}
                />
              </View>
            </View>
          </BlurView>
        </Modal>
      )}
      <View className="w-11/12 mx-auto flex-1">
        <View className="mt-8">
          <Text className="text-4xl text-egoist-white font-semibold">Plan</Text>
          {data.activeSubscriptions.length > 0 ? (
            <View className="space-y-8">
              {data.activeSubscriptions.map((sku, index) => {
                if (index > 0) {
                  return <></>;
                }

                return (
                  <Text
                    key={sku}
                    className="text-2xl text-egoist-red font-bold"
                  >
                    {skusTiers[sku]}
                  </Text>
                );
              })}
              <View className="flex flex-row space-x-4">
                <Feather name="check" color="#A91D3A" size={32} />
                <Text className="text-egoist-white text-lg">
                  Daily Progress Check In
                </Text>
              </View>
              <View className="flex flex-row space-x-4">
                <Feather name="check" color="#A91D3A" size={32} />
                <Text className="text-egoist-white text-lg">
                  Weekly Progress Videos
                </Text>
              </View>
              {/* <View className="flex flex-row space-x-4">
                <Feather name="check" color="#A91D3A" size={32} />
                <Text className="text-egoist-white text-lg">
                  Weekly Progress Reports
                </Text>
              </View> */}
              <View className="flex flex-row space-x-4">
                <Feather name="check" color="#A91D3A" size={32} />
                <Text className="text-egoist-white text-lg">No Ads</Text>
              </View>
            </View>
          ) : (
            <View className="space-y-2">
              <Text className="text-xl text-egoist-red">
                Take Your Progress Seriously
              </Text>
              <View className="border border-egoist-white p-4 rounded-xl space-y-4">
                <View className="flex flex-row space-x-4">
                  <Feather name="check" color="#A91D3A" size={32} />
                  <Text className="text-egoist-white text-lg">
                    Daily Progress Check In
                  </Text>
                </View>
                <View className="flex flex-row space-x-4">
                  <Feather name="check" color="#A91D3A" size={32} />
                  <Text className="text-egoist-white text-lg">
                    Weekly Progress Videos
                  </Text>
                </View>
                {/* <View className="flex flex-row space-x-4">
                  <Feather name="check" color="#A91D3A" size={32} />
                  <Text className="text-egoist-white text-lg">
                    Weekly Progress Reports
                  </Text>
                </View> */}
                <View className="flex flex-row space-x-4">
                  <Feather name="check" color="#A91D3A" size={32} />
                  <Text className="text-egoist-white text-lg">No Ads</Text>
                </View>
                <View>
                  <Button
                    className="p-2"
                    text="Get Started"
                    onPress={() => router.push("/(others)/paywall")}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        <View className="mt-4 space-y-4">
          <Button
            className="p-4"
            text="Change Goal Weight"
            onPress={() => setOpenGoalWeightModal(true)}
          />

          <Button
            className="p-4"
            text="Share Feedback"
            onPress={async () =>
              await WebBrowser.openBrowserAsync(
                "https://56jxitzk3oy.typeform.com/to/SkxsvrBh"
              )
            }
          />
          <Button
            className="p-4"
            text="Logout"
            onPress={async () => {
              setAuthAtom(null);
              await AsyncStorage.clear();
              router.replace("/");
            }}
          />
          <Button
            className="p-0 h-10 bg-transparent"
            textClass="text-sm "
            text="Delete Account"
            onPress={() => setOpenDeleteModal(true)}
          />
        </View>
      </View>
      <BannerAd />
    </EgoistView>
  );
}
