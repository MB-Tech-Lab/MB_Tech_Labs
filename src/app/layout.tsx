import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MB Tech Labs — Engineering Tomorrow's Digital Future",
  description:
    "MB Tech Labs builds enterprise-grade software, AI-powered applications, mobile solutions, cloud systems, and scalable digital products that help businesses grow through technology.",
  keywords: [
    "MB Tech Labs",
    "Enterprise Software Development",
    "Custom Web Applications",
    "Mobile App Development",
    "Artificial Intelligence Solutions",
    "Cloud Infrastructure",
    "ERP Systems",
    "SaaS Platforms",
    "UI/UX Design",
    "API Development",
    "Automation Solutions",
    "Digital Transformation",
  ],
  authors: [{ name: "MB Tech Labs" }],
  icons: {
    icon: "/MBTechLabsLogo.png",
  },
  openGraph: {
    title: "MB Tech Labs — Engineering Tomorrow's Digital Future",
    description:
      "Enterprise-grade software, AI applications, mobile, cloud, and scalable digital products.",
    siteName: "MB Tech Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MB Tech Labs — Engineering Tomorrow's Digital Future",
    description:
      "Enterprise-grade software, AI applications, mobile, cloud, and scalable digital products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased bg-ink text-white font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
