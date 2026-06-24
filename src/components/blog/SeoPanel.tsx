'use client';
export default function SeoPanel({ title, description, slug, onTitleChange, onDescChange }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">SEO Title</label>
        <input type="text" value={title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Tiêu đề chuẩn SEO..." className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm bg-[#1A1D26] text-white focus:outline-none focus:border-violet-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">SEO Description</label>
        <textarea value={description} onChange={(e) => onDescChange(e.target.value)} rows={4} placeholder="Mô tả SEO..." className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm bg-[#1A1D26] text-white focus:outline-none focus:border-violet-500 resize-none" />
      </div>
      <div className="mt-4 p-4 rounded-lg bg-white border border-gray-200">
        <div className="text-[14px] text-[#1a0dab] truncate font-medium">{title}</div>
        <div className="text-[12px] text-[#006621] truncate mb-1">yoursite.com/blog/{slug}</div>
        <div className="text-[13px] text-[#545454] line-clamp-2">{description}</div>
      </div>
    </div>
  )
}
