"use client";
import { useEffect, useState, type FormEvent } from "react";
import { browserDb } from "@/lib/supabase";
import { categories } from "@/lib/config";
import { defaultSettings } from "@/lib/data-defaults";
import type { Product, Settings, Enquiry } from "@/lib/types";
import {
  LoaderCircle,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Download,
  LockKeyhole,
  Package,
  MessageSquare,
  Settings2,
} from "lucide-react";
const emptyProduct: Partial<Product> = {
  name: "",
  slug: "",
  category: "Cricket",
  brand: "",
  description: "",
  details: [],
  sizes: [],
  colours: [],
  price: null,
  stock: "Check availability",
  image_url: null,
  featured: false,
  published: true,
  sample: false,
};
export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const db = browserDb();
  async function refresh() {
    const [p, e, s] = await Promise.all([
      db.from("dogra_products").select("*").order("created_at"),
      db
        .from("dogra_enquiries")
        .select(
          "id,created_at,name,phone,kind,organisation,product,quantity,sizes,delivery_date,message,attachment_name,attachment_type,status",
        )
        .order("created_at", { ascending: false })
        .limit(100),
      db.from("dogra_settings").select("value").eq("id", "store").single(),
    ]);
    if (p.error || e.error || s.error)
      throw new Error("Could not load the dashboard. Please try again.");
    setProducts(p.data || []);
    setEnquiries(e.data || []);
    setSettings({
      ...defaultSettings,
      ...((s.data?.value as Partial<Settings>) || {}),
    });
  }
  async function verify() {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await db.auth.getUser();
      setSignedIn(!!user);
      if (!user) {
        setAdmin(false);
        return;
      }
      const { data, error } = await db
        .from("dogra_admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      setAdmin(!!data);
      if (data) await refresh();
    } catch {
      setError("Could not verify your account. Please sign in again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    verify();
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setAdmin(false);
        setSignedIn(false);
        setProducts([]);
        setEnquiries([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const { error } = await db.auth.signInWithPassword({
        email: String(data.get("email")),
        password: String(data.get("password")),
      });
      if (error)
        throw new Error("Could not sign in. Check your email and password.");
      await verify();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    await db.auth.signOut();
    setAdmin(false);
    setSignedIn(false);
    setNotice("");
    setEditing(null);
    setError("");
  }
  async function upload(file: File) {
    if (
      file.size > 5 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      throw new Error("Choose a JPG, PNG or WebP smaller than 5 MB.");
    const path = `${crypto.randomUUID()}.${file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1]}`;
    const { error } = await db.storage
      .from("dogra-products")
      .upload(path, file, { contentType: file.type });
    if (error) throw new Error("Image upload failed. Please try again.");
    return db.storage.from("dogra-products").getPublicUrl(path).data.publicUrl;
  }
  async function saveProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    setError("");
    setNotice("");
    const data = new FormData(e.currentTarget);
    try {
      let image_url = editing.image_url;
      const file = data.get("image") as File;
      if (file?.size) image_url = await upload(file);
      const csv = (k: string) =>
        String(data.get(k) || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      const payload = {
        name: String(data.get("name")).trim(),
        slug: String(data.get("slug")).trim(),
        category: String(data.get("category")),
        brand: String(data.get("brand") || "").trim(),
        description: String(data.get("description") || ""),
        details: String(data.get("details") || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        sizes: csv("sizes"),
        colours: csv("colours"),
        price: data.get("price") ? Number(data.get("price")) : null,
        stock: String(data.get("stock")),
        image_url: image_url || null,
        featured: !!data.get("featured"),
        published: !!data.get("published"),
        sample: !!data.get("sample"),
      };
      const result = editing.id
        ? await db.from("dogra_products").update(payload).eq("id", editing.id)
        : await db.from("dogra_products").insert(payload);
      if (result.error)
        throw new Error(
          "Could not save. Check that the slug is unique and contains only lowercase letters, numbers and hyphens.",
        );
      setEditing(null);
      await refresh();
      setNotice("Product saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the product.");
    } finally {
      setBusy(false);
    }
  }
  async function removeProduct(p: Product) {
    if (!confirm(`Delete ${p.name}? This removes it from the catalogue.`))
      return;
    setError("");
    const { error } = await db.from("dogra_products").delete().eq("id", p.id);
    if (error) setError("Could not delete the product.");
    else {
      await refresh();
      setNotice("Product removed.");
    }
  }
  async function updateStatus(id: string, status: string) {
    const { error } = await db
      .from("dogra_enquiries")
      .update({ status })
      .eq("id", id);
    if (error) setError("Could not update the enquiry.");
    else
      setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status } : e)));
  }
  async function download(e: Enquiry) {
    try {
      const { data, error } = await db
        .from("dogra_enquiries")
        .select("attachment_base64")
        .eq("id", e.id)
        .single();
      if (error || !data?.attachment_base64) throw new Error();
      const binary = atob(data.attachment_base64);
      const url = URL.createObjectURL(
        new Blob([Uint8Array.from(binary, (c) => c.charCodeAt(0))], {
          type: e.attachment_type || "application/octet-stream",
        }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = e.attachment_name || "attachment";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      setError("Could not download the attachment.");
    }
  }
  async function saveSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = new FormData(e.currentTarget);
      const whatsapp = String(data.get("whatsapp") || "").replace(
        /[^0-9]/g,
        "",
      );
      if (whatsapp && !/^\d{10,15}$/.test(whatsapp))
        throw new Error(
          "Use the country code and phone number, e.g. 918351069133.",
        );
      const file = data.get("gallery_image") as File;
      let gallery = settings.gallery.map((g, i) => ({
        ...g,
        caption: String(data.get(`caption_${i}`) || g.caption),
      }));
      if (file?.size) {
        const url = await upload(file);
        gallery = [
          ...gallery,
          {
            url,
            caption: String(data.get("gallery_caption") || "Dogra Sports"),
          },
        ];
      }
      const policies = Object.fromEntries(
        ["privacy", "terms", "shipping", "returns"].map((k) => [
          k,
          String(data.get(`policy_${k}`) || ""),
        ]),
      );
      const value = {
        ...settings,
        hero_title: String(data.get("hero_title") || ""),
        hero_subtitle: String(data.get("hero_subtitle") || ""),
        whatsapp,
        gallery,
        policies,
      };
      const { error } = await db
        .from("dogra_settings")
        .update({ value })
        .eq("id", "store");
      if (error) throw new Error("Could not save store content.");
      setSettings(value);
      setNotice("Store content saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }
  async function removeGallery(index: number) {
    if (!confirm("Remove this photograph from the gallery?")) return;
    const value = {
      ...settings,
      gallery: settings.gallery.filter((_, i) => i !== index),
    };
    const { error } = await db
      .from("dogra_settings")
      .update({ value })
      .eq("id", "store");
    if (error) setError("Could not remove the photograph.");
    else setSettings(value);
  }
  if (loading)
    return (
      <div className="empty-state">
        <LoaderCircle className="spin" />
        <p>Checking your account…</p>
      </div>
    );
  if (!admin)
    return (
      <div className="admin-login">
        <LockKeyhole size={36} />
        <span className="eyebrow">DOGRA SPORTS · STORE ADMIN</span>
        <h1>{signedIn ? "Staff access required." : "Welcome back."}</h1>
        {signedIn ? (
          <>
            <p>
              Your account is signed in but has not been approved as a store
              administrator. The store owner must grant access before you can
              manage products or customer enquiries.
            </p>
            <button className="button button-red" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <p>Sign in with your approved staff account.</p>
            <form onSubmit={signIn} className="enquiry-form">
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="button button-red" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <small>
              First-time setup: the store owner creates a staff account and
              grants admin access in Supabase. See the repository setup guide.
            </small>
          </>
        )}
      </div>
    );
  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow">DOGRA SPORTS ADMIN</span>
          <h1>Store dashboard.</h1>
        </div>
        <button className="button button-light" onClick={signOut}>
          <LogOut size={18} /> Sign out
        </button>
      </div>
      <div className="admin-tabs">
        {[
          [Package, "products", "Products"],
          [MessageSquare, "enquiries", "Enquiries"],
          [Settings2, "content", "Store content"],
        ].map(([Icon, key, label]) => {
          const I = Icon as typeof Package;
          return (
            <button
              key={String(key)}
              className={tab === key ? "active" : ""}
              onClick={() => {
                setTab(String(key));
                setEditing(null);
                setError("");
                setNotice("");
              }}
            >
              <I size={18} />
              {String(label)}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="form-notice" role="status">
          {notice}
        </p>
      )}
      {tab === "products" &&
        (editing ? (
          <div className="form-panel">
            <h2>{editing.id ? "Edit product" : "Add a product"}</h2>
            <form
              key={editing.id || "new"}
              className="enquiry-form"
              onSubmit={saveProduct}
            >
              <div className="form-grid">
                <label>
                  Name
                  <input
                    name="name"
                    defaultValue={editing.name}
                    maxLength={150}
                    required
                  />
                </label>
                <label>
                  URL slug
                  <input
                    name="slug"
                    defaultValue={editing.slug}
                    pattern="[a-z0-9-]+"
                    required
                    placeholder="e.g. cricket-bat-model"
                  />
                </label>
                <label>
                  Category
                  <select name="category" defaultValue={editing.category}>
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Brand
                  <input name="brand" defaultValue={editing.brand} />
                </label>
                <label className="full">
                  Description
                  <textarea
                    name="description"
                    defaultValue={editing.description}
                    rows={3}
                  />
                </label>
                <label className="full">
                  Specifications (one per line)
                  <textarea
                    name="details"
                    defaultValue={editing.details?.join("\n")}
                    rows={4}
                  />
                </label>
                <label>
                  Sizes (comma separated)
                  <input
                    name="sizes"
                    defaultValue={editing.sizes?.join(", ")}
                  />
                </label>
                <label>
                  Colours (comma separated)
                  <input
                    name="colours"
                    defaultValue={editing.colours?.join(", ")}
                  />
                </label>
                <label>
                  Price in ₹ (blank if unconfirmed)
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={editing.price ?? ""}
                  />
                </label>
                <label>
                  Availability
                  <select name="stock" defaultValue={editing.stock}>
                    {[
                      "Check availability",
                      "In stock",
                      "Out of stock",
                      "Made to order",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  Product photo
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                  />
                  <small>JPG, PNG or WebP · Up to 5 MB</small>
                </label>
              </div>
              <div className="admin-checks">
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editing.featured}
                  />{" "}
                  Featured on homepage
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={editing.published}
                  />{" "}
                  Published
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="sample"
                    defaultChecked={editing.sample}
                  />{" "}
                  Sample range
                </label>
              </div>
              <div className="form-actions">
                <button className="button button-red" disabled={busy}>
                  {busy ? "Saving…" : "Save product"}
                </button>
                <button
                  type="button"
                  className="button button-light"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="section-heading">
              <h2>{products.length} products</h2>
              <button
                className="button button-red"
                onClick={() => setEditing({ ...emptyProduct })}
              >
                <Plus size={18} /> Add product
              </button>
            </div>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                        <small>
                          {p.slug}
                          {p.sample ? " · Sample range" : ""}
                        </small>
                      </td>
                      <td>{p.category}</td>
                      <td>{p.price ?? "Unconfirmed"}</td>
                      <td>{p.published ? "Published" : "Draft"}</td>
                      <td>
                        <button
                          aria-label={`Edit ${p.name}`}
                          className="icon-button"
                          onClick={() => setEditing(p)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          aria-label={`Delete ${p.name}`}
                          className="icon-button"
                          onClick={() => removeProduct(p)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ))}
      {tab === "enquiries" && (
        <>
          <div className="section-heading">
            <h2>Customer enquiries</h2>
            <button
              className="button button-light"
              onClick={() =>
                refresh().catch(() => setError("Could not refresh."))
              }
            >
              Refresh
            </button>
          </div>
          <p className="form-note">Showing the latest 100 enquiries.</p>
          {enquiries.length ? (
            enquiries.map((e) => (
              <article className="enquiry-card" key={e.id}>
                <div className="enquiry-top">
                  <div>
                    <span className="eyebrow">{e.kind}</span>
                    <h3>{e.name}</h3>
                    <a href={`tel:${e.phone.replace(/[^0-9+]/g, "")}`}>
                      {e.phone}
                    </a>
                  </div>
                  <label>
                    Status
                    <select
                      value={e.status}
                      onChange={(v) => updateStatus(e.id, v.target.value)}
                    >
                      {["new", "contacted", "closed"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="preserve-lines">{e.message}</p>
                <dl className="enquiry-meta">
                  {Object.entries({
                    Organisation: e.organisation,
                    Product: e.product,
                    Quantity: e.quantity,
                    Sizes: e.sizes,
                    "Preferred date": e.delivery_date,
                  })
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                </dl>
                <small>{new Date(e.created_at).toLocaleString()}</small>
                {e.attachment_name && (
                  <button
                    className="button button-light"
                    onClick={() => download(e)}
                  >
                    <Download size={17} />
                    {e.attachment_name}
                  </button>
                )}
              </article>
            ))
          ) : (
            <div className="empty-state">
              <MessageSquare size={36} />
              <h2>No enquiries yet.</h2>
              <p>Customer requests will appear here when submitted.</p>
            </div>
          )}
        </>
      )}
      {tab === "content" && (
        <form
          className="form-panel enquiry-form"
          onSubmit={saveSettings}
          key={JSON.stringify(settings)}
        >
          <h2>Homepage & contact</h2>
          <label>
            Hero headline (one line per row)
            <textarea
              name="hero_title"
              defaultValue={settings.hero_title}
              rows={2}
              required
              maxLength={100}
            />
          </label>
          <label>
            Hero supporting text
            <textarea
              name="hero_subtitle"
              defaultValue={settings.hero_subtitle}
              rows={3}
              required
              maxLength={300}
            />
          </label>
          <label>
            Confirmed WhatsApp number
            <input
              name="whatsapp"
              defaultValue={settings.whatsapp}
              placeholder="Country code + number, e.g. 918351069133"
            />
            <small>
              Leave blank to show the call button. Add only a number you have
              confirmed is active on WhatsApp.
            </small>
          </label>
          <h2>Gallery</h2>
          {settings.gallery.map((g, i) => (
            <div className="gallery-admin-row" key={g.url}>
              <label>
                Photo {i + 1} caption
                <input name={`caption_${i}`} defaultValue={g.caption} />
              </label>
              <a href={g.url} target="_blank" rel="noopener noreferrer">
                View photo
              </a>
              <button
                type="button"
                className="icon-button"
                aria-label={`Remove gallery photo ${i + 1}`}
                onClick={() => removeGallery(i)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <label>
            Add a gallery photograph
            <input
              name="gallery_image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
            />
          </label>
          <label>
            New photograph caption
            <input name="gallery_caption" maxLength={200} />
          </label>
          <h2>Policy pages</h2>
          <p>
            Review your shipping and exchange terms before adding commitments.
          </p>
          {["privacy", "terms", "shipping", "returns"].map((k) => (
            <label key={k}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
              <textarea
                name={`policy_${k}`}
                defaultValue={settings.policies?.[k] || ""}
                rows={8}
                placeholder="Leave blank to use the initial policy text."
              />
            </label>
          ))}
          <button className="button button-red" disabled={busy}>
            {busy ? "Saving…" : "Save store content"}
          </button>
        </form>
      )}
    </>
  );
}
