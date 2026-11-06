
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const folder = path.join(process.cwd(), "database");

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

// Koneksi database cukup satu kali
const db = new Database(path.join(folder, "gudeg.db"));

// Membuat tabel ulasan
db.exec(`
  CREATE TABLE IF NOT EXISTS ulasan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    komentar TEXT NOT NULL,
    rating INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
