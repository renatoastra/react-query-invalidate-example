import  { useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../query-keys";
import { useCallback } from "react";

export const useInvalidatePost = () => {
  const queryClient = useQueryClient();
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
  }, [queryClient]);
  return invalidate;
};
