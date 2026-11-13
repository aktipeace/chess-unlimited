import type { ReactNode } from 'react'
import { Play, Square } from 'lucide-react'
import Button from '../ui/Button'
import Panel from '../ui/Panel'
import EvalBar from './EvalBar'
import type { Settings } from '../../types'
import type { EngineAnalysis, EngineLine } from '../../engine/parseInfo'
type DisplayAnalysis = Omit<EngineAnalysis, 'lines'> & { lines: Array<EngineLine & { san: string[] }> }

interface Props {
  settings: Settings
  onSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  ready: boolean
  running: boolean
  analysis: DisplayAnalysis
  bestMove: string | null
  error: string | null
  autoAnalyze: boolean
  onAutoAnalyze: (enabled: boolean) => void
  onStart: () => void
  onStop: () => void
  selectedVariation: number
  onSelectVariation: (variation: number) => void
  guidance: { from: string; to: string; san: string; piece: string } | null
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex items-baseline justify-between gap-4 py-2 text-sm"><dt className="text-muted">{label}</dt><dd className="num text-right">{children}</dd></div>
}

export default function AnalysisPanel({
  settings, onSetting, ready, running, analysis, bestMove, error,
  autoAnalyze, onAutoAnalyze, onStart, onStop, selectedVariation, onSelectVariation, guidance,
}: Props) {
  const primary = analysis.lines.find((line) => line.multipv === 1)
  const cp = primary?.scoreCp ?? null
  const mate = primary?.scoreMate ?? null
  const evaluation = cp === null ? (mate === null ? null : Math.sign(mate) * 1000) : cp
  const empty = <span className="text-muted">—</span>

  return (
    <Panel title="Analisis engine" aside={
      <span className="flex items-center gap-2 text-xs text-muted">
        <span className={`h-2 w-2 rounded-full ${ready ? 'bg-emerald-400' : 'bg-muted'}`} aria-hidden />
        {error ? 'Engine bermasalah' : ready ? (running ? 'Menganalisis' : 'Siap') : 'Memuat engine…'}
      </span>
    }>
      <EvalBar evaluation={evaluation} />
      <dl className="mt-3 divide-y divide-line">
        <Row label="Evaluasi">{cp !== null ? `${(cp / 100).toFixed(2)}` : mate !== null ? `#${mate}` : empty}</Row>
        <Row label="Langkah terbaik">{primary?.san[0] ?? bestMove ?? empty}</Row>
        <Row label="Kedalaman">{analysis.depth ?? '—'} <span className="text-muted">/ {settings.targetDepth}</span></Row>
      </dl>

      <div className="mt-3">
        <h3 className="text-xs font-semibold text-muted">Principal variation</h3>
        <p className="mt-1 min-h-5 text-sm">{primary?.san.join(' ') || <span className="text-muted">Menunggu hasil analisis…</span>}</p>
        <p className="mt-2 text-xs text-emerald-400">Panah hijau di papan menunjukkan langkah terbaik engine.</p>
      </div>

      <div className="mt-3">
        <h3 className="text-xs font-semibold text-muted">MultiPV ({settings.multiPv} baris)</h3>
        <ol className="mt-1 space-y-1">
          {Array.from({ length: settings.multiPv }, (_, i) => {
            const line = analysis.lines.find((item) => item.multipv === i + 1)
            const score = line?.scoreCp !== null && line?.scoreCp !== undefined
              ? (line.scoreCp / 100).toFixed(2)
              : line?.scoreMate !== null && line?.scoreMate !== undefined ? `#${line.scoreMate}` : '—'
            return <li key={i}><button type="button" disabled={!line?.pv.length} onClick={() => onSelectVariation(i + 1)} aria-pressed={selectedVariation === i + 1} className={`flex w-full items-center gap-3 rounded border px-3 py-2 text-left text-sm transition-colors ${selectedVariation === i + 1 ? 'border-accent bg-accent/10' : 'border-line hover:bg-raised'}`}>
              <span className="num w-4 text-muted">{i + 1}</span>
              <span className="num w-12 text-right">{score}</span>
              <span className="min-w-0 flex-1 truncate">{line?.san.join(' ') || <span className="text-muted">Menunggu engine</span>}</span>
            </button></li>
          })}
        </ol>
      </div>

      <div className="mt-3 rounded-lg border border-line bg-raised p-3" aria-live="polite">
        <h3 className="text-sm font-semibold">Petunjuk langkah terpilih</h3>
        {guidance ? <p className="mt-1 text-sm">Gerakkan <strong>{guidance.piece}</strong> dari <strong>{guidance.from}</strong> ke <strong>{guidance.to}</strong> ({guidance.san}).</p> : <p className="mt-1 text-sm text-muted">Menunggu rekomendasi langkah dari Stockfish.</p>}
        <p className="mt-1 text-xs text-muted">Pilih salah satu baris MultiPV untuk melihat arah alternatif di papan.</p>
      </div>

      <div className="mt-4 space-y-3 border-t border-line pt-4">
        <label className="block text-sm">
          <span className="flex justify-between"><span>Kedalaman target</span><span className="num text-muted">{settings.targetDepth}</span></span>
          <input type="range" min={8} max={40} value={settings.targetDepth} onChange={(e) => onSetting('targetDepth', Number(e.target.value))} className="mt-1 w-full accent-accent" />
        </label>
        <label className="flex items-center justify-between text-sm">
          Jumlah baris MultiPV
          <select value={settings.multiPv} onChange={(e) => onSetting('multiPv', Number(e.target.value))} className="rounded-md border border-line bg-raised px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={autoAnalyze} onChange={(e) => onAutoAnalyze(e.target.checked)} className="accent-accent" />
          Analisis otomatis setiap posisi berubah
        </label>
        <div className="flex gap-2">
          <Button variant="primary" disabled={!ready || running} onClick={onStart} icon={<Play size={16} />}>Mulai analisis</Button>
          <Button disabled={!running} onClick={onStop} icon={<Square size={16} />}>Berhenti</Button>
        </div>
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
        <p className="text-xs text-muted">Stockfish 18 Lite · WASM · single-threaded · berjalan lokal di browser.</p>
      </div>
    </Panel>
  )
}
