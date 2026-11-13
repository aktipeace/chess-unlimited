import Button from '../components/ui/Button'
import Panel from '../components/ui/Panel'
import Toggle from '../components/ui/Toggle'
import type { Settings } from '../types'

interface Props {
  settings: Settings
  onSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  onReset: () => void
}

export default function SettingsPage({ settings, onSetting, onReset }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Panel title="Papan">
        <div className="divide-y divide-line">
          <Toggle label="Tampilkan langkah legal" description="Titik pada petak tujuan bidak yang dipilih." checked={settings.showLegalMoves} onChange={(v) => onSetting('showLegalMoves', v)} />
          <Toggle label="Tandai langkah terakhir" description="Sorot petak asal dan tujuan langkah terakhir." checked={settings.showLastMove} onChange={(v) => onSetting('showLastMove', v)} />
          <Toggle label="Tampilkan koordinat" description="Huruf a–h dan angka 1–8 di tepi papan." checked={settings.showCoordinates} onChange={(v) => onSetting('showCoordinates', v)} />
          <Toggle label="Tampilkan panah langkah terbaik" description="Panah hijau mengikuti variasi yang dipilih di panel analisis." checked={settings.showBestMoveArrow} onChange={(v) => onSetting('showBestMoveArrow', v)} />
          <label className="flex items-center justify-between gap-4 py-3 text-sm">
            <span>
              <span className="block font-medium">Animasi bidak</span>
              <span className="text-xs text-muted">Durasi gerakan dalam milidetik (0 = mati).</span>
            </span>
            <select
              value={settings.animationMs}
              onChange={(e) => onSetting('animationMs', Number(e.target.value))}
              className="rounded-md border border-line bg-raised px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {[0, 100, 200, 400].map((n) => <option key={n} value={n}>{n} ms</option>)}
            </select>
          </label>
        </div>
      </Panel>
      <Button onClick={onReset}>Kembalikan pengaturan awal</Button>
    </div>
  )
}
