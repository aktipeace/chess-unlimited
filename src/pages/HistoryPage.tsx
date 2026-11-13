import { useState } from 'react'
import { Copy } from 'lucide-react'
import MoveList from '../components/board/MoveList'
import Button from '../components/ui/Button'
import Panel from '../components/ui/Panel'
import type { ChessGameApi } from '../hooks/useChessGame'

export default function HistoryPage({ chess }: { chess: ChessGameApi }) {
  const [copyMsg, setCopyMsg] = useState<string | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(chess.pgn)
      setCopyMsg('PGN disalin.')
    } catch {
      setCopyMsg('Gagal menyalin. Pilih teks PGN lalu salin manual.')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-xl font-semibold">Game History</h1>
      <Panel title="Permainan saat ini" aside={<span className="num text-xs text-muted">{chess.moves.length} langkah</span>}>
        {chess.moves.length === 0 ? (
          <p className="text-sm text-muted">
            Belum ada permainan. Mainkan beberapa langkah di halaman Analysis, lalu riwayatnya muncul di sini.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="text-sm">
              <span className="font-semibold">{chess.status.label}</span>
              <span className="text-muted"> · {chess.status.detail}</span>
            </div>
            <MoveList moves={chess.moves} />
            <div>
              <h3 className="mb-1 text-xs font-semibold text-muted">PGN</h3>
              <textarea
                readOnly
                value={chess.pgn}
                rows={4}
                className="w-full resize-y rounded-md border border-line bg-ink p-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              />
              <div className="mt-2 flex items-center gap-3">
                <Button onClick={copy} icon={<Copy size={16} />}>Salin PGN</Button>
                {copyMsg && <span className="text-xs text-muted" role="status">{copyMsg}</span>}
              </div>
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}
