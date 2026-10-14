import { Prisma, type User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { hashPassword, verifyPassword, fakeVerify } from "./password.service";
import type { PublicUser } from "./auth.types";
import type { LoginInput, RegisterInput } from "./auth.schema";

/** Thrown for expected, user-facing failures; the error handler maps it to a response. */
export class AuthError extends Error {
  constructor(
    readonly statusCode: number,
    readonly error: string,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/** Strips `passwordHash` so it can never be serialized into a response by accident. */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: RegisterInput): Promise<User> {
  const passwordHash = await hashPassword(input.password);

  try {
    return await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name ?? null,
        // Role is never taken from the request body — self-registering as
        // an ADMIN would be a privilege-escalation hole. Promotion is an
        // admin-only action on a separate route.
      },
    });
  } catch (err) {
    // Rely on the unique index rather than a pre-check: a SELECT-then-INSERT
    // has a race window where two concurrent signups both see "available".
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new AuthError(409, "Conflict", "An account with that email already exists");
    }
    throw err;
  }
}

export async function authenticateUser(input: LoginInput): Promise<User> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    // Spend the same time we would on a real verify, then fail identically.
    await fakeVerify();
    throw new AuthError(401, "Unauthorized", "Invalid email or password");
  }

  if (!(await verifyPassword(user.passwordHash, input.password))) {
    // Same message and status as the unknown-email branch: telling the
    // caller *which* half was wrong hands them a user-enumeration oracle.
    throw new AuthError(401, "Unauthorized", "Invalid email or password");
  }

  return user;
}

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}
