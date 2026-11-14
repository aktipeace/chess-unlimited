import AnalysisPanel from '../components/analysis/AnalysisPanel'
import BoardControls from '../components/board/BoardControls'
import ChessBoardView from '../components/board/ChessBoardView'
import MoveList from '../components/board/MoveList'
import Panel from '../components/ui/Panel'
import type { ChessGameApi } from '../hooks/useChessGame'
import type { Settings } from '../types'
import { useEngine } from '../hooks/useEngine'

interface Props {
  chess: ChessGameApi
  settings: Settings
  onSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

export default function AnalysisPage({ chess, settings, onSetting }: Props) {
  const { status, error } = chess
  const engine = useEngine(chess.fen, settings.targetDepth, settings.multiPv)
  const tone =
    status.kind === 'checkmate' ? 'text-danger' : status.kind === 'check' ? 'text-danger' : 'text-fg'

  return (
    <div className="mx-auto grid w-full max-w-[1440px] min-w-0 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-3 sm:space-y-4">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-end sm:gap-2">
          <div aria-live="polite">
            <div className={`text-lg font-semibold ${tone}`}>{status.label}</div>
            <div className="text-sm text-muted">{error ?? status.detail}</div>
          </div>
          <BoardControls
            canUndo={chess.moves.length > 0}
            onUndo={chess.undo}
            onReset={chess.reset}
            onFlip={chess.flip}
          />
        </div>
        <ChessBoardView chess={chess} settings={settings} suggestedMoveUci={engine.suggestedMoveUci} showBestMoveArrow={settings.showBestMoveArrow} />
      </div>

      <div className="min-w-0 space-y-4">
        <AnalysisPanel
          settings={settings}
          onSetting={onSetting}
          ready={engine.ready}
          running={engine.running}
          analysis={engine.analysis}
          bestMove={engine.bestMove}
          error={engine.error}
          autoAnalyze={engine.autoAnalyze}
          onAutoAnalyze={engine.setAutoAnalyze}
          onStart={engine.start}
          onStop={engine.stop}
          selectedVariation={engine.selectedVariation}
          onSelectVariation={engine.setSelectedVariation}
          guidance={engine.guidance}
          isMobile={engine.isMobile}
          effectiveDepth={engine.effectiveDepth}
          effectiveMultiPv={engine.effectiveMultiPv}
        />
        <Panel title="Daftar langkah">
          <MoveList moves={chess.moves} />
        </Panel>
      </div>
    </div>
  )
}
