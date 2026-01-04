import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmt(dt: Date | null | undefined) {
  if (!dt) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(dt);
}

function asObj(v: Prisma.JsonValue | null | undefined): Record<string, any> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, any>;
}

function asArr(v: Prisma.JsonValue | null | undefined): any[] | null {
  if (!v || typeof v !== "object" || !Array.isArray(v)) return null;
  return v as any[];
}

function formatMoneyFromCents(cents: number, currency = "usd") {
  const cur = (currency || "usd").toUpperCase();
  // Intl expects ISO currency codes like "USD"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(cents / 100);
}

function badgeTone(paymentStatus: string | null | undefined) {
  const s = (paymentStatus ?? "").toUpperCase();
  if (s === "PAID") return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  if (s === "PENDING") return "bg-amber-50 text-amber-800 ring-amber-200";
  if (s === "CANCELED" || s === "FAILED") return "bg-rose-50 text-rose-800 ring-rose-200";
  return "bg-zinc-100 text-zinc-700 ring-zinc-200";
}

async function updateAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "OPEN");
  const noteRaw = formData.get("resolutionNote");
  const note = noteRaw ? String(noteRaw).trim() : "";

  if (!id) return;

  await prisma.inquiry.update({
    where: { id },
    data: {
      status: status === "RESOLVED" ? "RESOLVED" : "OPEN",
      resolvedAt: status === "RESOLVED" ? new Date() : null,
      resolutionNote: note.length ? note : null,
    },
  });

  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin/inquiries");
  redirect(`/admin/inquiries/${id}`);
}

