import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Palette,
  Users,
  MapPin,
  Phone,
  Check,
} from "lucide-react";
import { getProducts, getSettings } from "@/lib/data";
import { categories, business } from "@/lib/config";
import { ProductCard } from "@/components/product-card";
import { CategoryIcon } from "@/components/category-icon";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings(),
  ]);
  return (
    <>
      <section className="hero">
        <Image
          src="/images/cricket-hero.webp"
          alt="Illustrative cricket batter practising against a mountain backdrop"
          fill
          priority
          sizes="100vw"
          className="hero-photo"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <span className="hero-eyebrow">
            <span /> YOUR GAME. YOUR GEAR.
          </span>
          <h1>
            {settings.hero_title.split("\n").map((line, i) => (
              <span key={i}>{line}</span>
            ))}
            <span className="hero-red">Dogra Sports.</span>
          </h1>
          <p>{settings.hero_subtitle}</p>
          <div className="hero-actions">
            <Link href="/products" className="button button-red">
              Explore products
            </Link>
            <Link href="/team-kits" className="button button-outline">
              Get a team kit quote
            </Link>
          </div>
          <span className="hero-location">
            <MapPin size={16} /> BILASPUR, HIMACHAL PRADESH
          </span>
        </div>
        <span className="hero-image-note">Illustrative sports photography</span>
      </section>
      <div className="benefits">
        <div className="container benefits-grid">
          <div>
            <ShieldCheck />
            <span>
              <strong>Gear for every game</strong>
              <small>From practice to match day</small>
            </span>
          </div>
          <div>
            <Palette />
            <span>
              <strong>Your team, your identity</strong>
              <small>Custom jerseys & uniforms</small>
            </span>
          </div>
          <div>
            <Users />
            <span>
              <strong>Individual & bulk orders</strong>
              <small>Players, clubs, schools & academies</small>
            </span>
          </div>
        </div>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR SPORT</span>
            <h2>Built for the way you play.</h2>
          </div>
          <Link href="/products" className="text-link">
            Explore all categories
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((c, i) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="category-card"
            >
              <span className="category-number">0{i + 1}</span>
              <CategoryIcon category={c} size={38} />
              <h3>{c}</h3>
              <span className="category-description">
                {
                  [
                    "Bats, gloves & match essentials",
                    "Jerseys, tracksuits & training wear",
                    "Training shoes & cricket spikes",
                    "Court & field essentials",
                    "Train stronger, play better",
                    "Schools, clubs & academies",
                  ][i]
                }
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE THE CATALOGUE</span>
              <h2>Ready for your next game.</h2>
            </div>
            <Link href="/products" className="button button-light">
              View all products
            </Link>
          </div>
          <div className="product-grid">
            {products
              .filter((p) => p.featured)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
          <p className="catalogue-note">
            Sample ranges shown. Contact us for current models, photographs,
            prices and availability.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="team-promo">
          <div className="team-promo-copy">
            <span className="eyebrow">ONE TEAM. ONE IDENTITY.</span>
            <h2>
              Wear your colours.
              <br />
              <span>Own the game.</span>
            </h2>
            <p>
              Custom team kits that bring your club together. Choose your
              colours, add your team and sponsor logos, and make every name and
              number count.
            </p>
            <div className="check-list">
              <span>
                <Check size={18} /> Player names & numbers
              </span>
              <span>
                <Check size={18} /> Team & sponsor logos
              </span>
              <span>
                <Check size={18} /> Fabric & size options
              </span>
              <span>
                <Check size={18} /> Sublimation printing
              </span>
            </div>
            <Link href="/team-kits" className="button button-red">
              Create your team kit
            </Link>
          </div>
          <div className="team-promo-art">
            <Palette size={68} strokeWidth={1} />
            <span>
              YOUR COLOURS.
              <br />
              YOUR CLUB.
              <br />
              <b>YOUR KIT.</b>
            </span>
            <small>DESIGNED AROUND YOUR TEAM</small>
          </div>
        </div>
      </section>
      <section className="institution-strip">
        <div className="container">
          <div>
            <span className="eyebrow">FOR SCHOOLS, CLUBS & ACADEMIES</span>
            <h2>
              A complete sporting requirement?
              <br />
              Let’s put it together.
            </h2>
          </div>
          <Link href="/bulk-orders" className="button button-outline">
            Request a bulk quote
          </Link>
        </div>
      </section>
      <section className="section container home-about">
        <div>
          <span className="eyebrow">LOCAL ROOTS. LOVE FOR SPORT.</span>
          <h2>
            Your sports store
            <br />
            in Bilaspur.
          </h2>
          <p>
            Dogra Sports brings sportswear, cricket essentials and sporting
            equipment together in one place. Whether you are choosing your first
            bat, outfitting a team or sourcing for an academy, talk to us about
            what you need.
          </p>
          <Link href="/about" className="text-link">
            Meet Dogra Sports
          </Link>
        </div>
        <div className="visit-card">
          <MapPin size={30} />
          <h3>Come find your next game.</h3>
          <p>{business.address}</p>
          <span>{business.hours}</span>
          <a href={business.phoneHref} className="button button-red">
            <Phone size={17} /> Call the store
          </a>
        </div>
      </section>
    </>
  );
}
