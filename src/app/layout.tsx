import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/contexts/GameContext";
import { FarcasterWrapper } from "@/components/FarcasterWrapper";
import { ClientOnly } from "@/components/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ClientOnly>
          <GameProvider>
            <FarcasterWrapper>
              <div className="relative z-10">
                {children}
              </div>
            </FarcasterWrapper>
          </GameProvider>
        </ClientOnly>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
        title: "Galactic Strategy Dashboard",
        description: "Command futuristic bases and troops in this dynamic PvP war game. Enjoy a sleek interface with interactive battle displays and strategic resource management. Plan, attack, win!",
        icons: {
          icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/icon.svg', type: 'image/svg+xml', sizes: '32x32' }
          ],
        },
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_cf9a6e85-b333-4b26-b29c-d2b759be96b3-ip4byNeeZnAy0TB11SryaZUfcHnTZs","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Galactic Strategy Dashboard","url":"https://forgot-shore-808.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
