import type { Post } from "@/app/types";


const items: Post[] = [];

const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = (Number(page) - 1) * Number(limit);
  const posts = items.slice(offset, offset + limit);

  const responseWithPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(posts);
    }, 1000);
  });
  return new Response(JSON.stringify(await responseWithPromise));
};

const POST = async (request: Request) => {
  const body = await request.json();
  const post: Post = {
    id: crypto.randomUUID(),
    title: body.title,
    content: body.content,
    author: body.author,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  items.push(post);
  const responseWithPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(post);
    }, 1000);
  });
  
  return new Response(JSON.stringify(await responseWithPromise), {
    status: 201,
  });
};

export { GET, POST };