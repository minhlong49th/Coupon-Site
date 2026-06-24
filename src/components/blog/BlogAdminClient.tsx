'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PostStatus } from '@prisma/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { publishPostAction, deletePostAction } from '@/server/actions/blog';

const STATUS_LABEL: Record<PostStatus, string> = {
  DRAFT: 'Nháp',
  PUBLISHED: 'Đã đăng',
  SCHEDULED: 'Đặt lịch',
  ARCHIVED: 'Lưu trữ',
}

const STATUS_COLOR: Record<PostStatus, string> = {
  DRAFT: 'bg-amber-100 text-amber-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  SCHEDULED: 'bg-purple-100 text-purple-800',
  ARCHIVED: 'bg-gray-100 text-gray-600',
}

export default function BlogAdminClient({ initialData, page, search, status }: any) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const updateFilters = (newPage: number, newSearch: string, newStatus: string) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', newPage.toString());
    if (newSearch) params.set('search', newSearch);
    if (newStatus) params.set('status', newStatus);
    router.push(`/admin/blog?${params.toString()}`);
  }

  const handlePublish = async (id: string) => {
    setIsPending(true);
    await publishPostAction(id);
    setIsPending(false);
    router.refresh();
  }

  const handleDelete = async (id: string) => {
    if (confirm('Xóa bài viết này?')) {
      setIsPending(true);
      await deletePostAction(id);
      setIsPending(false);
      router.refresh();
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bài viết</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {initialData.total ?? 0} bài viết tổng cộng
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
        >
          <span>+</span> Bài viết mới
        </Link>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Tìm kiếm tiêu đề..."
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateFilters(1, e.currentTarget.value, status);
          }}
          className="border border-white/10 bg-[#1A1D26] text-white rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:border-violet-500"
        />
        <select
          value={status ?? ''}
          onChange={(e) => updateFilters(1, search, e.target.value)}
          className="border border-white/10 bg-[#1A1D26] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABEL).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#1A1D26] text-xs uppercase text-gray-500 border-b border-white/[0.06]">
            <tr>
              <th className="px-5 py-3">Tiêu đề</th>
              <th className="px-5 py-3">Loại</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Coupon</th>
              <th className="px-5 py-3">Ngày tạo</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {isPending ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">Đang tải...</td>
              </tr>
            ) : initialData.posts.map((post: any) => (
              <tr key={post.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="font-medium text-white line-clamp-1 max-w-xs">{post.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {post.categories?.map((c: any) => c.category.name).join(', ')}
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-400">
                  {post.contentType === 'RICH_TEXT' ? 'Rich text' : 'Markdown'}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${STATUS_COLOR[post.status as PostStatus]}`}>
                    {STATUS_LABEL[post.status as PostStatus]}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-400">
                  {post._count?.coupons > 0 ? <span className="text-violet-400">{post._count.coupons} mã</span> : '—'}
                </td>
                <td className="px-5 py-4 text-gray-400">
                  {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: vi })}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/${post.id}`} className="text-gray-400 hover:text-white px-2 py-1 rounded bg-white/[0.05] text-xs">Sửa</Link>
                    {post.status === 'DRAFT' && (
                      <button onClick={() => handlePublish(post.id)} className="text-green-500 hover:text-white px-2 py-1 rounded bg-green-500/10 hover:bg-green-500/20 text-xs">Đăng</button>
                    )}
                    {post.status === 'PUBLISHED' && (
                      <Link href={`/blog/${post.slug}`} target="_blank" className="text-gray-400 hover:text-white px-2 py-1 rounded bg-white/[0.05] text-xs">Xem</Link>
                    )}
                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-white px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-xs">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {initialData.posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">Chưa có bài viết nào.</td>
              </tr>
            )}
          </tbody>
        </table>

        {initialData.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06] bg-[#1A1D26]">
            <span className="text-sm text-gray-500">Trang {page} / {initialData.pages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => updateFilters(Math.max(1, page - 1), search, status)}
                disabled={page === 1}
                className="px-3 py-1.5 border border-white/10 rounded-lg text-sm text-gray-300 disabled:opacity-40"
              >
                ← Trước
              </button>
              <button
                onClick={() => updateFilters(Math.min(initialData.pages, page + 1), search, status)}
                disabled={page === initialData.pages}
                className="px-3 py-1.5 border border-white/10 rounded-lg text-sm text-gray-300 disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
