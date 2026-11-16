import type { Metadata, Viewport } from "next";
import { defaultSettings, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KeepYourStay — Vacation rental websites and direct-booking solutions",
    template: "%s | KeepYourStay",
  },
  description: defaultSettings.seo_description,
  applicationName: "KeepYourStay",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f4ecdd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
