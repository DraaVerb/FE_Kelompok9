
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL belum diatur. Isi koneksi PostgreSQL di file .env pada folder gudeg-jogja-nextjs, lalu restart npm run dev. Lihat README.md untuk setup database."
  );
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
