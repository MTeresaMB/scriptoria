import React from 'react'

interface BaseCardProps {
  children: React.ReactNode
  onClick?: () => void
  ariaLabel?: string
  className?: string
  role?: 'button' | 'group'
  hoverColor?: string
  focusRingColor?: string
}

/**
 * Card base reutilizable para Manuscripts, Characters, etc.
 * Gestiona estilos, foco y accesibilidad básica cuando es clickable.
 */
export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  onClick,
  ariaLabel,
  className = '',
  role,
  hoverColor = 'hover:border-purple-500',
  focusRingColor = 'focus-within:ring-purple-500',
}) => {
  const isClickable = Boolean(onClick)

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const baseClasses =
    `group bg-slate-800 border border-slate-700 rounded-xl ${hoverColor} transition-all duration-300 shadow-lg`

  const interactiveClasses = isClickable
    ? `cursor-pointer focus-within:ring-2 ${focusRingColor} focus-within:ring-offset-2 focus-within:ring-offset-slate-900`
    : ''

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`.trim()}
      onClick={onClick}
      role={role ?? (isClickable ? 'button' : 'group')}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  )
}


