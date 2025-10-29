'use client';

import type { Post } from "@/app/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

type PostCardProps = Omit<Post,"createdAt" | "updatedAt">;
export const PostCard = ({ id, title, content, author }: PostCardProps) => {
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{author}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};
