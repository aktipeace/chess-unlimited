import type { PieceSymbol } from 'chess.js'
import { useEffect } from 'react'

const OPTIONS: { piece: PieceSymbol; glyph: string; label: string }[] = [
  { piece: 'q', glyph: '♛', label: 'Ratu' },
  { piece: 'r', glyph: '♜', label: 'Benteng' },
  { piece: 'b', glyph: '♝', label: 'Gajah' },
  { piece: 'n', glyph: '♞', label: 'Kuda' },
]

interface Props {
  onChoose: (p: PieceSymbol | null) => void
}

export default function PromotionDialog({ onChoose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onChoose(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onChoose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pilih bidak promosi"
      className="absolute inset-0 z-20 flex items-center justify-center bg-ink/70 p-4"
      onClick={() => onChoose(null)}
    >
      <div className="rounded-lg border border-line bg-panel p-4" onClick={(e) => e.stopPropagation()}>
        <p className="mb-3 text-sm font-semibold">Promosi pion menjadi:</p>
        <div className="flex gap-2">
          {OPTIONS.map((o) => (
            <button
              key={o.piece}
              type="button"
              autoFocus={o.piece === 'q'}
              onClick={() => onChoose(o.piece)}
              className="flex w-16 flex-col items-center rounded-md border border-line bg-raised py-2 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="text-3xl leading-none">{o.glyph}</span>
              <span className="mt-1 text-xs text-muted">{o.label}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => onChoose(null)} className="mt-3 text-xs text-muted underline hover:text-fg">
          Batal
        </button>
      </div>
    </div>
  )
}
