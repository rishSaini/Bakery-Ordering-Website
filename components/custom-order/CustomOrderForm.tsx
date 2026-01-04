// components/custom-order/CustomOrderForm.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PreferredContact = "text" | "call" | "email";
type Fulfillment = "pickup";

type FormState = {
  occasion: string;

  fulfillment: Fulfillment;
  dateTimeLocal: string; // from <input type="datetime-local" />
  sizeServings: string;
  flavor: string;

  designTheme: string; // text box
  designPhotoUrl: string; // uploaded to Cloudinary

  cakeName: string;
  cakeMessage: string;

  decorationDetails: string;
  budgetDollars: string; // keep as string for input; server can parse
  allergies: string;

  contactName: string;
  contactEmail: string;
  contactPhone: string;
  preferredContact: PreferredContact;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

async function uploadToCloudinary(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing Cloudinary env vars. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);
  fd.append("folder", "mayas-cake-cafe/custom-orders");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const json = await res.json();
  return String(json.secure_url ?? "");
}

export default function CustomOrderForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    occasion: "",

    fulfillment: "pickup",
    dateTimeLocal: "",
    sizeServings: "",
    flavor: "",

    designTheme: "",
    designPhotoUrl: "",

    cakeName: "",
    cakeMessage: "",

    decorationDetails: "",
    budgetDollars: "",
    allergies: "",

    contactName: "",
    contactEmail: "",
    contactPhone: "",
    preferredContact: "text",
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const occasionSuggestions = useMemo(
    () => ["Birthday", "Anniversary", "Baby Shower", "Graduation", "Holiday", "Other"],
    []
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function validateClient(next: FormState) {
    const e: Record<string, string> = {};

    if (!next.occasion.trim()) e.occasion = "Please enter an occasion.";
    if (!next.dateTimeLocal) e.dateTimeLocal = "Please choose a pickup date & time.";
    if (!next.sizeServings.trim()) e.sizeServings = "Please enter servings/size.";
    if (!next.flavor.trim()) e.flavor = "Please enter a flavor.";

    if (!next.contactName.trim()) e.contactName = "Name is required.";
    if (!next.contactEmail.trim()) e.contactEmail = "Email is required.";

    if (next.preferredContact !== "email" && !next.contactPhone.trim()) {
      e.contactPhone = "Phone is required for call/text.";
    }

    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onPickFile(file: File | null) {
    setError("");
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      set("designPhotoUrl", url);
    } catch (err: any) {
      setError(err?.message ?? "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const next = { ...form };
    if (!validateClient(next)) return;

    try {
      setSubmitting(true);

      const res = await fetch("/api/custom-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/custom-order/success");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-rose-100 md:p-8"
    >
      {/* Top note */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-100 via-white to-amber-100 p-4 ring-1 ring-rose-100">
        <div className="text-sm font-semibold text-rose-950">Heads up</div>
        <p className="mt-1 text-sm text-rose-800/90">
          <span className="font-semibold">Pickup only:</span> We’re currently not offering delivery.
          Custom orders are confirmed after we review details and send you a final quote.
        </p>
      </div>

      {/* Error */}
      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-white p-4 text-sm text-rose-900">
          <span className="font-semibold">Error:</span> {error}
        </div>
      ) : null}

      {/* Section: Event */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-rose-950">1) Event details</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-rose-900">Occasion</label>
            <input
              value={form.occasion}
              onChange={(e) => set("occasion", e.target.value)}
              list="occasion-list"
              placeholder="e.g., Birthday"
              className={cx(
                "mt-2 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2",
                fieldErrors.occasion
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-rose-200 focus:ring-rose-200"
              )}
            />
            <datalist id="occasion-list">
              {occasionSuggestions.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
            {fieldErrors.occasion ? (
              <p className="mt-1 text-xs text-rose-700">{fieldErrors.occasion}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-rose-900">Pickup time</label>
            <input
              type="datetime-local"
              value={form.dateTimeLocal}
              onChange={(e) => set("dateTimeLocal", e.target.value)}
              className={cx(
                "mt-2 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2",
                fieldErrors.dateTimeLocal
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-rose-200 focus:ring-rose-200"
              )}
            />
            {fieldErrors.dateTimeLocal ? (
              <p className="mt-1 text-xs text-rose-700">{fieldErrors.dateTimeLocal}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-rose-900">Budget (USD)</label>
            <input
              type="number"
              min={0}
              step={1}
              value={form.budgetDollars}
              onChange={(e) => set("budgetDollars", e.target.value)}
              placeholder="e.g., 85"
              className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>
        </div>
      </section>

      {/* Section: Cake */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-rose-950">2) Cake details</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-rose-900">Size / servings (or weight)</label>
            <input
              value={form.sizeServings}
              onChange={(e) => set("sizeServings", e.target.value)}
              placeholder="e.g., 10–12 servings or 2 lbs"
              className={cx(
                "mt-2 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2",
                fieldErrors.sizeServings
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-rose-200 focus:ring-rose-200"
              )}
            />
            {fieldErrors.sizeServings ? (
              <p className="mt-1 text-xs text-rose-700">{fieldErrors.sizeServings}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-rose-900">Flavor</label>
            <input
              value={form.flavor}
              onChange={(e) => set("flavor", e.target.value)}
              placeholder="e.g., Vanilla bean + strawberry"
              className={cx(
                "mt-2 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2",
                fieldErrors.flavor
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-rose-200 focus:ring-rose-200"
              )}
            />
            {fieldErrors.flavor ? (
              <p className="mt-1 text-xs text-rose-700">{fieldErrors.flavor}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-rose-900">Name on cake</label>
            <input
              value={form.cakeName}
              onChange={(e) => set("cakeName", e.target.value)}
              placeholder="e.g., Maya"
              className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-rose-900">Message on cake</label>
            <input
              value={form.cakeMessage}
              onChange={(e) => set("cakeMessage", e.target.value)}
              placeholder="e.g., Happy Birthday!"
              className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>
        </div>
      </section>

      {/* Section: Design */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-rose-950">3) Design / theme</h2>

        <div className="mt-4 grid gap-4">
          <div>
            <label className="text-sm font-semibold text-rose-900">Describe the design/theme</label>
            <textarea
              value={form.designTheme}
              onChange={(e) => set("designTheme", e.target.value)}
              placeholder="Colors, style, vibe, characters, flowers, minimal, vintage, etc."
              rows={4}
              className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div className="rounded-2xl border border-rose-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-rose-900">Inspiration photo (optional)</div>
                <div className="mt-1 text-xs text-rose-800/80">
                  Upload a reference photo — we’ll use it as inspiration.
                </div>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600">
                {uploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  disabled={uploading}
                />
              </label>
            </div>

            {form.designPhotoUrl ? (
              <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-rose-100">
                <img src={form.designPhotoUrl} alt="Uploaded inspiration" className="block h-auto w-full" />
                <div className="flex items-center justify-between bg-rose-50 px-3 py-2 text-xs">
                  <a className="underline" href={form.designPhotoUrl} target="_blank" rel="noreferrer">
                    View full image
                  </a>
                  <button
                    type="button"
                    className="font-semibold text-rose-700 hover:text-rose-950"
                    onClick={() => set("designPhotoUrl", "")}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-rose-900">Decoration details</label>
            <textarea
              value={form.decorationDetails}
              onChange={(e) => set("decorationDetails", e.target.value)}
              placeholder="Buttercream style, fondant, flowers, toppers, gold leaf, sprinkles, etc."
              rows={3}
              className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>
        </div>
      </section>

      {/* Section: Allergies */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-rose-950">4) Allergies</h2>
        <textarea
          value={form.allergies}
          onChange={(e) => set("allergies", e.target.value)}
          placeholder="List any allergies or dietary restrictions (nuts, gluten, dairy, eggs, etc.)"
          rows={3}
          className="mt-3 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
        />
      </section>

      {/* Section: Contact */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-rose-950">5) Contact details</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-rose-900">Your name</label>
            <input
              value={form.contactName}
              onChange={(e) => set("contactName", e.target.value)}
              className={cx(
                "mt-2 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2",
                fieldErrors.contactName
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-rose-200 focus:ring-rose-200"
              )}
            />
            {fieldErrors.contactName ? (
              <p className="mt-1 text-xs text-rose-700">{fieldErrors.contactName}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-rose-900">Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              className={cx(
                "mt-2 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2",
                fieldErrors.contactEmail
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-rose-200 focus:ring-rose-200"
              )}
            />
            {fieldErrors.contactEmail ? (
              <p className="mt-1 text-xs text-rose-700">{fieldErrors.contactEmail}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-rose-900">Phone (optional if email-only)</label>
            <input
              value={form.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
              placeholder="e.g., (555) 123-4567"
              className={cx(
                "mt-2 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2",
                fieldErrors.contactPhone
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-rose-200 focus:ring-rose-200"
              )}
            />
            {fieldErrors.contactPhone ? (
              <p className="mt-1 text-xs text-rose-700">{fieldErrors.contactPhone}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-rose-900">Preferred contact method</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["text", "call", "email"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set("preferredContact", m)}
                  className={cx(
                    "rounded-2xl px-4 py-2 text-sm font-semibold ring-1",
                    form.preferredContact === m
                      ? "bg-rose-500 text-white ring-rose-500"
                      : "bg-white text-rose-900 ring-rose-200 hover:bg-rose-50"
                  )}
                >
                  {m === "text" ? "Text" : m === "call" ? "Call" : "Email"}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-rose-800/80">
              If you choose call/text, please include a phone number.
            </p>
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-rose-800/80">
          By submitting, you agree we may contact you about this request.
        </p>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Custom Order"}
        </button>
      </div>
    </form>
  );
}
