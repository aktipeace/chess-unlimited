/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f1620',
        panel: '#161f2b',
        raised: '#1d2837',
        line: '#2a3a4e',
        fg: '#dbe3ec',
        muted: '#8797ab',
        accent: '#e6b450',
        danger: '#e5604d',
      },
      fontFamily: { sans: ['Figtree', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
