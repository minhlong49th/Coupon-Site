'use client';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function MarkdownEditor({ content, onChange }: { content: string; onChange: (content: string) => void }) {
  return (
    <div data-color-mode="dark" className="h-full min-h-[400px]">
      <MDEditor
        value={content}
        onChange={(val) => onChange(val || '')}
        height="100%"
        preview="live"
        hideToolbar={false}
        className="border-none"
        style={{ borderRadius: 0, minHeight: 400 }}
      />
    </div>
  )
}
