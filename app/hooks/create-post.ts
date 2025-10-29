'use client';
import { useMutation } from "@tanstack/react-query";
import { useInvalidatePost } from "./use-invalidate-post";

interface UseCreatePostProps {
  onSuccess: () => void;
}

export const useCreatePost = ({ onSuccess }: UseCreatePostProps) => {
  const invalidatePost = useInvalidatePost();
  return useMutation({
    mutationFn: async (post: { title: string, content: string, author: string }) => {
      const response = await fetch("/api/post", {
        method: "POST",
        body: JSON.stringify(post),
      });
      const data = await response.json();
      return data;
    },
    onSuccess: async () => {
      invalidatePost()
      onSuccess?.();
    },
  });
};