
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: mengambil semua ulasan
export async function GET() {
  try {
    const data = await prisma.ulasan.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("ERROR ULASAN:", error);
    return NextResponse.json(
      { message: "Gagal mengambil ulasan" },
      { status: 500 }
    );
  }
}

// POST: menambahkan ulasan
export async function POST(request) {
  try {
    const body = await request.json();

    const data = await prisma.ulasan.create({
      data: {
        nama: body.nama,
        komentar: body.teks,
        rating: Number(body.rating),
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("ERROR POST ULASAN:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan ulasan" },
      { status: 500 }
    );
  }
}

// DELETE: menghapus ulasan
export async function DELETE(request) {
  try {
    const body = await request.json();

    await prisma.ulasan.delete({
      where: {
        id: Number(body.id),
      },
    });

    return NextResponse.json({ message: "Ulasan berhasil dihapus" });
  } catch (error) {
    console.error("ERROR DELETE ULASAN:", error);
    return NextResponse.json(
      { message: "Gagal menghapus ulasan" },
      { status: 500 }
    );
  }
}
