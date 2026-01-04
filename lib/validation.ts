// lib/validation.ts
import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  message: z.string().min(1),
  requestedFor: z.string().optional(),
});
