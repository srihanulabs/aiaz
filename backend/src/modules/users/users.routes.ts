import { z } from "zod";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { toPublicUser, AuthError, findUserById } from "../auth/auth.service";
import {
  errorResponseSchema,
  listUsersQuerySchema,
  updateRoleSchema,
  userIdParamSchema,
  userResponseSchema,
  usersListResponseSchema,
} from "../auth/auth.schema";
import { revokeAllUserTokens } from "../auth/token.service";

/**
 * Demonstrates the three access tiers. Every route pairs `authenticate`
 * with `authorize`, in that order — `authorize` reads `request.user`, which
 * only exists once `authenticate` has verified the token.
 */
export default async function userRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  /** Any signed-in user may read their own full profile. */
  app.get(
    "/me",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["users"],
        summary: "My full profile",
        description:
          "Reads the stored record from the database. Contrast with " +
          "`GET /api/auth/me`, which only echoes the token payload.",
        security: [{ bearerAuth: [] }],
        response: {
          200: userResponseSchema,
          401: errorResponseSchema.describe("Missing token, or the account was deleted"),
        },
      },
    },
    async (request, reply) => {
      const user = await findUserById(request.user.sub);

      // The token was valid but the account is gone (deleted mid-session).
      if (!user) {
        return reply
          .code(401)
          .send({ error: "Unauthorized", message: "Account no longer exists" });
      }

      return { user: toPublicUser(user) };
    },
  );

  /** Moderators and admins can list users. */
  app.get(
    "/",
    {
      preHandler: [fastify.authenticate, fastify.authorize("MODERATOR", "ADMIN")],
      schema: {
        tags: ["users"],
        summary: "List users",
        description:
          "Requires **MODERATOR** or **ADMIN**.\n\n" +
          "A plain USER gets 403 here — same URL, same valid token, different role.",
        security: [{ bearerAuth: [] }],
        querystring: listUsersQuerySchema,
        response: {
          200: usersListResponseSchema,
          401: errorResponseSchema.describe("Missing or invalid access token"),
          403: errorResponseSchema.describe("Role is not MODERATOR or ADMIN"),
        },
      },
    },
    async (request) => {
      const { take, skip } = request.query;

      const users = await prisma.user.findMany({
        take,
        skip,
        orderBy: { createdAt: "desc" },
      });

      return { users: users.map(toPublicUser) };
    },
  );

  /**
   * Only admins can change roles — the privilege-escalation chokepoint.
   */
  app.patch(
    "/:id/role",
    {
      preHandler: [fastify.authenticate, fastify.authorize("ADMIN")],
      schema: {
        tags: ["users"],
        summary: "Change a user's role",
        description:
          "Requires **ADMIN**. This is the only path to a role change — " +
          "registration always produces a USER.\n\n" +
          "Side effect: the target's sessions are revoked, because their existing " +
          "access tokens still carry the old role until they expire. That matters " +
          "most for demotions.\n\n" +
          "An admin cannot remove their own ADMIN role, which would risk locking " +
          "everyone out of role management.",
        security: [{ bearerAuth: [] }],
        params: userIdParamSchema,
        body: updateRoleSchema,
        response: {
          200: userResponseSchema,
          400: errorResponseSchema.describe("Invalid input, or self-demotion attempt"),
          401: errorResponseSchema.describe("Missing or invalid access token"),
          403: errorResponseSchema.describe("Role is not ADMIN"),
          404: errorResponseSchema.describe("User not found"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { role } = request.body;

      // Guards against the last admin demoting themselves and locking
      // everyone out of role management.
      if (id === request.user.sub && role !== "ADMIN") {
        throw new AuthError(
          400,
          "Bad Request",
          "You cannot remove your own admin role",
        );
      }

      const target = await findUserById(id);
      if (!target) {
        throw new AuthError(404, "Not Found", "User not found");
      }

      const updated = await prisma.user.update({ where: { id }, data: { role } });

      // Existing access tokens still carry the OLD role until they expire.
      // Dropping their sessions forces a re-login on the new role, which
      // matters most when the change is a demotion.
      await revokeAllUserTokens(id);

      request.log.info(
        { actorId: request.user.sub, targetId: id, role },
        "user role changed",
      );
      return reply.send({ user: toPublicUser(updated) });
    },
  );

  /** Admin-only deletion. Refresh tokens cascade via the FK. */
  app.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate, fastify.authorize("ADMIN")],
      schema: {
        tags: ["users"],
        summary: "Delete a user",
        description:
          "Requires **ADMIN**. The user's refresh tokens are removed too, via the " +
          "foreign key's ON DELETE CASCADE. Admins cannot delete themselves.",
        security: [{ bearerAuth: [] }],
        params: userIdParamSchema,
        response: {
          204: z.void(),
          400: errorResponseSchema.describe("Self-deletion attempt"),
          401: errorResponseSchema.describe("Missing or invalid access token"),
          403: errorResponseSchema.describe("Role is not ADMIN"),
          404: errorResponseSchema.describe("User not found"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      if (id === request.user.sub) {
        throw new AuthError(400, "Bad Request", "You cannot delete your own account");
      }

      const target = await findUserById(id);
      if (!target) {
        throw new AuthError(404, "Not Found", "User not found");
      }

      await prisma.user.delete({ where: { id } });

      request.log.info({ actorId: request.user.sub, targetId: id }, "user deleted");
      return reply.code(204).send();
    },
  );
}
