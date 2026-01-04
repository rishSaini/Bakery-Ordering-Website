// app/api/custom-order/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation (server-side)
    const required = ["occasion", "dateTimeLocal", "sizeServings", "flavor", "contactName", "contactEmail", "preferredContact"];
    for (const k of required) {
      if (!String(body?.[k] ?? "").trim()) {
        return NextResponse.json({ error: `Missing required field: ${k}` }, { status: 400 });
      }
    }

    // If call/text, phone required
    if (body.preferredContact !== "email" && !String(body.contactPhone ?? "").trim()) {
      return NextResponse.json({ error: "Phone is required for call/text." }, { status: 400 });
    }

    // Parse budget (optional)
    const budgetDollarsNum =
      String(body.budgetDollars ?? "").trim() === "" ? null : Number(body.budgetDollars);

    // NOTE:
    // This assumes you have an Inquiry model (or similar) in Prisma.
    // Recommended approach: keep a few columns + store the rest in a Json payload.
    const created = await prisma.inquiry.create({
      data: {
        // If you add these fields, great:
        type: "CUSTOM_ORDER",
        status: "OPEN",

        name: String(body.contactName),
        email: String(body.contactEmail),
        phone: String(body.contactPhone ?? "") || null,
        preferredContactMethod: String(body.preferredContact),

        // Optional convenience column
        requestedFor: new Date(String(body.dateTimeLocal)),

        // Put all details in payload so your schema stays stable
        payload: {
          occasion: body.occasion,
          fulfillment: body.fulfillment,
          dateTimeLocal: body.dateTimeLocal,
          sizeServings: body.sizeServings,
          flavor: body.flavor,

          designTheme: body.designTheme,
          designPhotoUrl: body.designPhotoUrl,

          cakeName: body.cakeName,
          cakeMessage: body.cakeMessage,
          decorationDetails: body.decorationDetails,

          budgetDollars: Number.isFinite(budgetDollarsNum) ? budgetDollarsNum : null,
          allergies: body.allergies,
        },
        message: String(body.cakeMessage ?? "").trim() || "Custom order request",
      } as any, // remove `as any` once your Prisma schema matches these fields
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
