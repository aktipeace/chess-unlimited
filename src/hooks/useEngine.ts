import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches)
  const effectiveDepth = isMobile ? Math.min(targetDepth, 15) : targetDepth
  const effectiveMultiPv = isMobile ? 1 : multiPv

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

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  const start = useCallback(() => {
    if (!engineRef.current || !ready) return
    setError(null)
    setBestMove(null)
    setRunning(true)
    engineRef.current.analyze(fen, effectiveDepth, effectiveMultiPv)
  }, [effectiveDepth, effectiveMultiPv, fen, ready])

  const stop = useCallback(() => {
    engineRef.current?.stop()
    setRunning(false)
  }, [])

  useEffect(() => {
    if (!ready) return

    // Stop work for the previous position immediately, then debounce the next search.
    engineRef.current?.stop()
    setRunning(false)
    setAnalysis({ depth: null, lines: [] })
    setBestMove(null)

    if (!autoAnalyze) return
    const delay = isMobile ? 500 : 250
    const timer = window.setTimeout(start, delay)
    return () => window.clearTimeout(timer)
  }, [autoAnalyze, effectiveDepth, effectiveMultiPv, fen, isMobile, ready, start])

  const lines = useMemo(() => analysis.lines.map((line) => {
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
  }), [analysis.lines, fen])

  const bestMoveSan = useMemo(() => {
    if (!bestMove) return null
    const board = new Chess(fen)
    try { return board.move({ from: bestMove.slice(0, 2), to: bestMove.slice(2, 4), promotion: bestMove[4] })?.san ?? bestMove }
    catch { return bestMove }
  }, [bestMove, fen])

  const selectedLine = analysis.lines.find((line) => line.multipv === selectedVariation) ?? analysis.lines.find((line) => line.multipv === 1)
  const suggestedMoveUci = selectedLine?.pv[0] ?? (selectedVariation === 1 ? bestMove : null)
  const guidance = getMoveGuidance(fen, suggestedMoveUci)

  return { ready, running, analysis: { ...analysis, lines }, bestMove: bestMoveSan, suggestedMoveUci, guidance, selectedVariation, setSelectedVariation, error, autoAnalyze, setAutoAnalyze, start, stop, isMobile, effectiveDepth, effectiveMultiPv }
}
