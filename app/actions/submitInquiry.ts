"use server";

import { inquirySchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function submitInquiry(formData: FormData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? "") || undefined,
    eventDate: String(formData.get("eventDate") ?? "") || undefined,
    message: String(formData.get("message") ?? ""),
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid form input." };
  }

  const { name, email, phone, eventDate, message } = parsed.data;

  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      email,
      phone,
      eventDate: eventDate ? new Date(eventDate) : null,
      message,
    },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_TO!,
    subject: `New cake inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? "-"}\nEvent date: ${eventDate ?? "-"}\n\nMessage:\n${message}\n\nInquiry ID: ${inquiry.id}`,
  });

  return { ok: true };
}
