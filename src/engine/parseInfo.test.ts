import { describe, expect, it } from 'vitest'
import { mergeInfo, parseInfo } from './parseInfo'

describe('parseInfo', () => {
  it('parses centipawn scores and a principal variation', () => {
    expect(parseInfo('info depth 20 seldepth 27 multipv 1 score cp 34 nodes 12345 nps 500000 time 25 pv e2e4 e7e5 g1f3')).toEqual({
      depth: 20, multipv: 1, scoreCp: 34, scoreMate: null,
      pv: ['e2e4', 'e7e5', 'g1f3'], nodes: 12345, nps: 500000, timeMs: 25,
    })
  })

  it('parses mate scores', () => {
    expect(parseInfo('info depth 12 multipv 2 score mate -3 pv e1e2')).toMatchObject({
      depth: 12, multipv: 2, scoreCp: null, scoreMate: -3, pv: ['e1e2'],
    })
  })

  it('ignores non-info and incomplete lines', () => {
    expect(parseInfo('bestmove e2e4')).toBeNull()
    expect(parseInfo('info depth 10 nodes 100')).toBeNull()
  })

  it('keeps the latest info for each MultiPV slot', () => {
    const first = parseInfo('info depth 10 multipv 1 score cp 12 pv e2e4')!
    const second = parseInfo('info depth 10 multipv 2 score cp 8 pv d2d4')!
    const updated = parseInfo('info depth 11 multipv 1 score cp 20 pv g1f3')!
    const result = mergeInfo(mergeInfo({ depth: null, lines: [] }, first), second)
    expect(mergeInfo(result, updated).lines.map((line) => line.pv[0])).toEqual(['g1f3', 'd2d4'])
  })
})
