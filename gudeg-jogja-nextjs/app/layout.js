import "./globals.css";

export const metadata = {
  title: "Gudeg Yogyakarta",
  description: "Mengenal cita rasa, sejarah, dan berbagai macam sajian Gudeg khas Yogyakarta.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
