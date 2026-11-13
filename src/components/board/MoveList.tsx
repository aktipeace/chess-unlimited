import type { Move } from 'chess.js'

export default function MoveList({ moves }: { moves: Move[] }) {
  if (moves.length === 0) {
    return <p className="text-sm text-muted">Belum ada langkah. Gerakkan bidak untuk memulai.</p>
  }
  const rows: { n: number; w: Move; b?: Move }[] = []
  for (let i = 0; i < moves.length; i += 2) rows.push({ n: i / 2 + 1, w: moves[i], b: moves[i + 1] })
  return (
    <ol className="num max-h-56 overflow-y-auto text-sm">
      {rows.map((r) => (
        <li key={r.n} className="grid grid-cols-[2rem_1fr_1fr] gap-2 py-0.5">
          <span className="text-muted">{r.n}.</span>
          <span>{r.w.san}</span>
          <span>{r.b?.san ?? ''}</span>
        </li>
      ))}
    </ol>
  )
}
