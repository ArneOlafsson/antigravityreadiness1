import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Disruption Scanner | Strategisk AI-Analys",
  description: "Analysera hur exponerad din verksamhet är för AI-störningar. Få poäng, risker och en strategisk färdplan för AI-transformation.",
  icons: {
    icon: '/icon.jpg',
  },
};

import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
