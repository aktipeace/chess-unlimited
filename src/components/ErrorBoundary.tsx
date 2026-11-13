import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State { error: Error | null }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Aplikasi gagal ditampilkan:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md rounded-lg border border-line bg-panel p-6">
          <h1 className="text-lg font-semibold">Terjadi kesalahan</h1>
          <p className="mt-2 text-sm text-muted">{this.state.error.message}</p>
          <button
            className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={() => window.location.reload()}
          >
            Muat ulang halaman
          </button>
        </div>
      </div>
    )
  }
}
