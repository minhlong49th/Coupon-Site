'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

export default function TiptapEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Bắt đầu viết...' }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-violet max-w-none focus:outline-none min-h-[400px] p-4 text-white',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-[#0F1117]">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded text-sm ${editor.isActive('bold') ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded text-sm ${editor.isActive('italic') ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>I</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded text-sm ${editor.isActive('bulletList') ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>UL</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <div className="p-2 border-t border-white/10 text-xs text-gray-500 bg-[#0F1117] flex justify-end">
        {editor.storage.characterCount.characters()} từ
      </div>
    </div>
  )
}