// ✅ Next 16: params is a Promise
export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) return notFound();

  // Keep your existing custom payload flow
  const payload = asObj((inquiry as any).payload as Prisma.JsonValue | null);

  const isCustom = inquiry.type === "CUSTOM_ORDER";
  const isOnlineOrder = inquiry.type === "ORDER";

  // Online-order fields (cast so this file won’t explode if you haven’t generated types yet)
  const paymentStatus = (inquiry as any).paymentStatus as string | null | undefined;
  const amountCents = (inquiry as any).amountCents as number | null | undefined;
  const currency = ((inquiry as any).currency as string | null | undefined) ?? "usd";
  const paidAt = (inquiry as any).paidAt as Date | null | undefined;
  const itemsJson = asArr((inquiry as any).itemsJson as Prisma.JsonValue | null);
  const stripeCheckoutSessionId = (inquiry as any).stripeCheckoutSessionId as string | null | undefined;
  const stripePaymentIntentId = (inquiry as any).stripePaymentIntentId as string | null | undefined;

  const computedSubtotalCents =
    itemsJson?.reduce((sum, it) => {
      const qty = Number(it?.qty ?? 0);
      const unit = Number(it?.unitPriceCents ?? 0);
      return sum + qty * unit;
    }, 0) ?? 0;

  const chargedCents = typeof amountCents === "number" ? amountCents : computedSubtotalCents;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/inquiries"
          className="text-sm font-semibold text-zinc-700 hover:text-zinc-950"
        >
          ← Back to inquiries
        </Link>
        <div className="text-sm text-zinc-500">ID: {inquiry.id}</div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">{inquiry.name}</h1>
            <div className="mt-2 text-sm text-zinc-700">
              {inquiry.email}
              {inquiry.phone ? ` • ${inquiry.phone}` : ""}
            </div>

            {isOnlineOrder ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${badgeTone(
                    paymentStatus
                  )}`}
                >
                  {(paymentStatus ?? "NOT_APPLICABLE").toUpperCase()}
                </span>

                <span className="text-xs text-zinc-600">
                  Charged: <span className="font-semibold text-zinc-900">{formatMoneyFromCents(chargedCents, currency)}</span>
                </span>

                <span className="text-xs text-zinc-600">
                  Paid at: <span className="font-semibold text-zinc-900">{fmt(paidAt)}</span>
                </span>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm">
            <div className="text-zinc-600">
              <span className="font-semibold text-zinc-900">Type:</span> {inquiry.type}
            </div>
            <div className="text-zinc-600">
              <span className="font-semibold text-zinc-900">Created:</span> {fmt(inquiry.createdAt)}
            </div>
            <div className="text-zinc-600">
              <span className="font-semibold text-zinc-900">Requested for:</span>{" "}
              {fmt((inquiry as any).requestedFor)}
            </div>
            <div className="text-zinc-600">
              <span className="font-semibold text-zinc-900">Resolved at:</span> {fmt(inquiry.resolvedAt)}
            </div>

            {isOnlineOrder ? (
              <div className="mt-2 border-t border-zinc-200 pt-2">
                <div className="text-zinc-600">
                  <span className="font-semibold text-zinc-900">Payment:</span>{" "}
                  {(paymentStatus ?? "NOT_APPLICABLE").toUpperCase()}
                </div>
                <div className="text-zinc-600">
                  <span className="font-semibold text-zinc-900">Total:</span>{" "}
                  {formatMoneyFromCents(chargedCents, currency)}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Message */}
        <div className="mt-6">
          <div className="text-sm font-semibold text-zinc-900">
            {isOnlineOrder ? "Customer note" : "Message"}
          </div>
          <div className="mt-2 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800">
            {inquiry.message ?? "—"}
          </div>
        </div>

        {/* ✅ Online order details (Stripe Checkout orders) */}
        {isOnlineOrder ? (
          <div className="mt-6">
            <div className="text-sm font-semibold text-zinc-900">Online order details</div>

            {/* Items */}
            <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900">
                Items
              </div>

              {itemsJson && itemsJson.length ? (
                <table className="w-full text-sm">
                  <thead className="bg-white text-zinc-600">
                    <tr className="border-b border-zinc-100">
                      <th className="px-4 py-3 text-left font-semibold">Item</th>
                      <th className="px-4 py-3 text-right font-semibold">Unit</th>
                      <th className="px-4 py-3 text-right font-semibold">Qty</th>
                      <th className="px-4 py-3 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {itemsJson.map((it, idx) => {
                      const name = String(it?.name ?? "Item");
                      const qty = Number(it?.qty ?? 0);
                      const unit = Number(it?.unitPriceCents ?? 0);
                      const line = qty * unit;

                      return (
                        <tr key={idx} className="text-zinc-800">
                          <td className="px-4 py-3">
                            <div className="font-medium">{name}</div>
                            <div className="text-xs text-zinc-500">{it?.productId ?? ""}</div>
                          </td>
                          <td className="px-4 py-3 text-right">{formatMoneyFromCents(unit, currency)}</td>
                          <td className="px-4 py-3 text-right">{qty}</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {formatMoneyFromCents(line, currency)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-zinc-50">
                    <tr className="border-t border-zinc-200">
                      <td className="px-4 py-3 text-zinc-600" colSpan={3}>
                        Computed subtotal
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatMoneyFromCents(computedSubtotalCents, currency)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-zinc-600" colSpan={3}>
                        Charged (stored)
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatMoneyFromCents(chargedCents, currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="px-4 py-4 text-sm text-zinc-600">
                  No item snapshot found for this order yet.
                </div>
              )}
            </div>

            {/* Payment + Stripe IDs */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="text-sm font-semibold text-zinc-900">Payment</div>
                <div className="mt-2 text-sm text-zinc-700">
                  <div>
                    <span className="font-semibold text-zinc-900">Status:</span>{" "}
                    {(paymentStatus ?? "NOT_APPLICABLE").toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900">Paid at:</span> {fmt(paidAt)}
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900">Total charged:</span>{" "}
                    {formatMoneyFromCents(chargedCents, currency)}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="text-sm font-semibold text-zinc-900">Stripe references</div>
                <div className="mt-2 space-y-2 text-sm text-zinc-700">
                  <div>
                    <div className="text-xs font-semibold text-zinc-500">Checkout session</div>
                    <div className="mt-1 break-all rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-800">
                      {stripeCheckoutSessionId ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-500">Payment intent</div>
                    <div className="mt-1 break-all rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-800">
                      {stripePaymentIntentId ?? "—"}
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500">
                    Tip: paste an ID into Stripe Dashboard search to find the payment instantly.
                  </div>
                </div>
              </div>
            </div>

            {/* Optional debug: itemsJson */}
            <details className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <summary className="cursor-pointer text-sm font-semibold text-zinc-900">
                Raw order snapshot (debug)
              </summary>
              <pre className="mt-2 overflow-auto text-xs text-zinc-800">
                {JSON.stringify(itemsJson ?? null, null, 2)}
              </pre>
            </details>
          </div>
        ) : null}

        {/* Custom order payload details (unchanged) */}
        {isCustom ? (
          <div className="mt-6">
            <div className="text-sm font-semibold text-zinc-900">Custom order details</div>

            {payload ? (
              <div className="mt-3 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <div><span className="font-semibold">Occasion:</span> {payload.occasion ?? "—"}</div>
                  <div><span className="font-semibold">Fulfillment:</span> {payload.fulfillment ?? "—"}</div>
                  <div><span className="font-semibold">Local time:</span> {payload.dateTimeLocal ?? "—"}</div>
                  <div><span className="font-semibold">Size/Servings:</span> {payload.sizeServings ?? "—"}</div>
                  <div><span className="font-semibold">Flavor:</span> {payload.flavor ?? "—"}</div>
                  <div><span className="font-semibold">Design theme:</span> {payload.designTheme ?? "—"}</div>
                  <div><span className="font-semibold">Cake name:</span> {payload.cakeName ?? "—"}</div>
                  <div><span className="font-semibold">Decoration:</span> {payload.decorationDetails ?? "—"}</div>
                  <div><span className="font-semibold">Budget:</span> {payload.budgetDollars ?? "—"}</div>
                  <div><span className="font-semibold">Allergies:</span> {payload.allergies ?? "—"}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-zinc-900">Design photo</div>

                  {payload.designPhotoUrl ? (
                    <a
                      href={String(payload.designPhotoUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-xl border border-zinc-200"
                      title="Open full image"
                    >
                      <Image
                        src={String(payload.designPhotoUrl)}
                        alt="Design reference"
                        width={800}
                        height={600}
                        className="h-auto w-full"
                      />
                    </a>
                  ) : (
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                      —
                    </div>
                  )}

                  <details className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-zinc-900">
                      Raw payload (debug)
                    </summary>
                    <pre className="mt-2 overflow-auto text-xs text-zinc-800">
                      {JSON.stringify(payload, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            ) : (
              <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                No payload found.
              </div>
            )}
          </div>
        ) : null}

        {/* Resolve controls */}
        <form action={updateAction} className="mt-6 grid gap-3">
          <input type="hidden" name="id" value={inquiry.id} />

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-sm font-semibold text-zinc-900">
              Status
              <select
                name="status"
                defaultValue={inquiry.status}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
              >
                <option value="OPEN">OPEN</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-zinc-900">
              Resolution note
              <input
                name="resolutionNote"
                defaultValue={inquiry.resolutionNote ?? ""}
                placeholder="What did we do / what did we tell them?"
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>

          <button className="mt-2 w-fit rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
