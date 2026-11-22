import "./globals.css";
import { Header } from "./components";

export const metadata = {
  title: "Gudeg Jogja",
  description: "Pesan gudeg khas Yogyakarta secara online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Header />
        <main className="container">{children}</main>
        <footer className="footer">© {new Date().getFullYear()} Gudeg Jogja</footer>
      </body>
    </html>
  );
}
