interface Props {
  /** Skor dalam centipawn dari sudut pandang Putih. null = belum ada analisis. */
  evaluation: number | null
}

export default function EvalBar({ evaluation }: Props) {
  const whitePct = evaluation === null ? 50 : 50 + 50 * (2 / (1 + Math.exp(-evaluation / 400)) - 1)
  return (
    <div
      role="img"
      aria-label={evaluation === null ? 'Evaluasi belum tersedia' : `Evaluasi ${(evaluation / 100).toFixed(2)}`}
      className="flex h-3 overflow-hidden rounded-full border border-line"
    >
      {evaluation === null ? (
        <div className="h-full w-full bg-raised" />
      ) : (
        <>
          <div className="h-full bg-fg transition-all" style={{ width: `${whitePct}%` }} />
          <div className="h-full flex-1 bg-ink" />
        </>
      )}
    </div>
  )
}
