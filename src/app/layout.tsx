import type { Metadata } from "next";
import { Sora, Poppins } from "next/font/google";
import "./globals.css";
import { CursorFollower } from "@/components/CursorFollower";
import { GridOverlay } from "@/components/GridOverlay";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShipIt Teens | Build · Learn · Ship · Together",
  description: "A teen-led STEM community. You don't need permission to start building. Ship real projects and make an impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen bg-[var(--color-shipit-white)] text-[var(--color-shipit-black)] overflow-x-hidden">
        <GridOverlay />
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
