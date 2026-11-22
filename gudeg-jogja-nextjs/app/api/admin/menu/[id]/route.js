import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeMenuPhoto } from "@/lib/menu-photo";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ message: "ID menu tidak valid." }, { status: 400 });
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ message: "Data tidak valid." }, { status: 400 });
    const data = {};
    if (body.name !== undefined) {
      data.nama = String(body.name).trim();
      if (!data.nama) return NextResponse.json({ message: "Nama menu wajib diisi." }, { status: 400 });
    }
    if (body.description !== undefined) data.deskripsi = String(body.description ?? "").trim();
    if (body.image !== undefined) {
      try { data.gambar = normalizeMenuPhoto(body.image); } catch (e) { return NextResponse.json({ message: e.message }, { status: 400 }); }
    }
    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!Number.isInteger(price) || price < 0) return NextResponse.json({ message: "Harga tidak valid." }, { status: 400 });
      data.harga = price;
    }
    if (body.stock !== undefined) {
      const stock = Number(body.stock);
      if (!Number.isInteger(stock) || stock < 0) return NextResponse.json({ message: "Stok tidak valid." }, { status: 400 });
      data.stock = stock;
    }
    if (body.active !== undefined) data.active = Boolean(body.active);
    const menu = await prisma.menu.update({ where: { id }, data });
    return NextResponse.json(menu);
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ message: "JSON tidak valid." }, { status: 400 });
    if (error.code === "P2025") return NextResponse.json({ message: "Menu tidak ditemukan." }, { status: 404 });
    console.error("ADMIN_MENU_PATCH_ERROR", error);
    return NextResponse.json({ message: "Gagal memperbarui menu." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ message: "ID menu tidak valid." }, { status: 400 });
  try {
    const menu = await prisma.menu.update({ where: { id }, data: { active: false } });
    return NextResponse.json(menu);
  } catch (error) {
    console.error("ADMIN_MENU_DELETE_ERROR", error);
    return NextResponse.json({ message: "Gagal menonaktifkan menu." }, { status: 500 });
  }
}
