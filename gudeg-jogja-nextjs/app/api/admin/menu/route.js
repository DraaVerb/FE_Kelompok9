import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);
    const stock = Number(body.stock ?? 0);
    if (!name || !Number.isInteger(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ message: "Nama, harga, dan stok harus valid." }, { status: 400 });
    }
    const menu = await prisma.menu.create({
      data: {
        name,
        description: String(body.description ?? "").trim() || null,
        price,
        stock,
        image: String(body.image ?? "").trim() || null,
        active: body.active !== false,
      },
    });
    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error("ADMIN_MENU_POST_ERROR", error);
    return NextResponse.json({ message: "Gagal menambahkan menu." }, { status: 500 });
  }
}
