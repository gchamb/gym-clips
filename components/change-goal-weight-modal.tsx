import sanitizedConfig from "@/config";
import Input from "./ui/input";
import Button from "./ui/button";

import { authAtom } from "@/stores/auth";
import { BlurView } from "expo-blur";
import { useAtom } from "jotai/react";
import { useState } from "react";
import { Modal, View, Text } from "react-native";

export default function ChangeGoalWeightModal(props: {
  onClose: () => void;
  onComplete?: () => void;
}) {
  const [authToken, setAuthAtom] = useAtom(authAtom);
  const [goalWeight, setGoalWeight] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      props.onComplete?.();

      clearState();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save goal weight"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearState = () => {
    setGoalWeight("");
    setError("");
    props.onClose();
  };

  return (
    <Modal transparent animationType="fade">
      <BlurView className="flex-1">
        <View className="bg-egoist-black w-11/12 h-1/3 m-auto rounded-2xl drop-shadow-2xl p-2 flex justify-evenly space-y-4">
          <Text className="text-egoist-white text-3xl font-semibold text-center">
            Goal Weight Change
          </Text>
          <View className="space-y-2">
            {error !== "" && (
              <Text className="text-sm text-red-600 text-center">{error}</Text>
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
  );
}
