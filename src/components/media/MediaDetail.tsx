'use client';
import Image from 'next/image';

export default function MediaDetail({ asset, onClose, onDelete }: any) {
  if (!asset) return null;
  return (
    <div className="w-80 bg-[#1A1D26] border-l border-white/[0.06] flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-bold text-white">Chi tiết file</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>
      <div className="bg-[#0F1117] border-b border-white/[0.06] p-4 flex items-center justify-center min-h-[180px]">
        <div className="relative w-full h-44 rounded-lg overflow-hidden">
          <Image src={asset.url} alt={asset.filename} fill className="object-contain" />
        </div>
      </div>
      <div className="p-4 space-y-3 text-xs text-gray-400 flex-1">
        <div className="flex justify-between"><span className="text-gray-500">Tên file:</span><span className="font-medium text-white truncate max-w-[150px]">{asset.filename}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Kích thước:</span><span className="font-medium text-white">{Math.round(asset.size/1024)} KB</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Loại:</span><span className="font-medium text-white">{asset.mimeType}</span></div>
        
        <div className="mt-6">
          <label className="block text-xs font-medium text-gray-400 mb-1">URL</label>
          <div className="flex gap-2">
            <input readOnly value={asset.url} className="flex-1 border border-white/10 bg-[#0F1117] text-gray-400 rounded px-2 py-1.5 text-xs truncate outline-none" />
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-white/[0.06]">
        <button onClick={onDelete} className="w-full py-2 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/10">Xóa file</button>
      </div>
    </div>
  )
}
