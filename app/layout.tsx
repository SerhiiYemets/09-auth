import "./globals.css";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import dynamic from 'next/dynamic';
import type { Metadata } from "next";
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});

const Footer = dynamic(() => import('@/components/Footer/Footer'));

export const metadata: Metadata = {
  metadataBase: new URL("https://notehub.com"),
  title: "Note Hub",
  description: "Note Hub — an application for creating and storing notes",
  openGraph: {
    title: "Note Hub",
    description: "Note Hub — an application for creating and storing notes",
    url: "https://notehub.com",
    siteName: "Note Hub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Note Hub",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Note Hub",
    description: "Note Hub — an application for creating and storing notes",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          <main>{children}{modal}</main>
          <Footer />
        </TanStackProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
