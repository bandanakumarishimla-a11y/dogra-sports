import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CircleDot, Shirt, Users } from "lucide-react";
export const metadata: Metadata = { title: "About our Bilaspur sports store" };
export default function About() {
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">DOGRA SPORTS · BILASPUR</span>
          <h1>
            Local roots.
            <br />A shared love for sport.
          </h1>
          <p>
            Sportswear, cricket essentials and sporting equipment for players,
            teams and the places where they train.
          </p>
        </div>
      </section>
      <section className="section container about-story">
        <div className="about-photo">
          <Image
            src="/images/cricket-hero.webp"
            alt="Illustrative cricket practice in a mountain setting"
            fill
            sizes="(max-width:800px) 100vw,50vw"
          />
          <small>Illustrative sports photography</small>
        </div>
        <div>
          <span className="eyebrow">FOR YOUR NEXT GAME</span>
          <h2>
            Good gear.
            <br />
            Helpful conversations.
          </h2>
          <p>
            Based in Bilaspur, Himachal Pradesh, Dogra Sports serves individual
            players, clubs, schools, academies and institutional buyers.
          </p>
          <p>
            We bring together sportswear, cricket equipment, footwear, sporting
            goods and fitness equipment. We also help teams create customised
            jerseys and uniforms with their colours, logos, player names and
            numbers.
          </p>
          <p>
            Whether you know exactly what you need or want to discuss the
            options, visit us near ITI Bilaspur or send your requirements.
          </p>
          <Link href="/contact" className="button button-red">
            Get in touch
          </Link>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container three-grid">
          {[
            [
              CircleDot,
              "For the player",
              "Explore equipment and essentials for training and match days.",
            ],
            [
              Shirt,
              "For the team",
              "Create a team identity through custom jerseys and uniforms.",
            ],
            [
              Users,
              "For the community",
              "Source sporting requirements for schools, clubs and academies.",
            ],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof CircleDot;
            return (
              <article className="feature-card" key={String(title)}>
                <I size={32} />
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
