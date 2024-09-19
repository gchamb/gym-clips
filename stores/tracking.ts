import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

const trackingStorage = createJSONStorage<boolean>(() => AsyncStorage);
export const trackingAtom = atomWithStorage<boolean>(
  "tracking",
  false,
  trackingStorage,
  {
    getOnInit: true,
  }
);

const majorInteractionsStorage = createJSONStorage<number>(() => AsyncStorage);
export const majorInteractionsAtom = atomWithStorage<number>(
  "major_interactions",
  0,
  majorInteractionsStorage,
  {
    getOnInit: true,
  }
);
