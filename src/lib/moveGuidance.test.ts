import { describe, expect, it } from 'vitest'
import { Chess } from 'chess.js'
import { getMoveGuidance } from './moveGuidance'

describe('petunjuk langkah engine', () => {
  it('mengubah langkah pion UCI menjadi petunjuk yang mudah dibaca', () => {
    const hint = getMoveGuidance(new Chess().fen(), 'e2e4')
    expect(hint).toEqual({ from: 'e2', to: 'e4', san: 'e4', piece: 'Pion' })
  })

  it('mengenali rokade sebagai gerakan raja', () => {
    const fen = 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1'
    const hint = getMoveGuidance(fen, 'e1g1')
    expect(hint).toEqual({ from: 'e1', to: 'g1', san: 'O-O', piece: 'Raja' })
  })

  it('mengembalikan null untuk UCI yang tidak legal pada posisi', () => {
    expect(getMoveGuidance(new Chess().fen(), 'e2e5')).toBeNull()
    expect(getMoveGuidance(new Chess().fen(), 'not-a-move')).toBeNull()
  })
})
