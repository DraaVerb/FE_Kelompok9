
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RiwayatPemesananPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { menu: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container">
      <div className="pageTitle">
        <h1>Riwayat Pemesanan</h1>
      </div>

      {orders.length === 0 ? (
        <div className="panel">
          <p>Kamu belum memiliki pesanan.</p>
          <Link className="button" href="/menu">
            Lihat Menu
          </Link>
        </div>
      ) : (
        <div className="panel">
          {orders.map((order) => (
            <div className="listRow" key={order.id}>
              <div>
                <b>Pesanan #{order.id.slice(-8)}</b>
                <p>Status: {order.status}</p>
                <p>
                  {order.items.length} jenis menu
                </p>
              </div>

              <div>
                <b>{rupiah(order.total)}</b>
                <p>
                  <Link href={`/orders/${order.id}`}>
                    Lihat Detail
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
