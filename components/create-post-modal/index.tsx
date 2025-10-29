'use client';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { useCreatePost } from "@/app/hooks/create-post"
import { useState } from "react"

export function CreatePostModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState('Renato');

  const onSuccess = () => {
    setOpen(false);
    setTitle("");
    setContent("");
    setAuthor('Renato');
  };
  const { mutate: createPost, isPending } = useCreatePost({ onSuccess });

  const handleCreatePost = () => {
    createPost({ title, content, author });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button>Create Post</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>
              Create a new post with your favorite content. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input onChange={(e) => setTitle(e.target.value)} id="title" name="title" defaultValue="" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="content">Content</Label>
              <Textarea onChange={(e) => setContent(e.target.value)} id="content" name="content" defaultValue="" rows={10} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="author">Author</Label>
              <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              id="author"
              name="author"
              defaultValue=""
              disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
            onClick={handleCreatePost}
            type="submit" disabled={isPending}>{isPending ? 'Creating...' : 'Create Post'}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
