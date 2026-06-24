import PostForm from "@/components/blog/PostForm";

export default function EditPostPage({ params }: { params: { id: string } }) {
  return <PostForm postId={params.id} />;
}
