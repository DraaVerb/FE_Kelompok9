import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(menus);
  } catch (error) {
    console.error("MENU_GET_ERROR", error);
    return NextResponse.json({ message: "Gagal mengambil menu." }, { status: 500 });
  }
}
