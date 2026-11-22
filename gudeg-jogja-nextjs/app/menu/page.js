
import { prisma } from "@/lib/prisma";
import { AddToCart } from "../components";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const menus = await prisma.menu.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <>
      <div className="pageTitle">
        <p className="eyebrow">Pilihan rasa</p>
        <h1>Daftar Menu</h1>
        <p>Pilih hidangan favoritmu.</p>
      </div>

      <div className="grid">
        {menus.map((m) => (
          <article className="menuCard" key={m.id}>
            {m.gambar ? (
              <img src={m.gambar} alt={m.nama} />
            ) : (
              <div className="placeholder">🍲</div>
            )}

            <div className="cardBody">
              <h2>{m.nama}</h2>
              <p>{m.deskripsi}</p>
              <strong>{rupiah(m.harga)}</strong>
              <AddToCart menu={m} />
            </div>
          </article>
        ))}

        {menus.length === 0 && <p>Belum ada menu.</p>}
      </div>
    </>
  );
}

function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}
