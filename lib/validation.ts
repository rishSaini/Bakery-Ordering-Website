import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  eventDate: z.string().optional(), // keep as string from form, parse on server
  message: z.string().min(10),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
