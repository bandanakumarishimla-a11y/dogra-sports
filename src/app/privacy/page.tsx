import { PolicyPage } from "@/components/policy-page";
export const metadata = { title: "Privacy Policy" };
export default function Privacy() {
  return (
    <PolicyPage
      kind="privacy"
      title="Privacy Policy"
      content={`When you send an enquiry, Dogra Sports collects the information you provide, including your name, phone number, team or organisation, product requirements and any uploaded logo or requirement list. Please do not upload identity documents, payment credentials or other sensitive information.

We use this information to respond to your request, prepare quotations and discuss your order. Customer enquiry records and attachments are restricted to approved store administrators. We do not publish customer enquiries.

Our website uses Supabase to store enquiry information and product content. Vercel hosts the website and may process technical request information needed to operate and protect the service. Approved staff authentication uses session storage in the staff browser.

We do not use advertising trackers or require a customer account for enquiries. External links such as Google Maps or WhatsApp are governed by those services’ own policies. A WhatsApp button appears only when the store has configured a confirmed number.

To request a correction or deletion of information you submitted, call the store. We may need to verify the request to protect your information.`}
    />
  );
}
