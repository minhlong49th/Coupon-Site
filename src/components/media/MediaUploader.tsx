'use client';
export default function MediaUploader({ folder, onUploadComplete }: any) {
  return (
    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-violet-500 bg-[#0F1117] hover:bg-violet-500/5">
      <div className="text-3xl mb-2">☁️</div>
      <p className="text-sm font-medium text-white">Kéo thả file vào đây hoặc click để chọn</p>
      <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP, GIF — tối đa 8MB/file</p>
      <button onClick={onUploadComplete} className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700">
        Giả lập Upload xong
      </button>
    </div>
  )
}
