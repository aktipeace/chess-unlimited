import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  icon?: ReactNode
}

export default function Button({ variant = 'ghost', icon, children, className = '', ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
    'disabled:cursor-not-allowed disabled:opacity-40'
  const look =
    variant === 'primary'
      ? 'bg-accent text-ink hover:bg-accent/90'
      : 'border border-line bg-raised text-fg hover:border-muted enabled:hover:bg-line/40'
  return (
    <button type="button" className={`${base} ${look} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  )
}
