import BlogAdminClient from "@/components/blog/BlogAdminClient";
import { listPosts } from "@/server/actions/blog";

export default async function BlogAdminPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const status = searchParams.status || "";

  const data = await listPosts(page, 20, status as any, search);

  return <BlogAdminClient initialData={data} page={page} search={search} status={status} />;
}
