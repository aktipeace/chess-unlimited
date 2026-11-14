import { Activity, History, Settings as SettingsIcon, type LucideIcon } from 'lucide-react'
import type { PageId } from '../../types'

const ITEMS: { id: PageId; label: string; icon: LucideIcon }[] = [
  { id: 'analysis', label: 'Analysis', icon: Activity },
  { id: 'history', label: 'Game History', icon: History },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

interface Props {
  page: PageId
  onChange: (p: PageId) => void
}

export default function Sidebar({ page, onChange }: Props) {
  return (
    <nav
      aria-label="Navigasi utama"
      className="mobile-nav fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-panel pb-[env(safe-area-inset-bottom)] md:static md:w-56 md:shrink-0 md:flex-col md:border-r md:border-t-0 md:pb-0"
    >
      <div className="hidden px-5 py-5 md:block">
        <div className="text-base font-bold tracking-tight">Chess Unlimited</div>
        <div className="text-xs text-muted">Personal Edition</div>
      </div>
      <ul className="flex flex-1 justify-around md:flex-none md:flex-col md:gap-1 md:px-3">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const active = id === page
          return (
            <li key={id} className="flex-1 md:flex-none">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 px-2 py-3 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:flex-row md:gap-3 md:rounded-md md:px-3 md:text-sm ${
                  active ? 'bg-raised text-accent md:font-semibold' : 'text-muted hover:text-fg'
                }`}
              >
                <Icon size={18} aria-hidden />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
