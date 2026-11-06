"use client";

import { useEffect, useMemo, useState } from "react";

const menuData = [
  { nama: "Gudeg Basah", gambar: "gudeg-basah.jpg", deskripsi: "Gudeg dengan kuah santan yang lebih banyak sehingga memiliki tekstur lebih lembut dan gurih." },
  { nama: "Gudeg Kering", gambar: "gudeg-kering.jpg", deskripsi: "Gudeg dengan kuah yang lebih sedikit dan memiliki rasa manis yang khas." },
  { nama: "Gudeg Ayam", gambar: "gudeg-ayam.jpg", deskripsi: "Sajian Gudeg yang dilengkapi dengan potongan ayam berbumbu." },
  { nama: "Gudeg Telur", gambar: "gudeg-telur.jpg", deskripsi: "Gudeg yang disajikan bersama telur yang dimasak dengan bumbu khas." },
  { nama: "Gudeg Krecek", gambar: "gudeg-krecek.jpg", deskripsi: "Gudeg yang disajikan dengan sambal krecek bercita rasa gurih dan pedas." },
  { nama: "Gudeg Ayam Kampung", gambar: "gudeg-ayam-kampung.jpg", deskripsi: "Gudeg dengan pelengkap ayam kampung yang dimasak menggunakan bumbu khas." },
  { nama: "Gudeg Komplit", gambar: "gudeg-komplit.jpg", deskripsi: "Sajian Gudeg lengkap dengan nasi, ayam, telur, tahu, tempe dan krecek." },
  { nama: "Gudeg Areh", gambar: "gudeg-areh.jpg", deskripsi: "Gudeg dengan tambahan areh atau kuah santan kental sebagai pelengkap." },
  { nama: "Gudeg Tahu Tempe", gambar: "gudeg-tahu-tempe.jpg", deskripsi: "Gudeg yang disajikan bersama tahu dan tempe sebagai pelengkap." },
];

const faqData = [
  { tanya: "Apa itu Gudeg?", jawab: "Gudeg adalah makanan khas Yogyakarta yang dibuat dari nangka muda dan dimasak dengan bumbu khas." },
  { tanya: "Apa saja pelengkap Gudeg?", jawab: "Gudeg biasanya dapat disajikan bersama nasi, telur, ayam, tahu, tempe, dan sambal krecek." },
  { tanya: "Apa rasa Gudeg?", jawab: "Gudeg dikenal memiliki rasa manis, gurih, dan dapat dipadukan dengan sambal krecek yang pedas." },
  { tanya: "Mengapa Gudeg identik dengan Yogyakarta?", jawab: "Gudeg telah lama menjadi salah satu kuliner yang dikenal sebagai makanan khas Yogyakarta." },
];

