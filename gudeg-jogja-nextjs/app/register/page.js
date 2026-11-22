
"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "API registrasi belum tersedia. Periksa app/api/register/route.js."
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal.");
      }

      window.location.href = "/login?registered=1";
    } catch (error) {
      setMessage(error.message || "Terjadi kesalahan saat registrasi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="formWrap">
      <h1>Buat Akun</h1>

      <form className="form" onSubmit={submit}>
        <label>
          Nama
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </label>

        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </label>

        <label>
          Password (minimal 8 karakter)
          <input
            type="password"
            minLength={8}
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </label>

        {message && <p className="error">{message}</p>}

        <button type="submit" disabled={busy}>
          {busy ? "Mendaftar..." : "Daftar"}
        </button>
      </form>

      <p>
        Sudah punya akun? <Link href="/login">Masuk</Link>
      </p>
    </section>
  );
}
