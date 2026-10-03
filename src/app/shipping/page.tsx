import { PolicyPage } from "@/components/policy-page";
export const metadata = { title: "Shipping & Delivery" };
export default function Shipping() {
  return (
    <PolicyPage
      kind="shipping"
      title="Shipping & Delivery"
      draft
      content={`Delivery availability, service provider, charges and dispatch schedule are confirmed for each order. Please share your delivery address and required date when requesting a quotation.

Do not assume that a preferred delivery date entered in an enquiry is guaranteed. The store will confirm a schedule after reviewing availability and, for custom kits, design and production requirements.

Transport, installation, advance payment and cash-on-delivery arrangements, where applicable, must be confirmed with the store before an order is placed.

For delivery updates or a concern about a received parcel, contact Dogra Sports with your order details.`}
    />
  );
}
