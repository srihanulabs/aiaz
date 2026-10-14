import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("A valid email address is required")
  .max(255)
  .meta({ description: "Email address", example: "ada@example.com" });

/**
 * Length is the dominant factor in password strength, so we require a real
 * minimum and otherwise stay out of the user's way. Composition rules
 * ("must contain a symbol") push people toward predictable substitutions;
 * OWASP recommends a long minimum instead. The upper bound exists so a
 * multi-megabyte password cannot be used to tie up argon2.
 */
const password = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password must be at most 128 characters")
  .meta({
    description: "At least 12 characters. Length matters more than symbols.",
    example: "a-long-enough-password",
  });

export const roleSchema = z
  .enum(["USER", "MODERATOR", "ADMIN"])
  .meta({ description: "Authorization tier" });

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

export const registerSchema = z.object({
  email,
  password,
  name: z.string().trim().min(1).max(100).optional().meta({ example: "Ada Lovelace" }),
});

export const loginSchema = z.object({
  email,
  // Not `password`: existing accounts may predate the current rules, and
  // validating a login attempt against them would leak the policy.
  password: z.string().min(1, "Password is required").max(128),
});

export const updateRoleSchema = z.object({ role: roleSchema });

export const userIdParamSchema = z.object({
  id: z.string().uuid("A valid user id is required").meta({
    description: "Target user id",
  }),
});

export const listUsersQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
});

// ---------------------------------------------------------------------------
// Responses
//
// Declared so the docs show real shapes and Fastify serializes exactly these
// fields. Anything not listed here is stripped from the response — which is a
// second, structural guarantee that `passwordHash` can never escape.
// ---------------------------------------------------------------------------

export const publicUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  name: z.string().nullable(),
  role: roleSchema,
  createdAt: z.date().or(z.string()),
});

export const sessionResponseSchema = z.object({
  user: publicUserSchema,
  accessToken: z.string().meta({ description: "JWT. Send as `Authorization: Bearer <token>`." }),
  tokenType: z.literal("Bearer"),
  expiresIn: z.string().meta({ example: "15m" }),
});

export const tokenResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.literal("Bearer"),
  expiresIn: z.string(),
});

export const meResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string(),
    role: roleSchema,
  }),
});

export const userResponseSchema = z.object({ user: publicUserSchema });

export const usersListResponseSchema = z.object({
  users: z.array(publicUserSchema),
});

export const revokedResponseSchema = z.object({
  revoked: z.number().int().meta({ description: "How many sessions were revoked" }),
});

/** Shape returned by the central error handler for every failure. */
export const errorResponseSchema = z.object({
  error: z.string().meta({ example: "Unauthorized" }),
  message: z.string().meta({ example: "Invalid email or password" }),
  details: z
    .array(z.object({ field: z.string(), message: z.string() }))
    .optional()
    .meta({ description: "Present only on 400 validation failures" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
