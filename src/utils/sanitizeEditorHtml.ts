import DOMPurify, { type Config } from 'dompurify'

/** Etiquetas alineadas con TipTap StarterKit + Link + TextAlign (contenido de capítulos). */
const EDITOR_HTML_CONFIG: Config = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'code',
    'pre',
    'span',
    'div',
    'hr',
  ],
  ALLOWED_ATTR: ['href', 'class', 'target', 'rel', 'style'],
  ALLOW_DATA_ATTR: false,
}

let linkRelHookRegistered = false

function ensureLinkRelHook(): void {
  if (linkRelHookRegistered) return
  linkRelHookRegistered = true
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName !== 'A') return
    if (node.getAttribute('target') === '_blank') {
      const rel = node.getAttribute('rel') ?? ''
      if (!/\bnoopener\b/.test(rel)) {
        node.setAttribute('rel', rel ? `${rel} noopener noreferrer` : 'noopener noreferrer')
      }
    }
  })
}

/**
 * HTML del editor / capítulos antes de inyectar en DOM o parsear con innerHTML.
 * Mitiga XSS si el contenido en BD estuviera manipulado o hubiera pegado malicioso.
 */
export function sanitizeEditorHtml(html: string): string {
  if (!html) return ''
  ensureLinkRelHook()
  return String(DOMPurify.sanitize(html, EDITOR_HTML_CONFIG))
}

/** Para insertar texto de usuario en plantillas HTML (p. ej. &lt;title&gt;). */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
