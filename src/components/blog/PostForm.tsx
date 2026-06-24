'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostStatus, ContentType } from '@prisma/client';
import TiptapEditor from './TiptapEditor';
import MarkdownEditor from './MarkdownEditor';
import CouponPicker from './CouponPicker';
import BrandPicker from './BrandPicker';
import SeoPanel from './SeoPanel';
import slugify from 'slugify';
import { createPostAction, updatePostAction, getPostById } from '@/server/actions/blog';

type SidebarTab = 'general' | 'links' | 'seo';

export default function PostForm({ postId }: { postId?: string }) {
  const router = useRouter();
  const isEdit = !!postId;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('RICH_TEXT');
  const [content, setContent] = useState<any>(null);
  const [excerpt, setExcerpt] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [status, setStatus] = useState<PostStatus>('DRAFT');
  const [publishedAt, setPublishedAt] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [couponIds, setCouponIds] = useState<Array<{ couponId: string; position?: number; note?: string }>>([]);
  const [brandIds, setBrandIds] = useState<Array<{ brandId: string; isPrimary: boolean }>>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [activeTab, setActiveTab] = useState<SidebarTab>('general');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit && postId) {
      getPostById(postId).then(existingPost => {
        if (existingPost) {
          setTitle(existingPost.title);
          setSlug(existingPost.slug);
          setSlugManuallyEdited(true);
          setContentType(existingPost.contentType);
          setContent(existingPost.content);
          setExcerpt(existingPost.excerpt ?? '');
          setThumbnail(existingPost.thumbnailUrl ?? '');
          setStatus(existingPost.status);
          setPublishedAt(existingPost.publishedAt ? new Date(existingPost.publishedAt).toISOString().slice(0, 16) : '');
          setCategoryIds(existingPost.categories.map(c => c.categoryId));
          setTagIds(existingPost.tags.map(t => t.tagId));
          setCouponIds(existingPost.coupons.map(c => ({ couponId: c.couponId, position: c.position ?? undefined, note: c.note ?? undefined })));
          setBrandIds(existingPost.brands.map(b => ({ brandId: b.brandId, isPrimary: b.isPrimary })));
          setSeoTitle(existingPost.seoTitle ?? '');
          setSeoDesc(existingPost.seoDesc ?? '');
        }
      });
    }
  }, [isEdit, postId]);

  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(slugify(title, { lower: true, strict: true, locale: 'vi' }));
    }
  }, [title, slugManuallyEdited]);

  const handleSave = async (saveStatus?: PostStatus) => {
    setIsSaving(true);
    const finalStatus = saveStatus ?? status;
    const payload = {
      title, slug, content, contentType,
      excerpt: excerpt || undefined,
      thumbnailUrl: thumbnail || undefined,
      status: finalStatus,
      publishedAt: publishedAt || undefined,
      seoTitle: seoTitle || undefined,
      seoDesc: seoDesc || undefined,
      categoryIds, tagIds, couponIds, brandIds,
    };

    if (isEdit) {
      await updatePostAction({ id: postId, ...payload });
    } else {
      await createPostAction(payload);
    }
    setIsSaving(false);
    router.push('/admin/blog');
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full bg-[#080B10] text-white overflow-hidden absolute inset-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0F1117] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin/blog')} className="text-gray-400 hover:text-white">← Quay lại</button>
          <h1 className="text-lg font-semibold">{isEdit ? 'Chỉnh sửa bài viết' : 'Bài viết mới'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSave('DRAFT')} disabled={isSaving} className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/[0.05] disabled:opacity-50">Lưu nháp</button>
          <button onClick={() => handleSave('PUBLISHED')} disabled={isSaving || !title} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50">{isSaving ? 'Đang lưu...' : 'Đăng bài'}</button>
        </div>
      </div>

      <div className="flex flex-1 gap-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <input type="text" placeholder="Tiêu đề bài viết..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-3xl font-bold border-none outline-none placeholder-gray-600 mb-2 bg-transparent text-white" />
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500">URL:</span>
            <input type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugManuallyEdited(true); }} className="text-xs text-violet-400 border-b border-dashed border-violet-500/50 outline-none bg-transparent flex-1 max-w-xs" />
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setContentType('RICH_TEXT')} className={`text-xs px-3 py-1.5 rounded border transition-colors ${contentType === 'RICH_TEXT' ? 'bg-violet-600 border-violet-600 text-white' : 'text-gray-400 border-white/10 hover:bg-white/[0.05]'}`}>Rich Text</button>
            <button onClick={() => setContentType('MARKDOWN')} className={`text-xs px-3 py-1.5 rounded border transition-colors ${contentType === 'MARKDOWN' ? 'bg-violet-600 border-violet-600 text-white' : 'text-gray-400 border-white/10 hover:bg-white/[0.05]'}`}>Markdown</button>
          </div>

          <div className="bg-[#1A1D26] rounded-xl border border-white/10 overflow-hidden">
             {contentType === 'RICH_TEXT' ? <TiptapEditor content={content} onChange={setContent} /> : <MarkdownEditor content={content?.body ?? ''} onChange={(v: string) => setContent({ type: 'md', body: v })} />}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Tóm tắt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="Mô tả ngắn hiển thị trên trang danh sách..." className="w-full border border-white/10 bg-[#1A1D26] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-violet-500 text-white" />
          </div>
        </div>

        <div className="w-80 border-l border-white/[0.06] bg-[#0F1117] overflow-y-auto flex-shrink-0">
          <div className="flex border-b border-white/[0.06] bg-[#1A1D26] sticky top-0">
            {(['general', 'links', 'seo'] as SidebarTab[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === tab ? 'border-b-2 border-violet-500 text-violet-400' : 'text-gray-400 hover:text-gray-200'}`}>{tab === 'general' ? 'Tổng quát' : tab === 'links' ? 'Liên kết' : 'SEO'}</button>
            ))}
          </div>
          <div className="p-4 space-y-6">
            {activeTab === 'general' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Trạng thái</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus)} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm bg-[#1A1D26] text-white focus:outline-none focus:border-violet-500">
                    <option value="DRAFT">Nháp</option>
                    <option value="PUBLISHED">Đăng ngay</option>
                    <option value="SCHEDULED">Đặt lịch</option>
                  </select>
                </div>
                {(status === 'PUBLISHED' || status === 'SCHEDULED') && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">{status === 'SCHEDULED' ? 'Thời điểm đăng' : 'Ngày đăng'}</label>
                    <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm bg-[#1A1D26] text-white focus:outline-none focus:border-violet-500" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Ảnh đại diện (URL)</label>
                  <input type="url" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm bg-[#1A1D26] text-white focus:outline-none focus:border-violet-500" />
                  {thumbnail && <img src={thumbnail} alt="thumbnail" className="mt-2 w-full h-32 object-cover rounded-lg border border-white/10" />}
                </div>
              </>
            )}
            {activeTab === 'links' && (
              <>
                <CouponPicker value={couponIds} onChange={setCouponIds} />
                <BrandPicker value={brandIds} onChange={setBrandIds} />
              </>
            )}
            {activeTab === 'seo' && (
              <SeoPanel title={seoTitle || title} description={seoDesc || excerpt} slug={slug} onTitleChange={setSeoTitle} onDescChange={setSeoDesc} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
