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
  title: "Fake Achievement Generator | Absurd AI Achievements",
  description: "Generate funny, absurd, and creative fake achievements for any name and category. Powered by Google Gemini AI.",
  keywords: [
    "fake achievements",
    "achievement generator",
    "AI achievements",
    "funny achievements",
    "absurd achievements",
    "Google Gemini",
    "Next.js",
    "Tailwind CSS"
  ],
  openGraph: {
    title: "Fake Achievement Generator | Absurd AI Achievements",
    description: "Generate funny, absurd, and creative fake achievements for any name and category. Powered by Google Gemini AI.",
    url: "https://your-deployment-url.com/",
    siteName: "Fake Achievement Generator",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Fake Achievement Generator | Absurd AI Achievements",
    description: "Generate funny, absurd, and creative fake achievements for any name and category. Powered by Google Gemini AI."
  }
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
