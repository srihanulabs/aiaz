import { z } from "zod";
import type { FastifyReply } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { config } from "../../config/env";
import {
  errorResponseSchema,
  loginSchema,
  meResponseSchema,
  registerSchema,
  revokedResponseSchema,
  sessionResponseSchema,
  tokenResponseSchema,
} from "./auth.schema";
import { authenticateUser, registerUser, toPublicUser } from "./auth.service";
import {
  issueRefreshToken,
  revokeAllUserTokens,
  revokeRefreshToken,
  rotateRefreshToken,
  refreshTokenExpiry,
  signAccessToken,
} from "./token.service";
import type { User } from "@prisma/client";

/**
 * The refresh token lives in an httpOnly cookie; the access token is
 * returned in the body for the client to hold in memory.
 *
 * Why split them: a token readable by JavaScript is stealable by any XSS on
 * the page. httpOnly puts the long-lived credential out of reach of script,
 * and `path` scopes it so it is not attached to ordinary API calls.
 * `sameSite: strict` is what defends the refresh route against CSRF, since
 * a cookie-authenticated endpoint is otherwise triggerable cross-site.
 */
function setRefreshCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(config.cookie.name, token, {
    httpOnly: true,
    secure: config.isProduction, // plain HTTP in dev would drop the cookie
    sameSite: "strict",
    path: config.cookie.path,
    expires: refreshTokenExpiry(),
    signed: true,
  });
}

function clearRefreshCookie(reply: FastifyReply): void {
  reply.clearCookie(config.cookie.name, { path: config.cookie.path });
}

/** Reads and unsigns the refresh cookie; null if absent or tampered with. */
function readRefreshCookie(
  app: FastifyInstance,
  raw: string | undefined,
): string | null {
  if (!raw) return null;
  const result = app.unsignCookie(raw);
  return result.valid && result.value ? result.value : null;
}

async function issueSession(
  app: FastifyInstance,
  reply: FastifyReply,
  user: User,
) {
  const refreshToken = await issueRefreshToken(user.id);
  setRefreshCookie(reply, refreshToken);

  return {
    user: toPublicUser(user),
    accessToken: signAccessToken(app, user),
    tokenType: "Bearer" as const,
    expiresIn: config.jwt.accessTtl,
  };
}

