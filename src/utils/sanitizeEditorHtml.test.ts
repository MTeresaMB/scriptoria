import { describe, expect, it } from 'vitest'
import { escapeHtml, sanitizeEditorHtml } from './sanitizeEditorHtml'

describe('sanitizeEditorHtml', () => {
  it('permite marcado típico del editor', () => {
    const html = '<p><strong>OK</strong></p><h2>T</h2>'
    expect(sanitizeEditorHtml(html)).toContain('<strong>OK</strong>')
    expect(sanitizeEditorHtml(html)).toContain('<h2>')
  })

  it('elimina scripts y handlers', () => {
    const dirty =
      '<p>Hi</p><script>alert(1)</script><img src=x onerror="alert(1)">'
    const clean = sanitizeEditorHtml(dirty)
    expect(clean.toLowerCase()).not.toContain('<script')
    expect(clean).not.toContain('onerror')
  })
})

describe('escapeHtml', () => {
  it('escapa caracteres especiales', () => {
    expect(escapeHtml('<a & "x">')).toBe('&lt;a &amp; &quot;x&quot;&gt;')
  })
})
