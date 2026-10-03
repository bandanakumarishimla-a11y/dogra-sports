"use client";
import { useState, useRef, type FormEvent } from "react";
import { CheckCircle2, Upload, LoaderCircle } from "lucide-react";
import Link from "next/link";
type Props = { kind?: string; product?: string };
export function EnquiryForm({ kind = "General enquiry", product = "" }: Props) {
  const [selectedKind, setSelectedKind] = useState(kind);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = new FormData(e.currentTarget);
      const file = data.get("attachment") as File;
      let attachment = null;
      if (file?.size) {
        if (file.size > 2 * 1024 * 1024)
          throw new Error("Please choose a file smaller than 2 MB.");
        if (!["image/png", "image/jpeg", "application/pdf"].includes(file.type))
          throw new Error("Please upload a PNG, JPG or PDF file.");
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1]);
          reader.onerror = () =>
            reject(new Error("Could not read the file. Please try again."));
          reader.readAsDataURL(file);
        });
        attachment = { name: file.name, type: file.type, base64 };
      }
      const payload = Object.fromEntries(
        [...data.entries()].filter(([key]) => key !== "attachment"),
      );
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, attachment }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Could not send your enquiry. Please try again.",
        );
      setSuccess(true);
      formRef.current?.reset();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please call us.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={52} />
        <h2>Thank you. We have your request.</h2>
        <p>
          Your enquiry has been saved. Our team will contact you on the phone
          number you provided.
        </p>
        <button
          className="button button-red"
          onClick={() => {
            setSuccess(false);
            setFileName("");
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  return (
    <form ref={formRef} className="enquiry-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Your name <span>*</span>
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Full name"
          />
        </label>
        <label>
          Phone number <span>*</span>
          <input
            name="phone"
            required
            type="tel"
            inputMode="tel"
            pattern="[0-9+ ()-]{10,20}"
            minLength={10}
            maxLength={20}
            autoComplete="tel"
            placeholder="Your contact number"
          />
        </label>
        <label>
          Enquiry type
          <select
            name="kind"
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value)}
          >
            {[
              "General enquiry",
              "Product enquiry",
              "Custom team kits",
              "Institutional / bulk order",
            ].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label>
          Team / organisation
          <input
            name="organisation"
            maxLength={150}
            placeholder="Team, school, club or business"
          />
        </label>
        {selectedKind === "Product enquiry" && (
          <label className="full">
            Product
            <input
              name="product"
              defaultValue={product}
              maxLength={150}
              placeholder="Product or model you need"
            />
          </label>
        )}
        {selectedKind !== "General enquiry" && (
          <>
            <label>
              Quantity
              <input
                name="quantity"
                type="number"
                min={1}
                max={100000}
                placeholder="Number of pieces"
              />
            </label>
            <label>
              Preferred delivery date
              <input name="delivery_date" type="date" />
            </label>
          </>
        )}
        {selectedKind === "Custom team kits" && (
          <label className="full">
            Sport, kit type & sizes
            <input
              name="sizes"
              maxLength={500}
              placeholder="e.g. Cricket jersey sets: 5 M, 8 L, 3 XL"
            />
          </label>
        )}
        <label className="full">
          Your requirements <span>*</span>
          <textarea
            name="message"
            required
            minLength={5}
            maxLength={3000}
            rows={4}
            placeholder="Tell us what you need, including colours, models or other details."
          />
        </label>
        <label className="upload-field full">
          <Upload size={22} />
          <span>
            <strong>
              {fileName || "Add a logo, design or requirement list"}
            </strong>
            <small>Optional · PNG, JPG or PDF · Up to 2 MB</small>
          </span>
          <input
            name="attachment"
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            aria-label="Upload logo or requirement list"
          />
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />{" "}
        <span>
          I agree to be contacted about this request and have read the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button
        className="button button-red submit-button"
        type="submit"
        disabled={busy}
      >
        {busy ? (
          <>
            <LoaderCircle className="spin" size={18} /> Sending…
          </>
        ) : (
          "Send enquiry"
        )}
      </button>
      <p className="form-note">
        This is an enquiry, not a confirmed order. Prices and delivery are
        confirmed by our team.
      </p>
    </form>
  );
}
