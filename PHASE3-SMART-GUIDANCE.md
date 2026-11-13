# Chess Unlimited — Fase 3.1 Smart Move Guidance

## Yang ditambahkan

- Memilih variasi MultiPV 1–5 langsung dari panel analisis.
- Panah papan mengikuti variasi yang sedang dipilih.
- Kartu petunjuk menampilkan bidak, petak asal, petak tujuan, dan notasi SAN.
- Pengaturan persisten untuk menampilkan/menyembunyikan panah Best Move.
- Pengujian unit untuk konversi UCI menjadi petunjuk, termasuk rokade.

## Roadmap Fase 3

1. **3.1 Smart Move Guidance (paket ini):** pilihan variasi, panah, dan instruksi langkah.
2. **3.2 Intelligent Move Explanation:** penjelasan taktik/ancaman berbasis variasi engine; klaim harus didukung data posisi, bukan tebakan.
3. **3.3 Interactive Training:** latihan memilih langkah, petunjuk bertahap, dan umpan balik.
4. **3.4 Professional Polish:** navigasi variasi, animasi, responsif, aksesibilitas, dan pengujian performa.

## Instalasi dan verifikasi di Windows PowerShell

Ekstrak ZIP ke folder baru, lalu jalankan:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

Buka alamat Local yang dicetak Vite.

## Cara menguji fitur 3.1

1. Pastikan analisis otomatis aktif.
2. Pilih posisi yang memiliki hasil MultiPV.
3. Klik variasi 1, 2, lalu 3 pada panel MultiPV.
4. Pastikan panah papan berpindah mengikuti langkah pertama variasi terpilih.
5. Pastikan kartu Petunjuk langkah terpilih menampilkan nama bidak, petak asal/tujuan, dan SAN.
6. Buka Settings → Papan, matikan lalu nyalakan "Tampilkan panah langkah terbaik".
7. Pastikan pilihan panah tersimpan setelah refresh.

Catatan: evaluasi utama tetap menampilkan MultiPV 1; pilihan variasi hanya mengubah petunjuk dan panah yang sedang ditampilkan.
