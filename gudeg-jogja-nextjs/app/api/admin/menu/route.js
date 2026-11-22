import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeMenuPhoto } from "@/lib/menu-photo";

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  const menus = await prisma.menu.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(menus);
}

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ message: "Data tidak valid." }, { status: 400 });
    let gambar;
    try { gambar = normalizeMenuPhoto(body.image); } catch (e) { return NextResponse.json({ message: e.message }, { status: 400 }); }
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);
    const stock = Number(body.stock ?? 0);
    if (!name || !Number.isInteger(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ message: "Nama, harga, dan stok harus valid." }, { status: 400 });
    }
    const menu = await prisma.menu.create({
      data: {
        nama: name,
        deskripsi: String(body.description ?? "").trim(),
        harga: price,
        stock,
        gambar,
        active: body.active !== false,
      },
    });
    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ message: "JSON tidak valid." }, { status: 400 });
    console.error("ADMIN_MENU_POST_ERROR", error);
    return NextResponse.json({ message: "Gagal menambahkan menu." }, { status: 500 });
  }
}
