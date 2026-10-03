import { PolicyPage } from "@/components/policy-page";
export const metadata = { title: "Returns & Size Exchanges" };
export default function Returns() {
  return (
    <PolicyPage
      kind="returns"
      title="Returns & Size Exchanges"
      draft
      content={`Please confirm the applicable return, exchange and warranty terms before purchasing. Eligibility may depend on the product, condition, brand terms and whether the item is customised.

For a size exchange, contact the store with your order details and required size. Confirm availability and the applicable shipping arrangements before sending anything back.

For a damaged or incorrect item, keep the packaging and share the order details and clear photographs with the store so the issue can be reviewed.

Customised jerseys and uniforms require careful approval of artwork, names, numbers and sizes before production. The store will confirm the applicable correction or exchange terms for your order.

Do not return a parcel without first discussing it with Dogra Sports. No fixed return window or refund commitment is published until the store confirms its final policy.`}
    />
  );
}
