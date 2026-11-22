"use client";

import { useState } from "react";
import { normalizeMenuPhoto } from "@/lib/menu-photo";

export default function PhotoField({ value, onChange }) {
  let src = "";
  let error = "";
  try { src = normalizeMenuPhoto(value); } catch (e) { error = e.message; }
  return <div>
    <label>Foto menu (opsional)
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://... atau gudeg-ayam.jpg" aria-describedby="photo-help" />
    </label>
    <p id="photo-help">Gunakan URL gambar publik atau nama file yang sudah ada di public/assets. File lokal baru harus disertakan dalam deployment; ini bukan upload file.</p>
    {error ? <p className="error" role="alert">{error}</p> : src ? <Preview key={src} src={src} /> : <p>Belum ada foto.</p>}
    {value && <button type="button" className="secondary" onClick={() => onChange("")}>Hapus foto dari form</button>}
    <p>Perubahan foto baru diterapkan setelah menekan Simpan.</p>
  </div>;
}

function Preview({ src }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <p role="status">Foto tidak dapat dimuat. Periksa URL atau keberadaan file sebelum menyimpan.</p>;
  return <img src={src} alt="Preview foto menu" onError={() => setFailed(true)} style={{ width: "100%", maxWidth: 320, height: 200, objectFit: "cover", borderRadius: 12 }} />;
}