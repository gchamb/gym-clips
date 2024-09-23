import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { AuthTokens } from "@/types";
// AsyncStorage.clear();

const storage = createJSONStorage<AuthTokens>(() => AsyncStorage);
export const authAtom = atomWithStorage<AuthTokens>(
  "auth_tokens",
  null,
  storage,
  {
    getOnInit: true,
  }
);
