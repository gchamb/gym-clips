import { getUserData } from "@/lib/query-functions";
import { authAtom } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai/react";

export default function useUser() {
  const authTokens = useAtomValue(authAtom);
  return useQuery({
    queryKey: ["getUserData"],
    queryFn: () => getUserData(authTokens),
  });
}
