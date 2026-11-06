
import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const menu = db.prepare("SELECT * FROM menu").all();
    return NextResponse.json(menu);
  } catch (error) {
    console.error("Gagal mengambil menu:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data menu" },
      { status: 500 }
    );
  }
}
