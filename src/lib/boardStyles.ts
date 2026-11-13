import type { CSSProperties } from 'react'
import type { Chess, Move, Square } from 'chess.js'

interface Input {
  game: Chess
  selected: Square | null
  targets: Square[]
  lastMove: Move | undefined
  checkSquare: Square | null
  showLegalMoves: boolean
  showLastMove: boolean
}

const LAST = 'rgba(230, 180, 80, 0.38)'
const SELECTED = 'rgba(230, 180, 80, 0.62)'
const DOT = 'rgba(15, 22, 32, 0.38)'
const CHECK = 'radial-gradient(circle, rgba(229,96,77,0.95) 0%, rgba(229,96,77,0.55) 45%, transparent 75%)'

interface Layers {
  gradients: string[]
  solid?: string
}

export function buildSquareStyles(i: Input): Record<string, CSSProperties> {
  const map: Record<string, Layers> = {}
  const get = (sq: string): Layers => (map[sq] ??= { gradients: [] })

  if (i.showLastMove && i.lastMove) {
    get(i.lastMove.from).solid = LAST
    get(i.lastMove.to).solid = LAST
  }
  if (i.selected) get(i.selected).solid = SELECTED
  if (i.showLegalMoves) {
    for (const t of i.targets) {
      get(t).gradients.push(
        i.game.get(t)
          ? `radial-gradient(circle, transparent 58%, ${DOT} 60%, ${DOT} 72%, transparent 74%)`
          : `radial-gradient(circle, ${DOT} 22%, transparent 24%)`,
      )
    }
  }
  if (i.checkSquare) get(i.checkSquare).gradients.unshift(CHECK)

  const out: Record<string, CSSProperties> = {}
  for (const [sq, l] of Object.entries(map)) {
    out[sq] = { background: [...l.gradients, l.solid].filter(Boolean).join(', ') }
  }
  return out
}
