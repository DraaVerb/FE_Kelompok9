
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => setUser(session?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="header">
      <Link className="brand" href="/">
        Gudeg<span>Jogja</span>
      </Link>

      <nav>
        <Link href="/menu">Menu</Link>
        <Link href="/orders">Pesanan</Link>

        {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}

        {user ? (
          <button
            className="linkButton"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Keluar
          </button>
        ) : (
          <Link href="/login">Masuk</Link>
        )}

        <Link className="cartLink" href="/cart">
          Keranjang
        </Link>
      </nav>
    </header>
  );
}

export function AddToCart({ menu }) {
  const add = () => {
    try {
      const savedCart = localStorage.getItem("gudeg-cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];

      const found = cart.find((item) => item.menuId === menu.id);

      if (found) {
        found.quantity += 1;
      } else {
        cart.push({
          menuId: menu.id,
          name: menu.nama,
          price: menu.harga,
          image: menu.gambar,
          quantity: 1,
        });
      }

      localStorage.setItem("gudeg-cart", JSON.stringify(cart));

      alert(`${menu.nama} berhasil ditambahkan ke keranjang.`);
    } catch (error) {
      console.error("Gagal menambahkan ke keranjang:", error);
      alert("Keranjang gagal diperbarui. Silakan coba lagi.");
    }
  };

  return (
    <button type="button" onClick={add}>
      Tambah ke keranjang
    </button>
  );
}
