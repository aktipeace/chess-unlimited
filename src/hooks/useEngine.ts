import { useCallback, useEffect, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { getMoveGuidance } from '../lib/moveGuidance'
import { StockfishEngine } from '../engine/StockfishEngine'
import type { EngineAnalysis } from '../engine/parseInfo'

export function useEngine(fen: string, targetDepth: number, multiPv: number) {
  const engineRef = useRef<StockfishEngine | null>(null)
  const [ready, setReady] = useState(false)
  const [running, setRunning] = useState(false)
  const [analysis, setAnalysis] = useState<EngineAnalysis>({ depth: null, lines: [] })
  const [bestMove, setBestMove] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoAnalyze, setAutoAnalyze] = useState(true)
  const [selectedVariation, setSelectedVariation] = useState(1)

  useEffect(() => {
    const engine = new StockfishEngine({
      onReady: () => setReady(true),
      onAnalysis: setAnalysis,
      onBestMove: (move) => { setBestMove(move); setRunning(false) },
      onError: (message) => { setError(message); setRunning(false) },
    })
    engineRef.current = engine
    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (!engineRef.current || !ready) return
    setError(null)
    setBestMove(null)
    setRunning(true)
    engineRef.current.analyze(fen, targetDepth, multiPv)
  }, [fen, multiPv, ready, targetDepth])

  const stop = useCallback(() => {
    engineRef.current?.stop()
    setRunning(false)
  }, [])

  useEffect(() => {
    if (autoAnalyze && ready) start()
  }, [autoAnalyze, fen, multiPv, ready, start, targetDepth])

  const lines = analysis.lines.map((line) => {
    const chess = new Chess(fen)
    const san: string[] = []
    for (const uci of line.pv) {
      try {
        const move = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] })
        if (!move) break
        san.push(move.san)
      } catch { break }
    }
    return { ...line, san }
  })

  let bestMoveSan: string | null = null
  if (bestMove) {
    const board = new Chess(fen)
    try { bestMoveSan = board.move({ from: bestMove.slice(0, 2), to: bestMove.slice(2, 4), promotion: bestMove[4] })?.san ?? bestMove } catch { bestMoveSan = bestMove }
  }

  const selectedLine = analysis.lines.find((line) => line.multipv === selectedVariation) ?? analysis.lines.find((line) => line.multipv === 1)
  const suggestedMoveUci = selectedLine?.pv[0] ?? (selectedVariation === 1 ? bestMove : null)
  const guidance = getMoveGuidance(fen, suggestedMoveUci)

  return { ready, running, analysis: { ...analysis, lines }, bestMove: bestMoveSan, suggestedMoveUci, guidance, selectedVariation, setSelectedVariation, error, autoAnalyze, setAutoAnalyze, start, stop }
}
