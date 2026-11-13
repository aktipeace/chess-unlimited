import { copyFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const packageRoot = dirname(require.resolve('stockfish'))
const sourceDir = join(packageRoot, 'bin')
const destination = join(projectRoot, 'public', 'engine')

await mkdir(destination, { recursive: true })
for (const file of ['stockfish-18-lite-single.js', 'stockfish-18-lite-single.wasm']) {
  await copyFile(join(sourceDir, file), join(destination, file))
}

// Keep the engine's GPL notice alongside the redistributed engine assets.
for (const candidate of ['Copying.txt', 'COPYING.txt', 'LICENSE']) {
  try {
    await copyFile(join(packageRoot, candidate), join(destination, 'COPYING.txt'))
    break
  } catch {
    // Try the next known package license filename.
  }
}

console.log('Stockfish 18 Lite single-threaded assets copied to public/engine.')
