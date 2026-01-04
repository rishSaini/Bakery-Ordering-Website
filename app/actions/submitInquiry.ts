// app/actions/submitInquiry.ts
"use server";

import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validation";

export async function submitInquiry(formData: FormData) {
  const parsed = inquirySchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? "") || null,
    message: String(formData.get("message") ?? ""),
    requestedFor: String(formData.get("requestedFor") ?? "") || undefined, // ✅
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid form data" };
  }

  const { name, email, phone, message, requestedFor } = parsed.data;

  const inquiry = await prisma.inquiry.create({
    data: {
      type: "CONTACT",
      status: "OPEN",
      name,
      email,
      phone,
      // optional — your schema has default("EMAIL")
      preferredContactMethod: "EMAIL",

      requestedFor: requestedFor ? new Date(requestedFor) : null,

      message,
    },
  });

  return { ok: true, id: inquiry.id };
}
