import { PolicyPage } from "@/components/policy-page";
export const metadata = { title: "Terms and Conditions" };
export default function Terms() {
  return (
    <PolicyPage
      kind="terms"
      title="Terms and Conditions"
      content={`The Dogra Sports website provides a product catalogue and enquiry service. Submitting an enquiry does not create a confirmed order, reserve stock or make a payment.

Entries labelled “Sample range” describe product categories and are not verified listings of current inventory. Illustrative photography does not show the actual store, stock or customers. Confirm product models, specifications, prices, taxes, availability and delivery terms directly with the store.

Custom teamwear requires confirmation of design, fabric, quantities, sizes, names, numbers and logos before production. Please ensure you have permission to use the logos or designs you submit.

Payment arrangements, order confirmation and any order-specific terms are agreed with Dogra Sports. Online checkout is not enabled on this website.

Website content may be updated as stock and requirements change. If you spot incorrect information, please contact the store.`}
    />
  );
}
