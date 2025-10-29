
import { CreatePostModal } from "@/components/create-post-modal";
import { PostList } from "@/components/post-list";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col  justify-start py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full flex justify-between mb-10">
        <h1 className="text-4xl font-bold">Gebra Blog</h1>
          <CreatePostModal />
        </div>
        <PostList />
      </main>
    </div>
  );
}
