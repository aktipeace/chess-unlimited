# Phase 4 — Mobile & Performance Optimization

## Perubahan

- Papan catur sekarang membaca lebar container dengan `ResizeObserver` dan meneruskan nilainya ke `react-chessboard` melalui `boardWidth`. Ini menghindari ukuran papan tetap yang terlalu lebar di ponsel.
- Lebar papan dibatasi oleh lebar container, bukan tinggi viewport. Papan mempertahankan rasio 1:1.
- Layout halaman analisis memakai kolom tunggal pada layar kecil dan kembali ke panel samping pada desktop lebar.
- Area navigasi bawah memperhitungkan safe-area perangkat, dan konten diberi ruang agar tidak tertutup navigasi.
- Touch interaction pada papan dioptimalkan agar browser tidak menganggap gerakan di atas papan sebagai gesture zoom/scroll. Pinch zoom halaman tetap tidak dinonaktifkan.
- Default analisis diturunkan menjadi depth 14 dan MultiPV 1. Di layar ponsel, engine dibatasi maksimal depth 15 dan MultiPV 1, meskipun pengaturan tersimpan sebelumnya lebih tinggi.
- Analisis otomatis diberi jeda 500 ms di ponsel (250 ms di desktop) setelah posisi berubah. Pencarian lama dihentikan lebih awal agar tidak terus membebani perangkat.
- Konversi variasi UCI ke SAN dimemoisasi agar tidak dihitung ulang pada setiap pembaruan UI.

## Cara build dan test

```bash
npm ci
npm test
npm run build
```

## Deploy ke Vercel

1. Extract ZIP versi Phase 4.
2. Buka folder proyek di terminal.
3. Jalankan `npm ci`.
4. Jalankan `npm test`.
5. Jalankan `npm run build`.
6. Jika kedua perintah lolos, commit/push ke repository yang terhubung ke Vercel atau deploy folder proyek melalui Vercel CLI.
7. Setelah deploy, buka URL di HP dan lakukan checklist pada dokumen pengujian mobile.
