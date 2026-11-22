"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateMenuPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "0", image: "" });
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault(); setError("");
    const res = await fetch("/api/admin/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.message || "Gagal menyimpan.");
    router.push("/admin/menu"); router.refresh();
  }
  return <section className="formWrap wide"><h1>Tambah Menu</h1><MenuForm form={form} setForm={setForm} submit={submit} error={error} /></section>;
}
function MenuForm({ form, setForm, submit, error }) {
  return <form className="form" onSubmit={submit}>
    <label>Nama menu<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
    <label>Deskripsi<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
    <label>Harga (Rupiah)<input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
    <label>Stok<input type="number" min="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></label>
    <label>URL gambar (opsional)<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
    {error && <p className="error">{error}</p>}<button>Simpan Menu</button>
  </form>;
}
