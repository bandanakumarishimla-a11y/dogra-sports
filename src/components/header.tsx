"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { business } from "@/lib/config";
const links = [
  ["Products", "/products"],
  ["Custom team kits", "/team-kits"],
  ["Bulk orders", "/bulk-orders"],
  ["About us", "/about"],
  ["Contact", "/contact"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>
            <MapPin size={13} /> Bilaspur, Himachal Pradesh
          </span>
          <span className="top-hours">Open 9:00 AM – 8:00 PM</span>
          <a href={business.phoneHref}>
            <Phone size={13} /> {business.phone}
          </a>
        </div>
      </div>
      <header className="header">
        <div className="container nav">
          <Link
            href="/"
            className="logo"
            onClick={() => setOpen(false)}
            aria-label="Dogra Sports home"
          >
            <span className="logo-mark">
              DS
              <span />
            </span>
            <span>
              DOGRA <b>SPORTS</b>
              <small>BILASPUR · HIMACHAL PRADESH</small>
            </span>
          </Link>
          <nav
            aria-label="Main navigation"
            className={open ? "nav-links open" : "nav-links"}
          >
            {links.map(([label, url]) => (
              <Link
                key={url}
                href={url}
                aria-current={pathname === url ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="button button-red mobile-contact"
              onClick={() => setOpen(false)}
            >
              Get in touch
            </Link>
          </nav>
          <Link href="/contact" className="button button-red desktop-contact">
            Get in touch
          </Link>
          <button
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
