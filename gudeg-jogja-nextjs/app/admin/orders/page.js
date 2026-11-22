import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } });
  return <><div className="pageTitle"><h1>Pesanan Masuk</h1></div><div className="panel">
    {orders.map((o) => <div className="listRow" key={o.id}><div><b>{o.user.name}</b><p>#{o.id.slice(-8)} · {o.status}</p></div><div><b>{rupiah(o.total)}</b><p><Link href={`/admin/orders/${o.id}`}>Kelola</Link></p></div></div>)}
    {!orders.length && <p>Belum ada pesanan.</p>}
  </div></>;
}
function rupiah(n) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n); }
