import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  aside?: ReactNode
  className?: string
}

export default function Panel({ title, aside, children, className = '' }: Props) {
  return (
    <section className={`rounded-lg border border-line bg-panel ${className}`}>
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {aside}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}
