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

  const payload = asObj(inquiry.payload as Prisma.JsonValue | null);

  const isCustom = inquiry.type === "CUSTOM_ORDER";

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
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm">
            <div className="text-zinc-600">
              <span className="font-semibold text-zinc-900">Type:</span>{" "}
              {inquiry.type}
            </div>
            <div className="text-zinc-600">
              <span className="font-semibold text-zinc-900">Created:</span>{" "}
              {fmt(inquiry.createdAt)}
            </div>
            <div className="text-zinc-600">
              <span className="font-semibold text-zinc-900">Requested for:</span>{" "}
              {fmt(inquiry.requestedFor)}
            </div>
            <div className="text-zinc-600">
              <span className="font-semibold text-zinc-900">Resolved at:</span>{" "}
              {fmt(inquiry.resolvedAt)}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mt-6">
          <div className="text-sm font-semibold text-zinc-900">Message</div>
          <div className="mt-2 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800">
            {inquiry.message ?? "—"}
          </div>
        </div>

        {/* Custom order payload details */}
        {isCustom ? (
          <div className="mt-6">
            <div className="text-sm font-semibold text-zinc-900">
              Custom order details
            </div>

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
                  <div className="text-sm font-semibold text-zinc-900">
                    Design photo
                  </div>

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

                  {/* optional: raw payload */}
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