export default async function authRoutes(fastify: FastifyInstance) {
  // The type provider makes `request.body` inferred from the Zod schema and
  // lets Fastify validate before the handler runs — no manual .parse() needed.
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  /**
   * POST /api/auth/register — create an account and start a session.
   *
   * Rate limited because registration is both a spam target and, through
   * the 409 on duplicate email, a way to probe which addresses exist.
   */
  app.post(
    "/register",
    {
      config: { rateLimit: { max: 10, timeWindow: "1 hour" } },
      schema: {
        tags: ["auth"],
        summary: "Register a new account",
        description:
          "Creates a USER-role account and immediately starts a session.\n\n" +
          "A `role` field in the body is ignored — self-assigning ADMIN would be " +
          "privilege escalation. Promotion happens only via `PATCH /api/users/{id}/role`.\n\n" +
          "Sets the httpOnly refresh cookie. Rate limited to 10 per hour.",
        body: registerSchema,
        response: {
          201: sessionResponseSchema,
          400: errorResponseSchema.describe("Validation failed"),
          409: errorResponseSchema.describe("Email already registered"),
          429: errorResponseSchema.describe("Rate limit exceeded"),
        },
      },
    },
    async (request, reply) => {
      const user = await registerUser(request.body);

      request.log.info({ userId: user.id }, "user registered");
      return reply.code(201).send(await issueSession(app, reply, user));
    },
  );

  /**
   * POST /api/auth/login — exchange credentials for a session.
   *
   * The tight rate limit here is the real defense against credential
   * stuffing; argon2 alone only slows an attacker down, it does not stop them.
   */
  app.post(
    "/login",
    {
      config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
      schema: {
        tags: ["auth"],
        summary: "Log in",
        description:
          "Returns an access token and sets the httpOnly refresh cookie.\n\n" +
          "A wrong password and an unregistered email return byte-identical 401s, " +
          "and the unknown-email path burns equivalent CPU, so neither the body nor " +
          "the timing reveals whether an account exists.\n\n" +
          "Rate limited to 5 attempts per 15 minutes.",
        body: loginSchema,
        response: {
          200: sessionResponseSchema,
          400: errorResponseSchema.describe("Validation failed"),
          401: errorResponseSchema.describe("Invalid email or password"),
          429: errorResponseSchema.describe("Rate limit exceeded"),
        },
      },
    },
    async (request, reply) => {
      const user = await authenticateUser(request.body);

      request.log.info({ userId: user.id }, "user logged in");
      return reply.send(await issueSession(app, reply, user));
    },
  );

  /**
   * POST /api/auth/refresh — trade the refresh cookie for a new access token.
   *
   * Deliberately does NOT require an access token: the whole point is to be
   * callable once the access token has expired. The cookie is the credential.
   */
  app.post(
    "/refresh",
    {
      schema: {
        tags: ["auth"],
        summary: "Rotate the refresh token",
        description:
          "Takes no parameters — the httpOnly cookie is the credential, and your " +
          "browser attaches it automatically. Requires no access token, since the " +
          "point is to work after that token has expired.\n\n" +
          "Each call revokes the presented token and issues a new one. Replaying an " +
          "already-used token means two parties hold it, so every session for that " +
          "user is revoked.",
        security: [{ refreshCookie: [] }],
        response: {
          200: tokenResponseSchema,
          401: errorResponseSchema.describe("Missing, expired, or already-used token"),
        },
      },
    },
    async (request, reply) => {
      const presented = readRefreshCookie(app, request.cookies[config.cookie.name]);

      if (!presented) {
        return reply
          .code(401)
          .send({ error: "Unauthorized", message: "Missing refresh token" });
      }

      const result = await rotateRefreshToken(presented);

      if (result.status === "reused") {
        // Every session for this user has just been revoked. Say only that
        // re-login is required — naming the reason tells an attacker holding
        // the stolen token that they have been spotted.
        clearRefreshCookie(reply);
        request.log.warn("refresh token reuse detected; all sessions revoked");
        return reply.code(401).send({
          error: "Unauthorized",
          message: "Session expired, please log in again",
        });
      }

      if (result.status === "invalid") {
        clearRefreshCookie(reply);
        return reply.code(401).send({
          error: "Unauthorized",
          message: "Invalid or expired refresh token",
        });
      }

      setRefreshCookie(reply, result.token);
      return reply.send({
        accessToken: signAccessToken(app, result.user),
        tokenType: "Bearer" as const,
        expiresIn: config.jwt.accessTtl,
      });
    },
  );

  /**
   * POST /api/auth/logout — revoke this one session.
   *
   * Returns 204 whether or not a valid cookie was present: logging out is
   * idempotent, and there is nothing useful to report about a bad token.
   */
  app.post(
    "/logout",
    {
      schema: {
        tags: ["auth"],
        summary: "Log out of this session",
        description:
          "Revokes the presented refresh token and clears the cookie. Idempotent: " +
          "returns 204 whether or not a valid cookie was sent.",
        security: [{ refreshCookie: [] }],
        response: { 204: z.void() },
      },
    },
    async (request, reply) => {
      const presented = readRefreshCookie(app, request.cookies[config.cookie.name]);
      if (presented) await revokeRefreshToken(presented);

      clearRefreshCookie(reply);
      return reply.code(204).send();
    },
  );

  /**
   * POST /api/auth/logout-all — revoke every session for the caller.
   *
   * Requires an access token, not just the cookie: this is the "someone
   * stole my laptop" button and should act on a proven identity.
   */
  app.post(
    "/logout-all",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["auth"],
        summary: "Log out of every session",
        description:
          "Revokes all refresh tokens for the caller across every device.\n\n" +
          "Requires an access token rather than just the cookie: this is the " +
          "'someone stole my laptop' button, so it should act on a proven identity.",
        security: [{ bearerAuth: [] }],
        response: {
          200: revokedResponseSchema,
          401: errorResponseSchema.describe("Missing or invalid access token"),
        },
      },
    },
    async (request, reply) => {
      const revoked = await revokeAllUserTokens(request.user.sub);

      clearRefreshCookie(reply);
      request.log.info({ userId: request.user.sub, revoked }, "all sessions revoked");
      return reply.send({ revoked });
    },
  );

  /** GET /api/auth/me — the current user, straight from the token. */
  app.get(
    "/me",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["auth"],
        summary: "Who am I (from the token)",
        description:
          "Returns the identity carried in the access token itself — no database " +
          "read. For the full stored profile use `GET /api/users/me`.",
        security: [{ bearerAuth: [] }],
        response: {
          200: meResponseSchema,
          401: errorResponseSchema.describe("Missing or invalid access token"),
        },
      },
    },
    async (request) => ({
      user: {
        id: request.user.sub,
        email: request.user.email,
        role: request.user.role,
      },
    }),
  );
}
