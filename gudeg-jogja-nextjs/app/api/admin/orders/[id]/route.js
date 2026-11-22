import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowed = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

export async function PATCH(request, { params }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  const { id } = await params;
  try {
    const body = await request.json();
    const status = String(body.status ?? "");
    if (!allowed.includes(status)) return NextResponse.json({ message: "Status tidak valid." }, { status: 400 });
    const order = await prisma.order.update({ where: { id }, data: { status } });
    return NextResponse.json(order);
  } catch (error) {
    console.error("ADMIN_ORDER_PATCH_ERROR", error);
    return NextResponse.json({ message: "Gagal memperbarui pesanan." }, { status: 500 });
  }
}
