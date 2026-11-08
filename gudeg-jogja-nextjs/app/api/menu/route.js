
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await prisma.menu.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("ERROR MENU:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data menu" },
      { status: 500 }
    );
  }
}
