# Cara memasang Chess Unlimited Phase 4

## A. Siapkan source code

1. Download file `chess-unlimited-phase4-mobile-optimized.zip` dari ChatGPT.
2. Extract ZIP ke folder baru, misalnya `chess-unlimited-phase4`.
3. Buka Visual Studio Code.
4. Pilih **File → Open Folder**, lalu pilih folder hasil extract. Pastikan `package.json` terlihat di root folder.

## B. Install dan cek project

1. Di VS Code pilih **Terminal → New Terminal**.
2. Pastikan terminal berada di folder yang berisi `package.json`.
3. Jalankan perintah berikut satu per satu:

```bash
npm ci
```

Tunggu sampai instalasi selesai. Setelah itu jalankan:

```bash
npm test
```

Jika test selesai tanpa error, jalankan:

```bash
npm run build
```

Build yang berhasil akan membuat folder `dist`. Jangan upload folder `node_modules`.

## C. Deploy ke Vercel

### Jika project terhubung ke GitHub

1. Buka repository GitHub yang saat ini terhubung ke project Vercel.
2. Ganti file source lama dengan isi folder Phase 4 hasil extract.
3. Jangan ikut menyalin folder `node_modules` atau `dist`.
4. Commit dan push perubahan ke branch production (biasanya `main`).
5. Buka Vercel → project Chess Unlimited → tab **Deployments**.
6. Tunggu deployment terbaru berstatus **Ready**.

### Jika menggunakan Vercel CLI

1. Buka terminal di folder project.
2. Jalankan `npx vercel` untuk menghubungkan folder dengan project Vercel yang sudah ada.
3. Ikuti prompt dan pilih project Chess Unlimited yang benar.
4. Setelah terhubung, jalankan `npx vercel --prod`.

## D. Tes dari HP

1. Buka `https://chess-unlimited-three.vercel.app/` di Chrome atau Safari HP.
2. Jika masih melihat tampilan lama, lakukan refresh penuh atau tutup tab lalu buka kembali.
3. Pastikan papan terlihat penuh tanpa zoom manual.
4. Coba tap satu bidak lalu tap kotak tujuan.
5. Coba drag bidak, Undo, Reset, dan Flip board.
6. Scroll ke panel Analisis Engine dan pastikan mode HP terlihat dengan MultiPV 1.
7. Mainkan beberapa langkah berurutan dan perhatikan apakah HP tetap responsif.
8. Uji halaman History dan Settings, termasuk navigasi bawah.

Gunakan `MOBILE-TEST-CHECKLIST.md` untuk mencatat hasil tes. Jika ada error pada `npm test` atau `npm run build`, kirim teks error lengkapnya sebelum deploy.
