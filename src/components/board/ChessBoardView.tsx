import { useEffect, useMemo, useRef, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { buildSquareStyles } from '../../lib/boardStyles'
import type { Square } from 'chess.js'
import type { ChessGameApi } from '../../hooks/useChessGame'
import type { Settings } from '../../types'
import PromotionDialog from './PromotionDialog'

interface Props {
  chess: ChessGameApi
  settings: Settings
  suggestedMoveUci?: string | null
  showBestMoveArrow?: boolean
}

export default function ChessBoardView({ chess, settings, suggestedMoveUci, showBestMoveArrow = true }: Props) {
  const { game, fen, selected, targets, lastMove, checkSquare, orientation, pending, isGameOver } = chess
  const boardShellRef = useRef<HTMLDivElement>(null)
  const [boardWidth, setBoardWidth] = useState(() =>
    typeof window === 'undefined' ? 320 : Math.max(240, Math.min(560, window.innerWidth - 24)),
  )

  useEffect(() => {
    const element = boardShellRef.current
    if (!element) return
    const updateWidth = () => {
      const width = Math.floor(element.getBoundingClientRect().width)
      if (width > 0) setBoardWidth((current) => current === width ? current : width)
    }
    updateWidth()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }
    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const squareStyles = useMemo(
    () =>
      buildSquareStyles({
        game,
        selected,
        targets,
        lastMove,
        checkSquare,
        showLegalMoves: settings.showLegalMoves,
        showLastMove: settings.showLastMove,
      }),
    [game, fen, selected, targets, lastMove, checkSquare, settings.showLegalMoves, settings.showLastMove], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div ref={boardShellRef} className="chess-board-shell relative mx-auto w-full">
      <Chessboard
        id="main-board"
        boardWidth={boardWidth}
        position={fen}
        customArrows={showBestMoveArrow && suggestedMoveUci && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(suggestedMoveUci)
          ? [[suggestedMoveUci.slice(0, 2) as Square, suggestedMoveUci.slice(2, 4) as Square]]
          : []}
        customArrowColor="#22c55e"
        boardOrientation={orientation}
        onPieceDrop={chess.dropPiece}
        onSquareClick={chess.clickSquare}
        onPromotionCheck={() => false}
        arePiecesDraggable={!isGameOver && !pending}
        customSquareStyles={squareStyles}
        customDarkSquareStyle={{ backgroundColor: '#4d6a86' }}
        customLightSquareStyle={{ backgroundColor: '#cfd9e4' }}
        customBoardStyle={{ borderRadius: '6px', overflow: 'hidden' }}
        showBoardNotation={settings.showCoordinates}
        animationDuration={settings.animationMs}
      />
      {pending && <PromotionDialog onChoose={chess.choosePromotion} />}
    </div>
  )
}
