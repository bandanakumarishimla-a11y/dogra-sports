import { NextResponse } from "next/server";
import { serverDb } from "@/lib/supabase";
export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== (request.headers.get("host") || new URL(request.url).host))
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 },
      );
    const bodyText = await request.text();
    if (bodyText.length > 2900000)
      return NextResponse.json(
        { error: "File is too large." },
        { status: 413 },
      );
    const body = JSON.parse(bodyText);
    if (body.website) return NextResponse.json({ ok: true });
    const clean = (key: string, max: number) =>
      String(body[key] ?? "")
        .trim()
        .slice(0, max);
    const name = clean("name", 100),
      phone = clean("phone", 20),
      kind = clean("kind", 40),
      message = clean("message", 3000);
    if (
      name.length < 2 ||
      !/[0-9+ ()-]{10,20}/.test(phone) ||
      !/^\+?[0-9 ()-]+$/.test(phone) ||
      phone.replace(/\D/g, "").length < 10 ||
      message.length < 5 ||
      !body.consent ||
      ![
        "General enquiry",
        "Product enquiry",
        "Custom team kits",
        "Institutional / bulk order",
      ].includes(kind)
    )
      return NextResponse.json(
        {
          error:
            "Please complete your name, phone number, requirements and consent.",
        },
        { status: 400 },
      );
    const quantity = body.quantity ? Number(body.quantity) : null;
    if (
      quantity !== null &&
      (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000)
    )
      return NextResponse.json(
        { error: "Please enter a valid quantity." },
        { status: 400 },
      );
    const date = body.delivery_date || null;
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date))
      return NextResponse.json(
        { error: "Please enter a valid date." },
        { status: 400 },
      );
    const a = body.attachment;
    if (
      a &&
      (!["image/png", "image/jpeg", "application/pdf"].includes(a.type) ||
        typeof a.base64 !== "string" ||
        a.base64.length > 2796204 ||
        !a.base64.length ||
        !/^[A-Za-z0-9+/]+={0,2}$/.test(a.base64) ||
        typeof a.name !== "string")
    )
      return NextResponse.json(
        { error: "Please choose a PNG, JPG or PDF file smaller than 2 MB." },
        { status: 400 },
      );
    if (a) {
      const bytes = Buffer.from(a.base64, "base64");
      const valid =
        a.type === "application/pdf"
          ? bytes.subarray(0, 5).toString() === "%PDF-"
          : a.type === "image/png"
            ? bytes
                .subarray(0, 8)
                .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      if (!valid)
        return NextResponse.json(
          { error: "The uploaded file does not match its file type." },
          { status: 400 },
        );
    }
    const { error } = await serverDb()
      .from("dogra_enquiries")
      .insert({
        name,
        phone,
        kind,
        message,
        organisation: clean("organisation", 150),
        product: clean("product", 150),
        quantity,
        sizes: clean("sizes", 500),
        delivery_date: date,
        attachment_name: a ? String(a.name).slice(0, 150) : null,
        attachment_type: a?.type || null,
        attachment_base64: a?.base64 || null,
      });
    if (error) {
      console.error("Enquiry submission failed", { code: error.code });
      return NextResponse.json(
        {
          error:
            error.code === "P0001"
              ? "You have sent several requests. Please call our store for further help."
              : "Could not save your enquiry. Please try again or call the store.",
        },
        { status: error.code === "P0001" ? 429 : 503 },
      );
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not process the enquiry. Please check your details and try again.",
      },
      { status: 400 },
    );
  }
}
