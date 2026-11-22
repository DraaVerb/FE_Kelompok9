import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function AdminMenuPage() {
  const menus = await prisma.menu.findMany({ orderBy: { createdAt: "desc" } });
  return <><div className="sectionHead"><h1>Kelola Menu</h1><Link className="button" href="/admin/menu/create">Tambah Menu</Link></div>
    <div className="panel">{menus.map((m) => <div className="listRow" key={m.id}>
      <div><b>{m.nama}</b><p>{rupiah(m.harga)} · stok {m.stock} · {m.active ? "Aktif" : "Nonaktif"}</p><p>{m.gambar ? "Foto tersedia — buka Edit untuk preview" : "Belum ada foto"}</p></div>
      <Link href={`/admin/menu/${m.id}/edit`}>Edit</Link>
    </div>)}</div>
  </>;
}
function rupiah(n) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n); }
