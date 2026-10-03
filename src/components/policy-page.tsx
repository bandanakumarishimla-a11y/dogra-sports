import { getSettings } from "@/lib/data";
import { business } from "@/lib/config";
export async function PolicyPage({
  kind,
  title,
  content,
  draft = false,
}: {
  kind: string;
  title: string;
  content: string;
  draft?: boolean;
}) {
  const settings = await getSettings();
  const text = settings.policies?.[kind] || content;
  return (
    <div className="container section policy-page">
      <span className="eyebrow">DOGRA SPORTS</span>
      <h1>{title}</h1>
      {draft && !settings.policies?.[kind] && (
        <p className="policy-draft">
          Order-specific policy details are under review. Confirm terms with the
          store before placing an order.
        </p>
      )}
      <div className="policy-content">
        {text.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p>
        For questions, call <a href={business.phoneHref}>{business.phone}</a> or
        visit our store near ITI Bilaspur.
      </p>
    </div>
  );
}
