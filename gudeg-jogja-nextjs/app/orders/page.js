
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          menu: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="container">
      <div className="pageTitle">
        <p className="eyebrow">Riwayat transaksi</p>
        <h1>Pesanan Saya</h1>
        <p>Daftar semua pesanan yang pernah kamu buat.</p>
      </div>

      {orders.length > 0 ? (
        <div className="panel">
          {orders.map((order) => (
            <div className="listRow" key={order.id}>
              <div>
                <strong>#{order.id.slice(-8)}</strong>
                <p>
                  {new Date(order.createdAt).toLocaleString("id-ID")}
                </p>
                <p>
                  Status: <strong>{order.status}</strong>
                </p>
                <p>
                  {order.items.length} jenis menu
                </p>
              </div>

              <div>
                <strong>{rupiah(order.total)}</strong>
                <p>
                  <Link href={`/orders/${order.id}`}>
                    Lihat Detail
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel">
          <h2>Belum ada pesanan</h2>
          <p>Pesanan yang berhasil kamu buat akan muncul di sini.</p>
          <Link href="/menu">Lihat Menu</Link>
        </div>
      )}
    </main>
  );
}
