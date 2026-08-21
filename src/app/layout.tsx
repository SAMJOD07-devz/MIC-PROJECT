import type { Metadata } from "next";
import { Syne, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OrbitCheck — Campus Event Discovery & QR Check-In Platform",
  description: "Discover campus events, claim digital QR tickets, and experience instant duplicate-proof check-ins for organizers and attendees.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full bg-[#16151a] antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#16151a] text-slate-100 selection:bg-[#e443b4] selection:text-white margin-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
