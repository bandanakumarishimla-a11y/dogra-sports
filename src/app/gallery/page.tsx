import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import { getSettings } from "@/lib/data";
export const metadata: Metadata = { title: "Store & team kit gallery" };
export const dynamic = "force-dynamic";
export default async function Gallery() {
  const { gallery } = await getSettings();
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">THE DOGRA SPORTS GALLERY</span>
          <h1>Life around the game.</h1>
          <p>
            Store photographs, team kits and moments from our sporting
            community.
          </p>
        </div>
      </section>
      <section className="section container">
        {gallery.length ? (
          <div className="gallery-grid">
            {gallery.map((g, i) => (
              <figure key={i}>
                <div>
                  <Image
                    src={g.url}
                    alt={g.caption || "Dogra Sports gallery photograph"}
                    fill
                    sizes="(max-width:700px) 100vw,33vw"
                  />
                </div>
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Camera size={44} />
            <h2>Our gallery is getting ready.</h2>
            <p>
              Store and team kit photographs will be added here. Until then,
              visit us in Bilaspur or ask for product photographs.
            </p>
            <Link href="/contact" className="button button-red">
              Contact the store
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
