'use client';
import Image from 'next/image';

export default function MediaCard({ asset, selected, onSelect, onClick }: any) {
  return (
    <div
      className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
        selected ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-transparent hover:border-white/20'
      }`}
      onClick={onClick}
    >
      <Image src={asset.url} alt={asset.filename} fill className="object-cover" sizes="160px" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
      <button
        onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
        className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all text-xs ${
          selected ? 'bg-violet-500 border-violet-500 text-white' : 'bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100 text-black'
        }`}
      >
        {selected ? '✓' : ''}
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform">
        <p className="text-white text-xs font-medium truncate">{asset.filename}</p>
        <p className="text-white/70 text-[10px]">{Math.round(asset.size/1024)} KB</p>
      </div>
    </div>
  )
}
