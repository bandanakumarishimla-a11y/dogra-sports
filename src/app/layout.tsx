import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSettings } from "@/lib/data";
import { business, siteUrl } from "@/lib/config";
import "./globals.css";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dogra Sports | Sportswear & Cricket Equipment in Bilaspur",
    template: "%s | Dogra Sports",
  },
  description:
    "Discover sportswear, cricket equipment, custom team jerseys and sporting goods at Dogra Sports, near ITI Bilaspur, Himachal Pradesh.",
  openGraph: { type: "website", locale: "en_IN", siteName: "Dogra Sports" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const structured = {
    "@context": "https://schema.org",
    "@type": "SportingGoodsStore",
    name: business.name,
    telephone: "+918351069133",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Near ITI Bilaspur, 6-B Industrial Area, Sadar",
      addressLocality: "Bilaspur",
      addressRegion: "Himachal Pradesh",
      postalCode: "174001",
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 09:00-20:00",
    url: siteUrl,
  };
  return (
    <html lang="en">
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer whatsapp={settings.whatsapp} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structured).replace(/</g, "\u003c"),
          }}
        />
      </body>
    </html>
  );
}
