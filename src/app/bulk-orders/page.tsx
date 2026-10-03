import type { Metadata } from "next";
import { School, Users, Dumbbell } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
export const metadata: Metadata = {
  title: "Bulk & institutional sports orders",
};
export default function Bulk() {
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">BULK & INSTITUTIONAL ORDERS</span>
          <h1>
            Every requirement.
            <br />
            One conversation.
          </h1>
          <p>
            Sports goods, uniforms and fitness equipment for schools, colleges,
            clubs and academies.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="three-grid">
          {[
            [
              School,
              "Schools & colleges",
              "Sports equipment, uniforms and training essentials.",
            ],
            [
              Users,
              "Clubs & academies",
              "Team kits and equipment for practice and competition.",
            ],
            [
              Dumbbell,
              "Fitness spaces",
              "Discuss equipment needs for your training space.",
            ],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof School;
            return (
              <article className="feature-card" key={String(title)}>
                <I size={32} />
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </article>
            );
          })}
        </div>
        <div className="form-layout">
          <div>
            <span className="eyebrow">REQUEST A TAILORED QUOTATION</span>
            <h2>
              Send your
              <br />
              requirement list.
            </h2>
            <p>
              Tell us about quantities, specifications and your delivery
              location. Attach your list as a PDF or image, or include it in the
              message.
            </p>
            <p>
              Prices, product specifications, delivery and any installation
              requirements are discussed before confirmation.
            </p>
          </div>
          <div className="form-panel">
            <EnquiryForm kind="Institutional / bulk order" />
          </div>
        </div>
      </section>
    </>
  );
}
