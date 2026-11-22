"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { setItems(JSON.parse(localStorage.getItem("gudeg-cart") || "[]")); }, []);
  function save(next) { setItems(next); localStorage.setItem("gudeg-cart", JSON.stringify(next)); }
  function change(id, delta) { save(items.map((x) => x.menuId === id ? { ...x, quantity: Math.max(1, x.quantity + delta) } : x)); }
  function remove(id) { save(items.filter((x) => x.menuId !== id)); }
  const total = items.reduce((sum, x) => sum + x.price * x.quantity, 0);
  return <><div className="pageTitle"><h1>Keranjang</h1></div>
    {items.length === 0 ? <p>Keranjang masih kosong. <Link href="/menu">Pilih menu</Link></p> : <>
      <div className="cartList">{items.map((x) => <div className="cartRow" key={x.menuId}>
        <div><b>{x.name}</b><p>{rupiah(x.price)} × {x.quantity}</p></div>
        <div className="quantity"><button onClick={() => change(x.menuId, -1)}>−</button><span>{x.quantity}</span><button onClick={() => change(x.menuId, 1)}>+</button><button className="danger" onClick={() => remove(x.menuId)}>Hapus</button></div>
      </div>)}</div>
      <h2>Total: {rupiah(total)}</h2><Link className="button" href="/checkout">Lanjut Checkout</Link>
    </>}
  </>;
}
function rupiah(n) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n); }
