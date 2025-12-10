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
  title: "Nitipon T. — Portfolio",
  description:
    "Portfolio of Nitipon Trimaitreepituk — King's Scholar, software engineer, mathematician, and Georgia Tech CS student. A blend of personal aesthetic, strong academics, and impactful projects.",
  keywords: [
    "Nitipon",
    "Nitipon Trimaitreepituk",
    "portfolio",
    "Georgia Tech",
    "CS student",
    "software engineering",
    "machine learning",
    "quantitative research",
    "math competitions",
    "King's Scholar",
    "Earth Science Olympiad",
  ],
  authors: [{ name: "Nitipon Trimaitreepituk" }],
  creator: "Nitipon Trimaitreepituk",
  publisher: "Nitipon Trimaitreepituk",
  metadataBase: new URL("https://nitipon-portfolio.vercel.app"), // change after deploy

  openGraph: {
    title: "Nitipon T. — Portfolio",
    description:
      "Explore Nitipon's achievements, projects, research, and personal story — blending aesthetics, engineering, math, and design.",
    url: "https://nitipon-portfolio.vercel.app",
    siteName: "Nitipon Portfolio",
    images: [
      {
        url: "/profile.jpg", // add to public folder
        width: 1200,
        height: 630,
        alt: "Nitipon Portfolio Preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Nitipon T. — Portfolio",
    description:
      "Portfolio of Nitipon Trimaitreepituk — software engineer, mathematician, and Georgia Tech CS student.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
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
