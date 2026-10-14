import { z } from "zod";

const Login = z.object({
  userName: z.string(),
  password: z.string(),
});

const Register = z.object({
  userName: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phoneNumber: z.number(),
  countryCode: z.number(),
  status: z.enum(["active", "pending", "suspended"]).optional(),
});

export const registerSchema = Register;

export type Login = z.infer<typeof Login>;
export type Register = z.infer<typeof Register>;
