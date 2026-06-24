'use client';
import { useState } from 'react';
import MediaCard from './MediaCard';
import MediaUploader from './MediaUploader';
import FolderSidebar from './FolderSidebar';
import MediaDetail from './MediaDetail';

// Mock data
const mockAssets = [
  { id: '1', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', filename: 'laptop.jpg', mimeType: 'image/jpeg', size: 102400, mediaType: 'IMAGE', createdAt: new Date() },
  { id: '2', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', filename: 'shoes.jpg', mimeType: 'image/jpeg', size: 204800, mediaType: 'IMAGE', createdAt: new Date() },
  { id: '3', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f', filename: 'camera.jpg', mimeType: 'image/jpeg', size: 304800, mediaType: 'IMAGE', createdAt: new Date() },
];

export default function MediaLibrary() {
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailAssetId, setDetailAssetId] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex h-full w-full">
      <FolderSidebar selectedFolder={selectedFolder} onSelect={setSelectedFolder} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0F1117]">
          <div>
            <h1 className="text-xl font-bold text-white">Media Library</h1>
            <p className="text-sm text-gray-400 mt-0.5">{mockAssets.length} files</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <button className="px-4 py-2 border border-red-500/20 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20">
                Xóa {selectedIds.size} file
              </button>
            )}
            <button onClick={() => setShowUploader(true)} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
              + Upload
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 border-b border-white/[0.06] bg-[#1A1D26]">
          <input type="text" placeholder="Tìm kiếm file..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-white/10 bg-[#0F1117] text-white rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:border-violet-500" />
          <button onClick={() => setSelectedIds(new Set(mockAssets.map(a => a.id)))} className="text-sm text-gray-400 hover:text-white">Chọn tất cả</button>
          {selectedIds.size > 0 && <button onClick={() => setSelectedIds(new Set())} className="text-sm text-gray-500 hover:text-gray-300">Bỏ chọn</button>}
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {mockAssets.map((asset) => (
              <MediaCard
                key={asset.id}
                asset={asset}
                selected={selectedIds.has(asset.id)}
                onSelect={() => toggleSelect(asset.id)}
                onClick={() => setDetailAssetId(asset.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {showUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1D26] rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <h2 className="text-base font-semibold text-white">Upload Media</h2>
              <button onClick={() => setShowUploader(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-4">
              <MediaUploader folder={selectedFolder ?? 'uploads'} onUploadComplete={() => setShowUploader(false)} />
            </div>
          </div>
        </div>
      )}

      {detailAssetId && (
        <MediaDetail
          asset={mockAssets.find(a => a.id === detailAssetId)}
          onClose={() => setDetailAssetId(null)}
          onDelete={() => setDetailAssetId(null)}
        />
      )}
    </div>
  )
}
