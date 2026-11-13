import { useCallback, useMemo, useState } from 'react'
import { Chess, type Move, type PieceSymbol, type Square } from 'chess.js'
import { findKing, getStatus, needsPromotion, safeMove } from '../lib/chess'
import type { PendingPromotion } from '../types'

export function useChessGame() {
  const [game] = useState(() => new Chess())
  const [snapshot, setSnapshot] = useState(() => ({ fen: game.fen(), moves: [] as Move[], pgn: '' }))
  const [selected, setSelected] = useState<Square | null>(null)
  const [pending, setPending] = useState<PendingPromotion | null>(null)
  const [orientation, setOrientation] = useState<'white' | 'black'>('white')
  const [error, setError] = useState<string | null>(null)

  const { fen, moves, pgn } = snapshot

  const sync = useCallback(() => {
    setSnapshot({ fen: game.fen(), moves: game.history({ verbose: true }), pgn: game.pgn() })
    setSelected(null)
    setPending(null)
  }, [game])

  const status = useMemo(() => getStatus(game), [game, fen]) // eslint-disable-line react-hooks/exhaustive-deps
  const checkSquare = useMemo(
    () => (game.inCheck() ? findKing(game, game.turn()) : null),
    [game, fen], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const targets = useMemo<Square[]>(
    () => (selected ? game.moves({ square: selected, verbose: true }).map((m) => m.to) : []),
    [game, selected, fen], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const isGameOver = status.kind === 'checkmate' || status.kind === 'stalemate' || status.kind === 'draw'

  const attempt = useCallback(
    (from: Square, to: Square, promotion?: PieceSymbol): boolean => {
      if (from === to) return false
      if (game.isGameOver()) {
        setError('Permainan sudah berakhir. Gunakan Undo atau Reset.')
        return false
      }
      if (!promotion && needsPromotion(game, from, to)) {
        setSelected(null)
        setPending({ from, to })
        return false // bidak kembali ke posisi semula sampai promosi dipilih
      }
      if (!safeMove(game, from, to, promotion)) {
        setError('Langkah ilegal.')
        return false
      }
      setError(null)
      sync()
      return true
    },
    [game, sync],
  )

  const dropPiece = useCallback((from: string, to: string) => attempt(from as Square, to as Square), [attempt])

  const clickSquare = useCallback(
    (square: string) => {
      if (pending) return
      const sq = square as Square
      setError(null)
      if (selected && targets.includes(sq)) {
        attempt(selected, sq)
        return
      }
      const piece = game.get(sq)
      if (piece && piece.color === game.turn() && !game.isGameOver()) {
        setSelected(sq === selected ? null : sq)
      } else {
        setSelected(null)
      }
    },
    [attempt, game, pending, selected, targets],
  )

  const choosePromotion = useCallback(
    (piece: PieceSymbol | null) => {
      if (!pending) return
      if (piece === null) return setPending(null)
      attempt(pending.from, pending.to, piece)
    },
    [attempt, pending],
  )

  const undo = useCallback(() => {
    if (game.undo()) {
      setError(null)
      sync()
    }
  }, [game, sync])

  const reset = useCallback(() => {
    game.reset()
    setError(null)
    sync()
  }, [game, sync])

  const flip = useCallback(() => setOrientation((o) => (o === 'white' ? 'black' : 'white')), [])

  return {
    game, fen, moves, pgn, selected, targets, pending, orientation, error, status,
    checkSquare, isGameOver, lastMove: moves[moves.length - 1],
    dropPiece, clickSquare, choosePromotion, undo, reset, flip,
  }
}

export type ChessGameApi = ReturnType<typeof useChessGame>
