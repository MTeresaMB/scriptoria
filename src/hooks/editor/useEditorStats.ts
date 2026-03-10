import { useMemo } from 'react'

interface EditorStats {
  wordCount: number
  characterCount: number
  characterCountNoSpaces: number
  paragraphCount: number
  readingTime: number // in minutes
}

export const useEditorStats = (content: string): EditorStats => {
  return useMemo(() => {
    const textContent = content.replace(/<[^>]*>/g, '')
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0)
    const wordCount = words.length
    const characterCount = textContent.length
    const characterCountNoSpaces = textContent.replace(/\s/g, '').length
    const paragraphs = textContent.split(/\n\s*\n|<p[^>]*>/).filter(p => p.trim().length > 0)
    const paragraphCount = paragraphs.length || 1
    const readingTime = Math.ceil(wordCount / 225)

    return {
      wordCount,
      characterCount,
      characterCountNoSpaces,
      paragraphCount,
      readingTime,
    }
  }, [content])
}
