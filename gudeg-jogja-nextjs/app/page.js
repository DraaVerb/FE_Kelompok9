import Link from "next/link";
import { prisma } from "../lib/prisma";

export default async function HomePage() {
  const menus = await prisma.menu.findMany({ where: { active: true }, take: 3, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <section className="hero">
        <p className="eyebrow">Cita rasa khas Yogyakarta</p>
        <h1>Gudeg Jogja,<br />hangat sampai rumah.</h1>
        <p>Nikmati gudeg dengan rasa manis, gurih, dan autentik.</p>
        <Link className="button" href="/menu">Lihat Menu</Link>
      </section>
      <section>
        <div className="sectionHead"><h2>Menu pilihan</h2><Link href="/menu">Lihat semua →</Link></div>
        <div className="grid">
          {menus.map((m) => <article className="menuCard" key={m.id}>
            {m.image ? <img src={m.image} alt={m.name} /> : <div className="placeholder">🍲</div>}
            <div className="cardBody"><h3>{m.name}</h3><p>{m.description}</p><strong>{rupiah(m.price)}</strong></div>
          </article>)}
          {menus.length === 0 && <p>Menu akan tampil di sini setelah admin menambahkannya.</p>}
        </div>
      </section>
    </div>
  );
}
function rupiah(n) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n); }
