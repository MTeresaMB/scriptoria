import React from 'react'
import { useEditor } from '@tiptap/react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react'

interface EditorToolbarProps {
  editor: ReturnType<typeof useEditor> | null
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex items-center gap-1 p-2 border-b border-slate-700 bg-slate-800 rounded-t-lg">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 border-r border-slate-700 pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive('bold') ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive('italic') ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 border-r border-slate-700 pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-slate-700 pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive('bulletList') ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive('orderedList') ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Text Alignment */}
      <div className="flex items-center gap-1 border-r border-slate-700 pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      {/* Link */}
      <div className="flex items-center gap-1 border-r border-slate-700 pr-2 mr-2">
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${
            editor.isActive('link') ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
          }`}
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-slate-700 transition-colors text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-slate-700 transition-colors text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
