'use client';
import { useQueryPost } from "@/app/hooks/query-post";
import { PostCard } from "../post-card";

export const PostList = () => {
  const { data, isLoading, error } = useQueryPost();
;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
};
