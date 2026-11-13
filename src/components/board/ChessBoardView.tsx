import { useMemo } from 'react'
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
    <div className="relative mx-auto w-full" style={{ maxWidth: 'min(100%, calc(100dvh - 11rem))' }}>
      <Chessboard
        id="main-board"
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
