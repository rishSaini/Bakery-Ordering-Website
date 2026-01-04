import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmt(d: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

function Pill({ status }: { status: "OPEN" | "RESOLVED" }) {
  const cls =
    status === "OPEN"
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : "bg-emerald-50 text-emerald-800 ring-emerald-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
      {status}
    </span>
  );
}

async function resolveAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const noteRaw = formData.get("note");
  const note = noteRaw ? String(noteRaw).trim() : "";

  if (!id) return;

  await prisma.inquiry.update({
    where: { id },
    data: {
      status: "RESOLVED",
      resolvedAt: new Date(),
      resolutionNote: note.length ? note : null,
    },
  });

  revalidatePath("/admin/inquiries");
}

async function reopenAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.inquiry.update({
    where: { id },
    data: {
      status: "OPEN",
      resolvedAt: null,
      // keep resolutionNote so you don't lose history
    },
  });

  revalidatePath("/admin/inquiries");
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const sp = await searchParams;

  const statusParam = (sp.status ?? "open").toLowerCase();
  const q = (sp.q ?? "").trim();

  const statusFilter =
    statusParam === "resolved" ? "RESOLVED" : statusParam === "all" ? null : "OPEN";

  const inquiries = await prisma.inquiry.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter as any } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { message: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const tab = (label: string, value: string) => {
    const active = statusParam === value;
    const cls = active
      ? "rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white"
      : "rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-900 hover:bg-rose-50";
    return (
      <Link className={cls} href={`/admin/inquiries?status=${value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
        {label}
      </Link>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inquiries</h1>
          <p className="mt-1 text-sm text-zinc-600">
            View incoming requests and mark them resolved when handled.
          </p>
        </div>

        <form method="GET" className="flex w-full gap-2 sm:w-auto">
          <input type="hidden" name="status" value={statusParam} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name/email/phone..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200 sm:w-72"
          />
          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
            Search
          </button>
        </form>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tab("Open", "open")}
        {tab("Resolved", "resolved")}
        {tab("All", "all")}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
        {inquiries.length === 0 ? (
          <div className="p-8 text-sm text-zinc-600">No inquiries found.</div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {inquiries.map((i) => (
              <div key={i.id} className="p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill status={i.status as any} />
                      <div className="text-sm text-zinc-600">{fmt(i.createdAt)}</div>
                    </div>

                    <div className="mt-2 text-base font-semibold">
                      {i.name}{" "}
                      <span className="font-normal text-zinc-500">
                        • {i.email}
                        {i.phone ? ` • ${i.phone}` : ""}
                      </span>
                    </div>

                    {i.message ? (
                      <div className="mt-2 line-clamp-2 text-sm text-zinc-700">{i.message}</div>
                    ) : (
                      <div className="mt-2 text-sm text-zinc-500 italic">No message provided.</div>
                    )}

                    {i.resolutionNote ? (
                      <div className="mt-2 text-sm text-emerald-800">
                        <span className="font-semibold">Resolution note:</span> {i.resolutionNote}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2 lg:w-[420px]">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/inquiries/${i.id}`}
                        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                      >
                        View
                      </Link>

                      {i.status === "OPEN" ? (
                        <form action={resolveAction} className="flex flex-1 items-center gap-2">
                          <input type="hidden" name="id" value={i.id} />
                          <input
                            name="note"
                            placeholder="Resolution note (optional)"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                          />
                          <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                            Resolve
                          </button>
                        </form>
                      ) : (
                        <form action={reopenAction}>
                          <input type="hidden" name="id" value={i.id} />
                          <button className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
                            Reopen
                          </button>
                        </form>
                      )}
                    </div>

                    {i.resolvedAt ? (
                      <div className="text-xs text-zinc-500">
                        Resolved at <span className="font-medium">{fmt(i.resolvedAt)}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
