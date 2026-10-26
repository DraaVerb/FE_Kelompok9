# Gudeg Jogja — Next.js

Website HTML/CSS/JavaScript telah dipindahkan ke Next.js App Router.

## Menjalankan project
1. Pastikan Node.js versi LTS terpasang.
2. Buka terminal di folder project ini.
3. Jalankan `npm install`
4. Jalankan `npm run dev`
5. Buka http://localhost:3000

## Aset gambar
Salin folder `assets` dari project lama ke `public/assets/`. File HTML/CSS awal merujuk gambar berikut:
- `tugu-jogja.jpg`
- `gudeg-komplit.jpg`
- `gudeg-basah.jpg`
- `gudeg-kering.jpg`
- `gudeg-ayam.jpg`
- `gudeg-telur.jpg`
- `gudeg-krecek.jpg`
- `gudeg-ayam-kampung.jpg`
- `gudeg-areh.jpg`
- `gudeg-tahu-tempe.jpg`

Ulasan tetap disimpan di `localStorage` browser seperti versi lama. Ini bukan database bersama; ulasan tidak otomatis tersinkron antarperangkat atau pengguna.
