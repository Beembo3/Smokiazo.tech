import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

// Ionic structural styles load before the token overrides in globals.css.
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./globals.css";
import { IonicProvider } from "@/components/ionic-provider";
import { AppRoot } from "@/components/app-root";
import { ScrollToTop } from "@/components/scroll-to-top";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "2GO Express · Cabanatuan City",
    template: "%s · 2GO Express Cabanatuan",
  },
  description:
    "Track shipments, request a branch-assisted quote, and ask about special services at 2GO Express Cabanatuan City.",
  applicationName: "2GO Express Cabanatuan",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <IonicProvider>
          <AppRoot>
            <ScrollToTop />
            {children}
          </AppRoot>
        </IonicProvider>
      </body>
    </html>
  );
}
