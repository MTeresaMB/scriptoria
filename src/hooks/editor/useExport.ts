import { useCallback } from 'react'
import jsPDF from 'jspdf'

interface UseExportProps {
  content: string
  chapterTitle?: string
}

export const useExport = ({ content, chapterTitle = 'Chapter' }: UseExportProps) => {
  const htmlToText = useCallback((html: string): string => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }, [])

  const htmlToMarkdown = useCallback((html: string): string => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    // Convert headings
    tempDiv.querySelectorAll('h1').forEach((el) => {
      el.outerHTML = `# ${el.textContent}\n\n`
    })
    tempDiv.querySelectorAll('h2').forEach((el) => {
      el.outerHTML = `## ${el.textContent}\n\n`
    })
    tempDiv.querySelectorAll('h3').forEach((el) => {
      el.outerHTML = `### ${el.textContent}\n\n`
    })
    tempDiv.querySelectorAll('strong, b').forEach((el) => {
      el.outerHTML = `**${el.textContent}**`
    })
    tempDiv.querySelectorAll('em, i').forEach((el) => {
      el.outerHTML = `*${el.textContent}*`
    })
    tempDiv.querySelectorAll('a').forEach((el) => {
      const href = el.getAttribute('href') || ''
      el.outerHTML = `[${el.textContent}](${href})`
    })
    tempDiv.querySelectorAll('ul').forEach((ul) => {
      const items = Array.from(ul.querySelectorAll('li'))
      const markdown = items.map((li) => `- ${li.textContent}`).join('\n')
      ul.outerHTML = `${markdown}\n\n`
    })

    tempDiv.querySelectorAll('ol').forEach((ol) => {
      const items = Array.from(ol.querySelectorAll('li'))
      const markdown = items.map((li, idx) => `${idx + 1}. ${li.textContent}`).join('\n')
      ol.outerHTML = `${markdown}\n\n`
    })

    // Convert paragraphs
    tempDiv.querySelectorAll('p').forEach((p) => {
      if (p.textContent?.trim()) {
        p.outerHTML = `${p.textContent}\n\n`
      }
    })

    return tempDiv.textContent || tempDiv.innerText || ''
  }, [])

  const exportToText = useCallback(() => {
    const text = htmlToText(content)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chapterTitle.replace(/[^a-z0-9]/gi, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [content, chapterTitle, htmlToText])

  // Export to Markdown
  const exportToMarkdown = useCallback(() => {
    const markdown = `# ${chapterTitle}\n\n${htmlToMarkdown(content)}`
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chapterTitle.replace(/[^a-z0-9]/gi, '_')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [content, chapterTitle, htmlToMarkdown])

  const exportToPDF = useCallback(async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const text = htmlToText(content)
      const lines = pdf.splitTextToSize(text, 180)
      pdf.setFontSize(18)
      pdf.text(chapterTitle, 15, 20)
      pdf.setFontSize(11)
      let y = 30
      const pageHeight = pdf.internal.pageSize.height
      const margin = 15
      const lineHeight = 7

      lines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margin) {
          pdf.addPage()
          y = margin
        }
        pdf.text(line, margin, y)
        y += lineHeight
      })

      pdf.save(`${chapterTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`)
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      throw error
    }
  }, [content, chapterTitle, htmlToText])

  const exportToHTML = useCallback(() => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chapterTitle}</title>
    <style>
        body {
            font-family: Georgia, serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        h1, h2, h3 {
            color: #2c3e50;
            margin-top: 1.5em;
        }
        p {
            margin: 1em 0;
        }
    </style>
</head>
<body>
    <h1>${chapterTitle}</h1>
    ${content}
</body>
</html>`
    
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chapterTitle.replace(/[^a-z0-9]/gi, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [content, chapterTitle])

  return {
    exportToText,
    exportToMarkdown,
    exportToPDF,
    exportToHTML,
  }
}
