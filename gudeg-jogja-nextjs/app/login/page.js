"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError("Email atau password salah.");
    else location.href = "/";
  }
  return <section className="formWrap"><h1>Masuk</h1><form onSubmit={submit} className="form">
    <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
    <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
    {error && <p className="error">{error}</p>}
    <button disabled={loading}>{loading ? "Memproses..." : "Masuk"}</button>
  </form><p>Belum punya akun? <Link href="/register">Daftar</Link></p></section>;
}
