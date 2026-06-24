'use client';
export default function FolderSidebar({ selectedFolder, onSelect }: any) {
  const folders = [{ name: 'uploads', count: 12 }, { name: 'blog', count: 5 }, { name: 'brands', count: 8 }];
  return (
    <div className="w-56 border-r border-white/[0.06] bg-[#1A1D26] flex flex-col flex-shrink-0">
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thư mục</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        <button onClick={() => onSelect(undefined)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${!selectedFolder ? 'bg-violet-500/15 text-violet-400 font-medium' : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'}`}>
          <span>🗂️</span>
          <span className="flex-1 text-left">Tất cả</span>
          <span className="text-xs text-gray-500">25</span>
        </button>
        {folders.map(folder => (
          <button key={folder.name} onClick={() => onSelect(folder.name)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedFolder === folder.name ? 'bg-violet-500/15 text-violet-400 font-medium' : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'}`}>
            <span>📁</span>
            <span className="flex-1 text-left capitalize">{folder.name}</span>
            <span className="text-xs text-gray-500">{folder.count}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
