# Gudeg Jogja — Next.js

Website HTML/CSS/JavaScript telah dipindahkan ke Next.js App Router.

## Menjalankan project
1. Pastikan Node.js versi LTS terpasang.
2. Buka terminal di folder project ini.
3. Jalankan `npm install`
4. Siapkan database PostgreSQL, lalu buat file `.env` di folder ini. Isi `DATABASE_URL` dengan URL koneksi database milikmu, dengan format `postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public`. Ganti USER, PASSWORD, HOST, dan DATABASE dengan konfigurasi sebenarnya; encode karakter khusus pada password sebagai URL.
5. Jalankan `npx prisma validate`, lalu `npx prisma generate`.
6. Untuk database development yang baru, jalankan `npx prisma db push` untuk membuat tabel. Untuk database yang sudah berisi data, tinjau perubahan schema dan backup terlebih dahulu; jangan gunakan `--accept-data-loss` atau reset database sembarangan.
7. Jalankan `npm run dev`. Restart server setelah mengubah `.env`.
8. Buka http://localhost:3000

Project ini menggunakan Prisma dengan PostgreSQL. File `../database/gudeg.db` adalah SQLite dan tidak bisa dipakai sebagai `DATABASE_URL` untuk schema ini. Tanpa koneksi PostgreSQL yang valid, halaman yang mengambil data database tidak dapat berjalan.

## Database PostgreSQL Neon

Project menggunakan PostgreSQL Neon tanpa database lokal. Ambil connection string dari Neon Dashboard → Connect, lalu isi `DATABASE_URL` pada `.env` dengan connection string tersebut beserta opsi SSL yang diberikan Neon. Jangan commit `.env` atau membagikan kredensialnya.

Environment variable di Vercel tidak otomatis tersedia di laptop. Pertahankan konfigurasi autentikasi yang sudah ada dan restart server development setelah mengubah `.env`. Jika database Neon sudah berisi tabel dan data aplikasi, tidak perlu menjalankan reset atau `prisma db push` untuk fitur admin ini.

Jalankan `npm run dev` untuk development dan `npm run build` untuk memeriksa build produksi. Build yang berhasil tidak menggantikan pengujian koneksi database saat aplikasi berjalan.

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
