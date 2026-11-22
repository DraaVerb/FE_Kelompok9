import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  return <><div className="adminNav"><Link href="/admin">Dashboard</Link><Link href="/admin/menu">Kelola Menu</Link><Link href="/admin/orders">Pesanan Masuk</Link></div>{children}</>;
}
