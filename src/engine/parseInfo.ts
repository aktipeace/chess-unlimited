export interface EngineLine {
  depth: number | null
  multipv: number
  scoreCp: number | null
  scoreMate: number | null
  /** UCI coordinate moves, e.g. e2e4 e7e5. */
  pv: string[]
  nodes: number | null
  nps: number | null
  timeMs: number | null
}

export interface EngineAnalysis {
  depth: number | null
  lines: EngineLine[]
}

/** Parse one Stockfish UCI `info` line. Returns null for non-info or unusable lines. */
export function parseInfo(line: string): EngineLine | null {
  const tokens = line.trim().split(/\s+/)
  if (tokens[0] !== 'info') return null

  const readNumber = (key: string): number | null => {
    const index = tokens.indexOf(key)
    if (index < 0 || index + 1 >= tokens.length) return null
    const value = Number(tokens[index + 1])
    return Number.isFinite(value) ? value : null
  }

  const depth = readNumber('depth')
  const multipv = readNumber('multipv') ?? 1
  const scoreIndex = tokens.indexOf('score')
  let scoreCp: number | null = null
  let scoreMate: number | null = null
  if (scoreIndex >= 0 && scoreIndex + 2 < tokens.length) {
    const kind = tokens[scoreIndex + 1]
    const value = Number(tokens[scoreIndex + 2])
    if (Number.isFinite(value)) {
      if (kind === 'cp') scoreCp = value
      if (kind === 'mate') scoreMate = value
    }
  }

  const pvIndex = tokens.indexOf('pv')
  const pv = pvIndex >= 0 ? tokens.slice(pvIndex + 1).filter((move) => /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move)) : []
  if (depth === null || (scoreCp === null && scoreMate === null) || pv.length === 0) return null

  return {
    depth,
    multipv: Math.max(1, multipv),
    scoreCp,
    scoreMate,
    pv,
    nodes: readNumber('nodes'),
    nps: readNumber('nps'),
    timeMs: readNumber('time'),
  }
}

/** Merge streamed MultiPV info lines, retaining the latest line per variation. */
export function mergeInfo(current: EngineAnalysis, line: EngineLine): EngineAnalysis {
  const lines = current.lines.filter((item) => item.multipv !== line.multipv)
  lines.push(line)
  lines.sort((a, b) => a.multipv - b.multipv)
  return { depth: Math.max(current.depth ?? 0, line.depth ?? 0), lines }
}
