import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthTokens } from "@/types";

const storage = createJSONStorage<AuthTokens>(() => AsyncStorage);
export const authAtom = atomWithStorage<AuthTokens>(
  "auth_tokens",
  null,
  storage,
  {
    getOnInit: true,
  }
);
