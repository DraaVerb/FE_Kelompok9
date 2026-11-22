
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];

export async function GET(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: { id, ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }) },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { menu: true } },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("ADMIN_ORDER_GET_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil pesanan." },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Akses hanya untuk Admin." },
        { status: 403 }
      );
    }

    const { id } = await params;
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "JSON tidak valid." }, { status: 400 });
    }
    const status = body?.status;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Status pesanan tidak valid." },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      message: "Status pesanan berhasil diperbarui.",
      order: updatedOrder,
    });
  } catch (error) {
    if (error.code === "P2025") return NextResponse.json({ message: "Pesanan tidak ditemukan." }, { status: 404 });
    console.error("ADMIN_ORDER_PATCH_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui status pesanan." },
      { status: 500 }
    );
  }
}
