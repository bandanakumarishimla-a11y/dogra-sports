import Link from "next/link";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { business } from "@/lib/config";
export function Footer({ whatsapp }: { whatsapp: string }) {
  return (
    <>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Link href="/" className="footer-brand">
              DOGRA <span>SPORTS</span>
            </Link>
            <p>
              For the love of the game.
              <br />
              Sportswear, sporting goods and team kits in Bilaspur, Himachal
              Pradesh.
            </p>
            <span className="footer-place">MADE FOR YOUR NEXT GAME.</span>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/products">Product catalogue</Link>
            <Link href="/team-kits">Custom team kits</Link>
            <Link href="/bulk-orders">Bulk & institutional orders</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About us</Link>
          </div>
          <div>
            <h3>Visit & connect</h3>
            <p className="icon-row">
              <MapPin size={18} />
              {business.address}
            </p>
            <a className="icon-row" href={business.phoneHref}>
              <Phone size={16} />
              {business.phone}
            </a>
            <a href={business.alternateHref}>{business.alternate}</a>
            <p className="icon-row">
              <Clock size={16} />
              {business.hours}
            </p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Dogra Sports. All rights reserved.
          </span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns & exchanges</Link>
            <Link href="/admin">Store admin</Link>
          </div>
        </div>
      </footer>
      {whatsapp && /^\d{10,15}$/.test(whatsapp) ? (
        <a
          className="floating-contact"
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Dogra Sports, I would like to enquire about your products.")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Enquire on WhatsApp"
        >
          <MessageCircle size={22} /> WhatsApp
        </a>
      ) : (
        <a
          className="floating-contact"
          href={business.phoneHref}
          aria-label="Call Dogra Sports"
        >
          <Phone size={20} /> Call us
        </a>
      )}
    </>
  );
}
