'use client';
import { useState } from 'react';
import MediaLibrary from '@/components/media/MediaLibrary';

export default function MediaPage() {
  return (
    <div className="flex h-full w-full bg-[#080B10] text-white">
      <MediaLibrary />
    </div>
  )
}
