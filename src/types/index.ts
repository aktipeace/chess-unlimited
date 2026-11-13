import type { Square } from 'chess.js'

export type PageId = 'analysis' | 'history' | 'settings'

export interface Settings {
  showLegalMoves: boolean
  showLastMove: boolean
  showCoordinates: boolean
  animationMs: number
  targetDepth: number
  multiPv: number
  showBestMoveArrow: boolean
}

export type StatusKind = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw'

export interface GameStatus {
  kind: StatusKind
  label: string
  detail: string
}

export interface PendingPromotion {
  from: Square
  to: Square
}
