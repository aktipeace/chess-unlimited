import { useCallback, useState } from 'react'
import type { Settings } from '../types'

const KEY = 'chess-unlimited:settings'

export const DEFAULT_SETTINGS: Settings = {
  showLegalMoves: true,
  showLastMove: true,
  showCoordinates: true,
  animationMs: 200,
  targetDepth: 14,
  multiPv: 1,
  showBestMoveArrow: true,
}

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_SETTINGS
    const p = JSON.parse(raw) as Partial<Settings>
    return {
      showLegalMoves: typeof p.showLegalMoves === 'boolean' ? p.showLegalMoves : DEFAULT_SETTINGS.showLegalMoves,
      showLastMove: typeof p.showLastMove === 'boolean' ? p.showLastMove : DEFAULT_SETTINGS.showLastMove,
      showCoordinates: typeof p.showCoordinates === 'boolean' ? p.showCoordinates : DEFAULT_SETTINGS.showCoordinates,
      animationMs: typeof p.animationMs === 'number' ? p.animationMs : DEFAULT_SETTINGS.animationMs,
      targetDepth: typeof p.targetDepth === 'number' ? p.targetDepth : DEFAULT_SETTINGS.targetDepth,
      multiPv: typeof p.multiPv === 'number' ? p.multiPv : DEFAULT_SETTINGS.multiPv,
      showBestMoveArrow: typeof p.showBestMoveArrow === 'boolean' ? p.showBestMoveArrow : DEFAULT_SETTINGS.showBestMoveArrow,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function save(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* penyimpanan tidak tersedia: pengaturan tetap berlaku selama sesi */
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load)

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      save(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    save(DEFAULT_SETTINGS)
    setSettings(DEFAULT_SETTINGS)
  }, [])

  return { settings, update, reset }
}
