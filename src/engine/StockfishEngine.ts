import type { EngineAnalysis, EngineLine } from './parseInfo'
import { mergeInfo, parseInfo } from './parseInfo'

export interface StockfishEngineOptions {
  onAnalysis: (analysis: EngineAnalysis) => void
  onBestMove: (bestMove: string, ponder?: string) => void
  onReady?: () => void
  onError?: (message: string) => void
}

interface SearchRequest {
  fen: string
  depth: number
  multiPv: number
}

/**
 * UCI adapter for the Stockfish 18 Lite single-threaded worker build.
 *
 * Important: UCI searches are serialized. A new position/go command is not
 * sent until the previous search has answered its stop command with bestmove.
 */
export class StockfishEngine {
  private worker: Worker
  private options: StockfishEngineOptions
  private analysis: EngineAnalysis = { depth: null, lines: [] }
  private ready = false
  private searching = false
  private pendingSearch: SearchRequest | null = null
  private stopping = false
  private destroyed = false

  constructor(options: StockfishEngineOptions) {
    this.options = options
    this.worker = new Worker('/engine/stockfish-18-lite-single.js')
    this.worker.onmessage = (event: MessageEvent<string>) => {
      this.handleMessage(String(event.data))
    }
    this.worker.onerror = (event) => {
      const location = event.filename
        ? ` (${event.filename}${event.lineno ? `:${event.lineno}` : ''})`
        : ''
      this.options.onError?.(
        `${event.message || 'Worker Stockfish gagal dijalankan.'}${location}`,
      )
    }
    this.worker.onmessageerror = () => {
      this.options.onError?.('Pesan dari Worker Stockfish tidak dapat dibaca.')
    }
    this.send('uci')
  }

  private send(command: string) {
    if (!this.destroyed) this.worker.postMessage(command)
  }

  private handleMessage(message: string) {
    const line = message.trim()
    if (!line) return

    if (line === 'uciok') {
      this.send('setoption name Threads value 1')
      this.send('isready')
      return
    }

    if (line === 'readyok') {
      this.ready = true
      this.options.onReady?.()
      return
    }

    if (line.startsWith('info ')) {
      // Ignore output belonging to a search that is being replaced.
      if (this.pendingSearch || this.stopping) return
      const parsed: EngineLine | null = parseInfo(line)
      if (parsed) {
        this.analysis = mergeInfo(this.analysis, parsed)
        this.options.onAnalysis(this.analysis)
      }
      return
    }

    if (line.startsWith('bestmove ')) {
      const [, bestMove, ponderToken, ponder] = line.split(/\s+/)
      this.searching = false
      this.stopping = false

      // A newer position arrived while this search was running. Start only
      // the newest queued request after the old search has fully stopped.
      if (this.pendingSearch) {
        const next = this.pendingSearch
        this.pendingSearch = null
        this.launch(next)
        return
      }

      if (bestMove && bestMove !== '(none)' && bestMove !== '0000') {
        this.options.onBestMove(bestMove, ponderToken === 'ponder' ? ponder : undefined)
      }
    }
  }

  private launch(request: SearchRequest) {
    if (!this.ready || this.destroyed) return
    this.analysis = { depth: null, lines: [] }
    this.options.onAnalysis(this.analysis)
    this.send(`setoption name MultiPV value ${request.multiPv}`)
    this.send(`position fen ${request.fen}`)
    this.searching = true
    this.send(`go depth ${request.depth}`)
  }

  analyze(fen: string, depth: number, multiPv: number) {
    if (!this.ready || this.destroyed) return
    const request = { fen, depth, multiPv }

    if (this.searching) {
      // Coalesce rapid board changes: keep only the newest requested position.
      this.pendingSearch = request
      if (!this.stopping) {
        this.stopping = true
        this.send('stop')
      }
      return
    }

    this.pendingSearch = null
    this.launch(request)
  }

  stop() {
    this.pendingSearch = null
    if (this.ready && this.searching && !this.stopping) {
      this.stopping = true
      this.send('stop')
    }
  }

  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    this.pendingSearch = null
    try {
      this.worker.postMessage('quit')
    } finally {
      this.worker.terminate()
      this.ready = false
      this.searching = false
      this.stopping = false
    }
  }
}
