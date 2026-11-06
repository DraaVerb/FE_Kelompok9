
import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: mengambil semua ulasan dari SQLite
export async function GET() {
  try {
    const ulasan = db
      .prepare("SELECT * FROM ulasan ORDER BY id DESC")
      .all();

    return NextResponse.json(ulasan);
  } catch (error) {
    console.error("Gagal mengambil ulasan:", error);

    return NextResponse.json(
      { error: "Gagal mengambil data ulasan" },
      { status: 500 }
    );
  }
}

// POST: menyimpan ulasan baru ke SQLite
export async function POST(request) {
  try {
    const { nama, teks, rating } = await request.json();

    if (!nama?.trim() || !teks?.trim() || !rating) {
      return NextResponse.json(
        { error: "Data ulasan tidak lengkap" },
        { status: 400 }
      );
    }

    const hasil = db
      .prepare(
        `INSERT INTO ulasan (nama, komentar, rating)
         VALUES (?, ?, ?)`
      )
      .run(nama.trim(), teks.trim(), Number(rating));

    const ulasanBaru = db
      .prepare("SELECT * FROM ulasan WHERE id = ?")
      .get(hasil.lastInsertRowid);

    return NextResponse.json(ulasanBaru, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan ulasan:", error);

    return NextResponse.json(
      { error: "Gagal menyimpan ulasan" },
      { status: 500 }
    );
  }
}

// DELETE: menghapus ulasan dari SQLite
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    db.prepare("DELETE FROM ulasan WHERE id = ?").run(id);

    return NextResponse.json({
      message: "Ulasan berhasil dihapus",
    });
  } catch (error) {
    console.error("Gagal menghapus ulasan:", error);

    return NextResponse.json(
      { error: "Gagal menghapus ulasan" },
      { status: 500 }
    );
  }
}
