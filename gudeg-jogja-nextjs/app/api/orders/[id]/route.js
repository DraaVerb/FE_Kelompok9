
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

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Akses hanya untuk Admin." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
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
    const body = await request.json();
    const status = String(body.status ?? "");

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
    console.error("ADMIN_ORDER_PATCH_ERROR:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui status pesanan." },
      { status: 500 }
    );
  }
}
