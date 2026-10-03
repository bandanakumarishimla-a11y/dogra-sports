import type { Metadata } from "next";
import { Palette, Shirt, UserRound, Layers, Check } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
export const metadata: Metadata = { title: "Custom team jerseys & uniforms" };
export default function TeamKits() {
  return (
    <>
      <section className="page-intro page-intro-dark">
        <div className="container">
          <span className="eyebrow">CUSTOM TEAM KITS</span>
          <h1>
            Your colours.
            <br />
            Your team. Your identity.
          </h1>
          <p>
            Personalised jerseys and uniforms for cricket teams, clubs,
            academies, schools and more.
          </p>
          <a className="button button-red" href="#quote">
            Request your team kit quote
          </a>
        </div>
      </section>
      <section className="section container">
        <div className="four-grid">
          {[
            [
              Palette,
              "Team colours",
              "Choose a design that belongs to your club.",
            ],
            [
              Shirt,
              "Logos & sponsors",
              "Bring your team and sponsor identity together.",
            ],
            [
              UserRound,
              "Names & numbers",
              "Make every player’s kit their own.",
            ],
            [
              Layers,
              "Fabric & fit",
              "Discuss fabric, sizes and sublimation options.",
            ],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Palette;
            return (
              <article className="feature-card" key={String(title)}>
                <I size={30} />
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </article>
            );
          })}
        </div>
        <div className="steps">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FROM IDEA TO MATCH DAY</span>
              <h2>Let’s make your kit.</h2>
            </div>
          </div>
          <div className="three-grid">
            {[
              [
                "01",
                "Share your brief",
                "Send your colours, logos, quantities and sizes.",
              ],
              [
                "02",
                "Confirm your design",
                "We discuss the design, fabric, quotation and delivery schedule.",
              ],
              [
                "03",
                "Get ready to play",
                "Production starts once the design and order details are approved.",
              ],
            ].map(([n, title, text]) => (
              <div className="step" key={n}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="form-layout" id="quote">
          <div>
            <span className="eyebrow">YOUR TEAM STARTS HERE</span>
            <h2>
              Tell us about
              <br />
              your team kit.
            </h2>
            <p>
              Share the basics and upload your logo or reference design. We will
              contact you to confirm the details.
            </p>
            <p className="icon-row">
              <Check size={18} /> No payment required to enquire.
            </p>
          </div>
          <div className="form-panel">
            <EnquiryForm kind="Custom team kits" />
          </div>
        </div>
      </section>
    </>
  );
}
