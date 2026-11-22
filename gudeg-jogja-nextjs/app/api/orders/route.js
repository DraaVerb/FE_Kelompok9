
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login." },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: { include: { menu: true } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("ORDER_GET_ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data pesanan." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const address = String(body.address ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const notes = String(body.notes ?? "").trim();
    const items = Array.isArray(body.items) ? body.items : [];

    if (!address || !phone || items.length === 0) {
      return NextResponse.json(
        { message: "Alamat, nomor telepon, dan item pesanan wajib diisi." },
        { status: 400 }
      );
    }

    // Validasi ID menu dan jumlah pesanan
    const normalizedItems = items.map((item) => ({
      menuId: Number(item.menuId),
      quantity: Number(item.quantity),
    }));

    for (const item of normalizedItems) {
      if (
        !Number.isInteger(item.menuId) ||
        item.menuId < 1 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return NextResponse.json(
          { message: "ID menu atau jumlah pesanan tidak valid." },
          { status: 400 }
        );
      }
    }

    const ids = [
      ...new Set(normalizedItems.map((item) => item.menuId)),
    ];

    const menus = await prisma.menu.findMany({
      where: {
        id: { in: ids },
      },
    });

    const menuMap = new Map(
      menus.map((menu) => [menu.id, menu])
    );

    let total = 0;
    const orderItems = [];

    for (const item of normalizedItems) {
      const menu = menuMap.get(item.menuId);

      if (!menu) {
        return NextResponse.json(
          { message: `Menu dengan ID ${item.menuId} tidak ditemukan.` },
          { status: 400 }
        );
      }

      total += menu.harga * item.quantity;

      orderItems.push({
        menuId: menu.id,
        quantity: item.quantity,
        price: menu.harga,
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          userId: session.user.id,
          total,
          address,
          phone,
          notes: notes || null,
          items: {
            create: orderItems,
          },
          payment: {
            create: {
              method: String(body.paymentMethod ?? "COD"),
              amount: total,
            },
          },
        },
        include: {
          items: { include: { menu: true } },
          payment: true,
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("ORDER_POST_ERROR:", error);

    return NextResponse.json(
      { message: "Gagal membuat pesanan. Periksa kembali data dan konfigurasi database." },
      { status: 500 }
    );
  }
}
