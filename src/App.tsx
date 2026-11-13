import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import { useChessGame } from './hooks/useChessGame'
import { useSettings } from './hooks/useSettings'
import AnalysisPage from './pages/AnalysisPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import type { PageId } from './types'

export default function App() {
  const [page, setPage] = useState<PageId>('analysis')
  const { settings, update, reset } = useSettings()
  const chess = useChessGame()

  return (
    <div className="min-h-full md:flex">
      <Sidebar page={page} onChange={setPage} />
      <main className="min-w-0 flex-1 p-4 pb-24 md:p-6">
        {page === 'analysis' && <AnalysisPage chess={chess} settings={settings} onSetting={update} />}
        {page === 'history' && <HistoryPage chess={chess} />}
        {page === 'settings' && <SettingsPage settings={settings} onSetting={update} onReset={reset} />}
      </main>
    </div>
  )
}
