# Stockfish integration

The app loads the Stockfish 18 Lite single-threaded WebAssembly build in a dedicated Web Worker.

- Package: `stockfish@18.0.8`
- Runtime assets: `public/engine/stockfish-18-lite-single.js` and `.wasm`
- Assets are copied from the npm package by `scripts/copy-stockfish.mjs` during `npm install`.
- Communication uses UCI; the engine is configured for one thread, MultiPV is controlled by the UI, and analysis uses the selected target depth.

Stockfish is GPL-3.0. The matching license notice is copied alongside the runtime assets when the package includes it. Review the GPL-3.0 terms before redistributing a production build containing the engine. Source: https://github.com/nmrugg/stockfish.js/tree/v18.0.0
