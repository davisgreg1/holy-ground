import type { Metadata } from "next";
import { LeadMagnetProvider } from "@/components/lead-magnet/lead-magnet-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Holy Ground Theology",
  description:
    "Catholic theology resources, Bible reading tools, and searchable formation content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LeadMagnetProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </LeadMagnetProvider>
      </body>
    </html>
  );
}
