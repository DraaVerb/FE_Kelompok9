export function normalizeMenuPhoto(input) {
  const value = String(input ?? "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (url.username || url.password) throw new Error("URL foto tidak boleh berisi kredensial.");
    return url.href;
  }
  const local = value.replace(/^\/?assets\//, "");
  if (!/^[a-zA-Z0-9_-][a-zA-Z0-9_. -]*\.(jpg|jpeg|png|webp|gif|avif)$/i.test(local)) {
    throw new Error("Gunakan URL http/https atau nama file gambar di public/assets.");
  }
  return `/assets/${local}`;
}