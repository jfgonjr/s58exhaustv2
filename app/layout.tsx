import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Divina S58 Quad-Tip Equal Length Exhaust | BMW M3 G80 / M4 G82",
  description:
    "4x 101.6mm quad-tip titanium exhaust with pure 120° pulse interleaving. Turn the BMW S58 into a high-pitched V12.",
};
export const viewport: Viewport = { themeColor: "#000000" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={body.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