export default function Home() {
  const [kataKunci, setKataKunci] = useState("");
  const [kategori, setKategori] = useState("semua");
  const [faqTerbuka, setFaqTerbuka] = useState([]);
  const [rating, setRating] = useState(0);
  const [nama, setNama] = useState("");
  const [teksUlasan, setTeksUlasan] = useState("");
  const [ulasan, setUlasan] = useState([]);
  const [sudahMemuat, setSudahMemuat] = useState(false);

  useEffect(() => {
    try {
      const tersimpan = JSON.parse(localStorage.getItem("ulasanGudeg") || "[]");
      if (Array.isArray(tersimpan)) setUlasan(tersimpan);
    } catch {
      setUlasan([]);
    }
    setSudahMemuat(true);
  }, []);

  useEffect(() => {
    if (sudahMemuat) localStorage.setItem("ulasanGudeg", JSON.stringify(ulasan));
  }, [ulasan, sudahMemuat]);

  const menuTersaring = useMemo(() => menuData.filter((menu) =>
    menu.nama.toLowerCase().includes(kataKunci.toLowerCase()) &&
    (kategori === "semua" || kategori === "gudeg")
  ), [kataKunci, kategori]);

  function tambahUlasan(event) {
    event.preventDefault();
    if (!nama.trim()) return alert("Silakan isi nama terlebih dahulu.");
    if (!rating) return alert("Silakan pilih rating bintang.");
    if (!teksUlasan.trim()) return alert("Silakan tulis ulasan terlebih dahulu.");
    setUlasan((sebelumnya) => [...sebelumnya, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      nama: nama.trim(), rating, teks: teksUlasan.trim()
    }]);
    setNama("");
    setTeksUlasan("");
    setRating(0);
    alert("Ulasan berhasil ditambahkan!");
  }

  function hapusUlasan(id) {
    if (confirm("Apakah kamu yakin ingin menghapus ulasan ini?")) {
      setUlasan((sebelumnya) => sebelumnya.filter((item) => item.id !== id));
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="logo">Gudeg Jogja</div>
        <ul className="nav-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#tentang">Tentang Gudeg</a></li>
          <li><a href="#sejarah">Sejarah</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#ulasan">Ulasan</a></li>
        </ul>
      </nav>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="subjudul">Kuliner Khas Yogyakarta</p>
            <h1>Gudeg Yogyakarta</h1>
            <p>Mengenal cita rasa, sejarah, dan berbagai macam sajian Gudeg khas Yogyakarta.</p>
            <a href="#menu" className="btn">Lihat Menu</a>
          </div>
        </section>

        <section id="tentang" className="section">
          <div className="judul-section">
            <p>Tentang Kuliner Nusantara</p><h2>Gudeg Yogyakarta</h2>
          </div>
          <div className="tentang-container">
            <div className="tentang-image">
              <img src="/assets/gudeg-komplit.jpg" alt="Gudeg Yogyakarta" />
            </div>
            <div className="tentang-text">
              <h3>Apa Itu Gudeg?</h3>
              <p>Gudeg merupakan salah satu makanan khas yang sangat identik dengan Yogyakarta. Makanan ini berbahan dasar nangka muda yang dimasak dengan berbagai bumbu dan santan hingga menghasilkan rasa yang khas.</p>
              <p>Gudeg biasanya disajikan bersama nasi, telur, ayam, tahu, tempe, dan sambal krecek. Perpaduan rasa manis, gurih, dan pedas menjadi ciri khas hidangan ini.</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <div className="info-card"><div className="info-icon">🍃</div><h3>Bahan Utama</h3><p>Nangka muda yang dimasak dengan bumbu khas dan santan.</p></div>
          <div className="info-card"><div className="info-icon">🥚</div><h3>Pelengkap</h3><p>Telur, ayam, tahu, tempe dan sambal krecek menjadi pelengkap Gudeg.</p></div>
          <div className="info-card"><div className="info-icon">🏛️</div><h3>Khas Yogyakarta</h3><p>Gudeg menjadi salah satu kuliner yang sangat dikenal dari Yogyakarta.</p></div>
        </section>

        <section id="sejarah" className="section sejarah-section">
          <div className="judul-section"><p>Cerita Kuliner</p><h2>Sejarah Gudeg</h2></div>
          <div className="sejarah-content">
            <p>Gudeg telah menjadi bagian dari kehidupan kuliner masyarakat Yogyakarta sejak lama. Proses memasak nangka muda dengan santan dan berbagai bumbu menghasilkan cita rasa yang khas.</p>
            <p>Seiring perkembangan zaman, Gudeg memiliki berbagai variasi penyajian. Ada Gudeg basah, Gudeg kering, Gudeg dengan ayam, telur, tahu, tempe, hingga sambal krecek.</p>
            <p>Saat ini Gudeg dapat ditemukan di berbagai tempat di Yogyakarta dan menjadi salah satu kuliner yang sering dicari oleh wisatawan.</p>
          </div>
        </section>

        <section id="menu" className="section">
          <div className="judul-section"><p>Pilihan Sajian</p><h2>Menu Gudeg</h2></div>
          <div className="filter-container">
            <input type="text" value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} placeholder="Cari menu Gudeg..." aria-label="Cari menu Gudeg" />
            <select value={kategori} onChange={(e) => setKategori(e.target.value)} aria-label="Filter kategori menu">
              <option value="semua">Semua Menu</option><option value="gudeg">Semua Gudeg</option>
            </select>
          </div>
          <div className="menu-container">
            {menuTersaring.map((menu) => (
              <article className="menu-card" key={menu.nama} data-kategori="gudeg">
                <img src={`/assets/${menu.gambar}`} alt={menu.nama} />
                <div className="menu-content"><h3>{menu.nama}</h3><p>{menu.deskripsi}</p></div>
              </article>
            ))}
          </div>
          {menuTersaring.length === 0 && <p className="menu-tidak-ada" style={{ display: "block" }}>Menu tidak ditemukan.</p>}
        </section>

        <section id="faq" className="section faq-section">
          <div className="judul-section"><p>Pertanyaan Umum</p><h2>FAQ</h2></div>
          <div className="faq-container">
            {faqData.map((faq, index) => {
              const terbuka = faqTerbuka.includes(index);
              return <div className="faq-item" key={faq.tanya}>
                <button className="faq-question" type="button" aria-expanded={terbuka} onClick={() => setFaqTerbuka((prev) => terbuka ? prev.filter((i) => i !== index) : [...prev, index])}>
                  {faq.tanya}<span>{terbuka ? "−" : "+"}</span>
                </button>
                <div className="faq-answer" hidden={!terbuka}><p>{faq.jawab}</p></div>
              </div>;
            })}
          </div>
        </section>

        <section id="ulasan" className="section ulasan-section">
          <div className="judul-section"><p>Pendapat Pengunjung</p><h2>Ulasan</h2></div>
          <form className="ulasan-form" onSubmit={tambahUlasan}>
            <h3>Tambahkan Ulasan</h3>
            <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama kamu" aria-label="Nama kamu" />
            <div className="rating-container">
              <p>Rating:</p>
              <div className="stars" role="group" aria-label="Pilih rating bintang">
                {[1, 2, 3, 4, 5].map((nilai) => <button className={`star ${nilai <= rating ? "aktif" : ""}`} type="button" key={nilai} aria-label={`${nilai} bintang`} aria-pressed={rating === nilai} onClick={() => setRating(nilai)}>★</button>)}
              </div>
              <p id="ratingText">{rating ? `${rating} dari 5 bintang` : "Belum memilih rating"}</p>
            </div>
            <textarea value={teksUlasan} onChange={(e) => setTeksUlasan(e.target.value)} rows={5} placeholder="Tulis ulasan kamu..." aria-label="Tulis ulasan kamu" />
            <button id="tambahUlasan" type="submit">Tambah Ulasan</button>
          </form>
          <div className="daftar-ulasan">
            {ulasan.length === 0 ? <p style={{ textAlign: "center" }}>Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p> :
              ulasan.map((item) => <article className="ulasan-card" key={item.id}>
                <h4>{item.nama}</h4>
                <div className="ulasan-rating" aria-label={`Rating ${item.rating} dari 5`}>{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</div>
                <p>{item.teks}</p>
                <button className="hapus-ulasan" type="button" onClick={() => hapusUlasan(item.id)}>Hapus</button>
              </article>)}
          </div>
        </section>
      </main>

      <footer>
        <h3>Gudeg Yogyakarta</h3>
        <p>Website kuliner Nusantara - Gudeg Yogyakarta</p>
        <p>© 2025 Gudeg Jogja</p>
      </footer>
    </>
  );
}
