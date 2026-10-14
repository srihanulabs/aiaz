import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Role } from "@prisma/client";
import { config } from "../config/env";

/**
 * Registers JWT + cookie support and the two auth preHandlers.
 *
 * Wrapped in `fastify-plugin` so the decorators land on the root instance
 * instead of being scoped to this plugin's own encapsulation context —
 * without `fp`, routes registered elsewhere would not see `app.authenticate`.
 */
export default fp(async (app) => {
  await app.register(cookie, { secret: config.cookie.secret });

  await app.register(jwt, {
    secret: config.jwt.secret,
    sign: { iss: config.jwt.issuer },
    verify: { allowedIss: config.jwt.issuer },
  });

  /**
   * Verifies the `Authorization: Bearer <token>` header and populates
   * `request.user`. Any failure — missing, malformed, expired, bad
   * signature — is reported as a flat 401 so we leak nothing about why.
   */
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          error: "Unauthorized",
          message: "Missing or invalid access token",
        });
      }
    },
  );

  /**
   * Role gate. Runs *after* `authenticate` in the preHandler array, so
   * `request.user` is already populated by the time it executes.
   *
   *   preHandler: [app.authenticate, app.authorize("ADMIN", "MODERATOR")]
   *
   * 403 rather than 401: the caller proved who they are, they simply are
   * not allowed. Re-authenticating would not help them.
   */
  app.decorate("authorize", (...roles: Role[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user;

      if (!user) {
        return reply.code(401).send({
          error: "Unauthorized",
          message: "Missing or invalid access token",
        });
      }

      if (!roles.includes(user.role)) {
        return reply.code(403).send({
          error: "Forbidden",
          message: "Insufficient permissions for this resource",
        });
      }
    };
  });
});
