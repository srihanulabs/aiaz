import { z } from "zod";

export const PatientSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  status: z.enum(["active", "pending", "suspended"]).optional(),
});

export const PatientList = z.array(PatientSchema);
export type Patient = z.infer<typeof PatientSchema>;
