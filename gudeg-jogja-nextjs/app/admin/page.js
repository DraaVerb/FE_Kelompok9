import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const [menus, orders, users] = await Promise.all([
    prisma.menu.count(), prisma.order.count(), prisma.user.count(),
  ]);
  return <><div className="pageTitle"><h1>Dashboard Admin</h1></div>
    <div className="stats"><div className="stat"><b>{menus}</b><span>Total menu</span></div><div className="stat"><b>{orders}</b><span>Total pesanan</span></div><div className="stat"><b>{users}</b><span>Total pengguna</span></div></div>
    <p><Link className="button" href="/admin/menu">Kelola menu</Link> <Link className="button" href="/admin/orders">Kelola pesanan</Link></p>
  </>;
}
