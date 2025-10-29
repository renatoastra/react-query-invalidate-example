'use client';
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import QUERY_KEYS from "../query-keys";
import type { Post } from "../types";

export const useQueryPost = (): UseQueryResult<Post[], Error> => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: async () => {
      const response = await fetch("/api/post");
      const data = await response.json();
      return data;
    },
  });
};