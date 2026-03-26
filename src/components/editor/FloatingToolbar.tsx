import React, { useState, useEffect, useRef } from 'react'
import { useEditor } from '@tiptap/react'
import { Bold, Italic, Link, Heading1, Heading2, Heading3, List, ListOrdered } from 'lucide-react'

interface FloatingToolbarProps {
  editor: ReturnType<typeof useEditor> | null
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ editor }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection
      const isEmpty = from === to

      if (isEmpty) {
        setIsVisible(false)
        return
      }

      const { $anchor } = editor.state.selection
      const coords = editor.view.coordsAtPos($anchor.pos)
      const toolbarHeight = 40
      const offset = 10

      setPosition({
        top: coords.top - toolbarHeight - offset,
        left: coords.left,
      })

      setIsVisible(true)
    }

    editor.on('selectionUpdate', handleSelectionUpdate)
    editor.on('focus', handleSelectionUpdate)

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.off('focus', handleSelectionUpdate)
    }
  }, [editor])

  const setLink = () => {
    if (!editor) return

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

  if (!editor || !isVisible) return null

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 flex items-center gap-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-700 text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-700 text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 dark:bg-slate-700 text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'
        }`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-slate-700 text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'
        }`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 dark:bg-slate-700 text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'
        }`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-700 text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-700 text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'
        }`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('link') ? 'bg-slate-200 dark:bg-slate-700 text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'
        }`}
        title="Insert Link"
      >
        <Link className="w-4 h-4" />
      </button>
    </div>
  )
}
