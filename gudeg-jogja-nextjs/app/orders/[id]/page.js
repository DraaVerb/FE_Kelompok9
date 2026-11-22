
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { menu: true } },
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  // USER hanya boleh melihat pesanan miliknya.
  // ADMIN boleh melihat semua pesanan.
  if (
    session.user.role !== "ADMIN" &&
    order.userId !== session.user.id
  ) {
    notFound();
  }

  return (
    <main className="container">
      <div className="pageTitle">
        <h1>Detail Pesanan</h1>
      </div>

      <div className="panel">
        <p>
          Nomor pesanan: <b>#{order.id.slice(-8)}</b>
        </p>
        <p>
          Status pesanan: <b>{order.status}</b>
        </p>
        <p>Nama pelanggan: {order.user?.name}</p>
        <p>Alamat: {order.address}</p>
        <p>Telepon: {order.phone}</p>

        <h2>Daftar Item</h2>

        {order.items.map((item) => (
          <div className="listRow" key={item.id}>
            <span>
              {item.menu?.nama} × {item.quantity}
            </span>
            <b>
              {rupiah(item.price * item.quantity)}
            </b>
          </div>
        ))}

        <h2>Total: {rupiah(order.total)}</h2>

        <p>
          Metode pembayaran: {order.payment?.method || "-"}
        </p>
        <p>
          Status pembayaran: {order.payment?.status || "-"}
        </p>

        <Link className="button" href="/orders">
          Kembali ke Pesanan Saya
        </Link>
      </div>
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
