import { Chess, type PieceSymbol, type Square } from 'chess.js'

export interface MoveGuidance {
  from: string
  to: string
  san: string
  piece: string
}

const PIECE_LABELS: Record<PieceSymbol, string> = {
  p: 'Pion',
  n: 'Kuda',
  b: 'Gajah',
  r: 'Benteng',
  q: 'Menteri',
  k: 'Raja',
}

/** Convert the engine's first UCI move into a safe, human-readable hint. */
export function getMoveGuidance(fen: string, uci: string | null): MoveGuidance | null {
  if (!uci || !/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci)) return null

  const from = uci.slice(0, 2)
  const to = uci.slice(2, 4)
  const board = new Chess(fen)
  const piece = board.get(from as Square)
  if (!piece) return null

  try {
    const move = board.move({
      from: from as Square,
      to: to as Square,
      promotion: uci[4] as PieceSymbol | undefined,
    })
    if (!move) return null
    return { from, to, san: move.san, piece: PIECE_LABELS[piece.type] }
  } catch {
    return null
  }
}
