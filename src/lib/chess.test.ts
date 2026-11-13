import { describe, expect, it } from 'vitest'
import { Chess } from 'chess.js'
import { findKing, getStatus, needsPromotion, safeMove } from './chess'

describe('aturan catur', () => {
  it('menerima langkah legal', () => {
    const g = new Chess()
    expect(safeMove(g, 'e2', 'e4')?.san).toBe('e4')
    expect(g.turn()).toBe('b')
  })

  it('menolak langkah ilegal', () => {
    const g = new Chess()
    const before = g.fen()
    expect(safeMove(g, 'e2', 'e5')).toBeNull()
    expect(safeMove(g, 'a1', 'a3')).toBeNull()
    expect(safeMove(g, 'e7', 'e5')).toBeNull()
    expect(g.fen()).toBe(before)
  })

  it('menjalankan rokade pendek dan memindahkan benteng otomatis', () => {
    const g = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
    const move = safeMove(g, 'e1', 'g1')
    expect(move?.san).toBe('O-O')
    expect(g.get('g1')?.type).toBe('k')
    expect(g.get('f1')?.type).toBe('r')
    expect(g.get('h1')).toBeUndefined()
  })

  it('menjalankan rokade panjang dan memindahkan benteng otomatis', () => {
    const g = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
    const move = safeMove(g, 'e1', 'c1')
    expect(move?.san).toBe('O-O-O')
    expect(g.get('c1')?.type).toBe('k')
    expect(g.get('d1')?.type).toBe('r')
    expect(g.get('a1')).toBeUndefined()
  })

  it('undo mengembalikan posisi', () => {
    const g = new Chess()
    const start = g.fen()
    safeMove(g, 'e2', 'e4')
    g.undo()
    expect(g.fen()).toBe(start)
  })

  it('reset mengembalikan posisi awal', () => {
    const g = new Chess()
    safeMove(g, 'd2', 'd4')
    g.reset()
    expect(g.fen()).toBe(new Chess().fen())
    expect(g.history()).toHaveLength(0)
  })

  it("mendeteksi skakmat (fool's mate)", () => {
    const g = new Chess()
    safeMove(g, 'f2', 'f3')
    safeMove(g, 'e7', 'e5')
    safeMove(g, 'g2', 'g4')
    safeMove(g, 'd8', 'h4')
    const s = getStatus(g)
    expect(s.kind).toBe('checkmate')
    expect(s.detail).toBe('Hitam menang')
    expect(findKing(g, 'w')).toBe('e1')
    expect(safeMove(g, 'a2', 'a3')).toBeNull()
  })

  it('mendeteksi stalemate', () => {
    const g = new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1')
    expect(getStatus(g).kind).toBe('stalemate')
  })

  it('mendeteksi kebutuhan promosi', () => {
    const g = new Chess('8/P6k/8/8/8/8/7K/8 w - - 0 1')
    expect(needsPromotion(g, 'a7', 'a8')).toBe(true)
    expect(safeMove(g, 'a7', 'a8', 'q')?.promotion).toBe('q')
  })
})
