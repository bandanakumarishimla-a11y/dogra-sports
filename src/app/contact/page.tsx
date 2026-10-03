import type { Metadata } from "next";
import { MapPin, Clock, Phone } from "lucide-react";
import { business } from "@/lib/config";
import { EnquiryForm } from "@/components/enquiry-form";
export const metadata: Metadata = {
  title: "Contact & visit our Bilaspur store",
};
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">LET’S TALK SPORT</span>
          <h1>Your next game starts here.</h1>
          <p>
            Visit the store, give us a call or send your requirements. We’re
            happy to help you find the right gear.
          </p>
        </div>
      </section>
      <section className="section container form-layout contact-layout">
        <div>
          <h2>Find Dogra Sports.</h2>
          <div className="contact-info">
            <div>
              <MapPin />
              <span>
                <strong>Our store</strong>
                <p>{business.address}</p>
              </span>
            </div>
            <div>
              <Clock />
              <span>
                <strong>Store hours</strong>
                <p>{business.hours}</p>
              </span>
            </div>
            <div>
              <Phone />
              <span>
                <strong>Call us</strong>
                <a href={business.phoneHref}>{business.phone}</a>
                <a href={business.alternateHref}>{business.alternate}</a>
              </span>
            </div>
          </div>
          <div className="location-panel">
            <MapPin size={28} />
            <h3>Near ITI Bilaspur</h3>
            <p>6-B Industrial Area, Bilaspur, Himachal Pradesh.</p>
            <a
              className="button button-light"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
            >
              Search address on Maps
            </a>
            <small>
              This opens an address search. Call us if you need help finding the
              store.
            </small>
          </div>
        </div>
        <div className="form-panel">
          <h2>Send an enquiry.</h2>
          <p>Tell us what you’re looking for.</p>
          <EnquiryForm
            kind={product ? "Product enquiry" : "General enquiry"}
            product={product || ""}
          />
        </div>
      </section>
    </>
  );
}
