import type { Chess, Color, Move, PieceSymbol, Square } from 'chess.js'
import type { GameStatus } from '../types'

/** Mencoba langkah; mengembalikan null jika ilegal (chess.js melempar error). */
export function safeMove(game: Chess, from: Square, to: Square, promotion?: PieceSymbol): Move | null {
  try {
    return game.move({ from, to, promotion })
  } catch {
    return null
  }
}

export function needsPromotion(game: Chess, from: Square, to: Square): boolean {
  return game.moves({ square: from, verbose: true }).some((m) => m.to === to && !!m.promotion)
}

export function findKing(game: Chess, color: Color): Square | null {
  for (const row of game.board()) {
    for (const p of row) if (p && p.type === 'k' && p.color === color) return p.square
  }
  return null
}

export function getStatus(game: Chess): GameStatus {
  const turn = game.turn() === 'w' ? 'Putih' : 'Hitam'
  const other = game.turn() === 'w' ? 'Hitam' : 'Putih'
  if (game.isCheckmate()) return { kind: 'checkmate', label: 'Skakmat', detail: `${other} menang` }
  if (game.isStalemate()) return { kind: 'stalemate', label: 'Stalemate', detail: `${turn} tidak punya langkah legal` }
  if (game.isThreefoldRepetition()) return { kind: 'draw', label: 'Remis', detail: 'Posisi berulang tiga kali' }
  if (game.isInsufficientMaterial()) return { kind: 'draw', label: 'Remis', detail: 'Material tidak cukup' }
  if (game.isDraw()) return { kind: 'draw', label: 'Remis', detail: 'Aturan 50 langkah' }
  if (game.isCheck()) return { kind: 'check', label: 'Skak', detail: `Giliran ${turn}` }
  return { kind: 'playing', label: `Giliran ${turn}`, detail: 'Permainan berjalan' }
}
