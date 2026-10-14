import type { AccessTokenPayload, AuthenticatedUser } from "../modules/auth/auth.types";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Role } from "@prisma/client";

/**
 * `@fastify/jwt` reads these two interfaces to type `request.user` and the
 * argument to `jwt.sign()`, so signing and verifying stay in sync.
 */
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: AccessTokenPayload;
    user: AuthenticatedUser;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    /** preHandler: rejects the request unless a valid access token is present. */
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    /** preHandler factory: rejects the request unless the user holds one of `roles`. */
    authorize: (
      ...roles: Role[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
