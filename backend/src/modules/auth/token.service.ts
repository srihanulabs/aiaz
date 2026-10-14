import { createHash, randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { config } from "../../config/env";
import type { AccessTokenPayload } from "./auth.types";

/**
 * Refresh tokens are opaque random strings, not JWTs.
 *
 * A JWT refresh token would be self-validating and therefore impossible to
 * revoke before it expires. An opaque token is meaningless without the
 * database row backing it, which is what makes logout and reuse detection
 * actually work.
 */
function generateRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

/**
 * We store SHA-256 of the token, never the token itself — the database is
 * treated as untrusted, exactly like a password column.
 *
 * Unlike a password this is a plain fast hash rather than argon2, and that
 * is deliberate: the token is 48 bytes of CSPRNG output, so there is no
 * low-entropy guess for an attacker to brute-force, and refresh runs on
 * every session renewal where argon2's cost would be wasted.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function refreshTokenExpiry(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + config.jwt.refreshTtlDays);
  return expires;
}

export function signAccessToken(app: FastifyInstance, user: User): string {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return app.jwt.sign(payload, { expiresIn: config.jwt.accessTtl });
}

/** Issues a refresh token and persists only its hash. */
export async function issueRefreshToken(userId: string): Promise<string> {
  const token = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: refreshTokenExpiry(),
    },
  });

  return token;
}

export type RefreshResult =
  | { status: "ok"; user: User; token: string }
  | { status: "invalid" }
  | { status: "reused" };

/**
 * Rotating refresh: the presented token is revoked and a fresh one issued.
 *
 * Rotation lets us detect theft. Each token is single-use, so if a token
 * that was *already* revoked comes back, two parties hold the same token —
 * the legitimate user and an attacker. We cannot tell which one is calling,
 * so we revoke the user's entire token family and force a re-login.
 *
 * The whole read-check-write runs in a transaction so two concurrent
 * refreshes with the same token cannot both succeed.
 */
export async function rotateRefreshToken(
  presented: string,
): Promise<RefreshResult> {
  const tokenHash = hashToken(presented);

  return prisma.$transaction(async (tx) => {
    const stored = await tx.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored) return { status: "invalid" };

    if (stored.revokedAt) {
      // Replay of a spent token: assume compromise, drop every session.
      await tx.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      return { status: "reused" };
    }

    if (stored.expiresAt <= new Date()) return { status: "invalid" };

    await tx.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const token = generateRefreshToken();
    await tx.refreshToken.create({
      data: {
        tokenHash: hashToken(token),
        userId: stored.userId,
        expiresAt: refreshTokenExpiry(),
      },
    });

    return { status: "ok", user: stored.user, token };
  });
}

/** Logout: revokes just the session the caller presented. */
export async function revokeRefreshToken(presented: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(presented), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/** Logout-everywhere: revokes every live session for the user. */
export async function revokeAllUserTokens(userId: string): Promise<number> {
  const { count } = await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return count;
}
