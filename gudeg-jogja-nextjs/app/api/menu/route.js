import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = db.prepare("SELECT * FROM menu").all();

    return NextResponse.json(data);
  } catch (error) {
    console.error("ERROR MENU:", error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}