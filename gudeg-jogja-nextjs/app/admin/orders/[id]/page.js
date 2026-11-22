"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];
export default function AdminOrderDetailPage() {
  const { id } = useParams(); const [order, setOrder] = useState(null); const [message, setMessage] = useState("");
  async function load() { const r = await fetch(`/api/orders/${id}`); const d = await r.json(); if (r.ok) setOrder(d); else setMessage(d.message); }
  useEffect(() => { load(); }, [id]);
  async function update(status) {
    const r = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const d = await r.json(); if (r.ok) { setOrder({ ...order, status }); setMessage("Status berhasil diperbarui."); } else setMessage(d.message);
  }
  if (!order) return <p>{message || "Memuat..."}</p>;
  return <section className="panel"><h1>Pesanan #{order.id.slice(-8)}</h1><p>Pelanggan: {order.user?.name || "-"}</p><p>Alamat: {order.address}</p><p>Telepon: {order.phone}</p><p>Total: {rupiah(order.total)}</p>
    <h2>Item</h2>{order.items.map((x) => <p key={x.id}>{x.menu.name} × {x.quantity}</p>)}
    <label>Ubah status<select value={order.status} onChange={(e) => update(e.target.value)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label>
    {message && <p>{message}</p>}
  </section>;
}
function rupiah(n) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n); }
