import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bengkel Watermark | Jasa Watermark & Branding Profesional",
  description:
    "Bengkel Watermark menyediakan jasa pembuatan watermark, logo, branding, dan editing profesional untuk bisnis, UMKM, dan personal brand. Cepat, berkualitas, dan terpercaya.",
  keywords: [
    "Bengkel Watermark",
    "jasa watermark",
    "jasa logo",
    "jasa branding",
    "desain watermark profesional",
    "logo bisnis",
    "branding UMKM",
    "edit foto watermark",
  ],
  authors: [{ name: "Bengkel Watermark" }],
  creator: "Bengkel Watermark",
  publisher: "Bengkel Watermark",
  openGraph: {
    title: "Bengkel Watermark | Jasa Watermark & Branding Profesional",
    description:
      "Jasa pembuatan watermark, logo, dan branding profesional untuk meningkatkan identitas bisnis Anda.",
    url: "https://bengkelwatermark.com",
    siteName: "Bengkel Watermark",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bengkel Watermark",
    description: "Solusi watermark dan branding profesional untuk bisnis Anda.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
