import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  const { id } = await params;
  try {
    const body = await request.json();
    const data = {};
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.description !== undefined) data.description = String(body.description).trim() || null;
    if (body.image !== undefined) data.image = String(body.image).trim() || null;
    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!Number.isInteger(price) || price < 0) return NextResponse.json({ message: "Harga tidak valid." }, { status: 400 });
      data.price = price;
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
    console.error("ADMIN_MENU_PATCH_ERROR", error);
    return NextResponse.json({ message: "Gagal memperbarui menu." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  const { id } = await params;
  try {
    const menu = await prisma.menu.update({ where: { id }, data: { active: false } });
    return NextResponse.json(menu);
  } catch (error) {
    console.error("ADMIN_MENU_DELETE_ERROR", error);
    return NextResponse.json({ message: "Gagal menonaktifkan menu." }, { status: 500 });
  }
}
