
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  // Belum login: masuk halaman login
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Login sebagai admin
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  // Login sebagai pelanggan
  redirect("/menu");
}
