
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    address: "",
    phone: "",
    notes: "",
    paymentMethod: "COD",
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gudeg-cart");
      setItems(saved ? JSON.parse(saved) : []);
    } catch {
      setItems([]);
      setMessage("Data keranjang tidak dapat dibaca.");
    } finally {
      setLoading(false);
    }
  }, []);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const sessionResponse = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      const session = await sessionResponse.json();

      if (!session?.user?.id) {
        setMessage("Sesi login tidak ditemukan. Silakan masuk kembali.");
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            menuId: Number(item.menuId),
            quantity: Number(item.quantity),
          })),
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setMessage("Sesi login ditolak oleh server. Silakan login kembali.");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Checkout gagal.");
      }

      localStorage.removeItem("gudeg-cart");
      window.location.href = `/orders/${data.id}`;
    } catch (error) {
      setMessage(error.message || "Terjadi kesalahan saat checkout.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p>Memuat keranjang...</p>;
  }

  if (!items.length) {
    return (
      <section className="formWrap">
        <h1>Keranjang kosong</h1>
        <Link href="/menu">Kembali ke menu</Link>
      </section>
    );
  }

  return (
    <section className="formWrap wide">
      <h1>Checkout</h1>

      <p>
        Total pesanan: <b>{rupiah(total)}</b>
      </p>

      <form className="form" onSubmit={submit}>
        <label>
          Alamat lengkap
          <textarea
            required
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </label>

        <label>
          Nomor telepon
          <input
            required
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </label>

        <label>
          Catatan (opsional)
          <textarea
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />
        </label>

        <label>
          Metode pembayaran
          <select
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
          >
            <option value="COD">Bayar di tempat (COD)</option>
            <option value="TRANSFER">Transfer (konfirmasi manual)</option>
          </select>
        </label>

        {message && <p className="error">{message}</p>}

        <button type="submit" disabled={busy}>
          {busy ? "Membuat pesanan..." : "Buat Pesanan"}
        </button>
      </form>
    </section>
  );
}

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
