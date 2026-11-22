"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PhotoField from "../../photo-field";

export default function EditMenuPage() {
  const { id } = useParams(); const router = useRouter();
  const [form, setForm] = useState(null); const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setForm(null); setError("");
    fetch("/api/admin/menu", { cache: "no-store" }).then(async (r) => {
      const items = await r.json();
      if (!r.ok) throw new Error(items.message || "Gagal memuat menu.");
      const item = items.find((x) => String(x.id) === String(id));
      if (!item) throw new Error("Menu tidak ditemukan.");
      if (!cancelled) setForm({ name: item.nama, description: item.deskripsi || "", price: String(item.harga), stock: String(item.stock), image: item.gambar || "", active: item.active });
    }).catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [id]);
  async function submit(e) {
    e.preventDefault(); setError("");
    try {
    const res = await fetch(`/api/admin/menu/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json(); if (!res.ok) return setError(data.message || "Gagal menyimpan.");
    router.push("/admin/menu"); router.refresh();
    } catch { setError("Koneksi bermasalah. Muat ulang untuk memeriksa hasil penyimpanan."); }
  }
  async function deactivate() {
    if (!confirm("Nonaktifkan menu ini?")) return;
    const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    if (res.ok) { router.push("/admin/menu"); router.refresh(); }
  }
  if (!form) return <p role="status">{error || "Memuat data menu..."}</p>;
  return <section className="formWrap wide"><h1>Edit Menu</h1><form className="form" onSubmit={submit}>
    <label>Nama<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
    <label>Deskripsi<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
    <label>Harga<input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
    <label>Stok<input type="number" min="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></label>
    <PhotoField value={form.image} onChange={(image) => setForm({ ...form, image })} />
    <label className="check"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Menu aktif</label>
    {error && <p className="error">{error}</p>}<button>Simpan Perubahan</button><button type="button" className="secondary" onClick={deactivate}>Nonaktifkan Menu</button>
  </form></section>;
}
