import fp from "fastify-plugin";
import { ZodError } from "zod";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";
import { AuthError } from "../modules/auth/auth.service";
import { config } from "../config/env";

/** Narrows the `unknown` error to something carrying an HTTP status. */
function httpStatusOf(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    const status = (error as { statusCode?: unknown }).statusCode;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

/**
 * One place that turns thrown errors into responses, so route handlers can
 * throw and stay readable instead of threading error branches everywhere.
 */
export default fp(async (app) => {
  app.setErrorHandler((error: unknown, request, reply) => {
    // Expected, user-facing failures: message is safe to show.
    if (error instanceof AuthError) {
      return reply
        .code(error.statusCode)
        .send({ error: error.error, message: error.message });
    }

    // Request failed the route's Zod schema. Fastify rejects it before the
    // handler runs, so this is the normal validation path now.
    //
    // `instancePath` is a JSON pointer like "/email"; strip the leading slash
    // and turn nested pointers into dotted paths for a friendlier field name.
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({
        error: "Bad Request",
        message: "Validation failed",
        details: error.validation.map((issue) => ({
          field: issue.instancePath.replace(/^\//, "").replace(/\//g, ".") || "(root)",
          message: issue.message ?? "Invalid value",
        })),
      });
    }

    // We tried to send a response that does not match its own schema. That is
    // a server bug, not a client one — surface it loudly in development.
    if (isResponseSerializationError(error)) {
      request.log.error(
        { err: error, route: error.method + " " + error.url },
        "response did not match its schema",
      );
      return reply.code(500).send({
        error: "Internal Server Error",
        message: config.isProduction
          ? "Something went wrong"
          : "Response failed its own schema — see server logs",
      });
    }

    // A ZodError thrown by hand inside a service (not by route validation).
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: "Bad Request",
        message: "Validation failed",
        details: error.issues.map((issue) => ({
          field: issue.path.join(".") || "(root)",
          message: issue.message,
        })),
      });
    }

    const statusCode = httpStatusOf(error);

    if (statusCode === 429) {
      return reply.code(429).send({
        error: "Too Many Requests",
        message: "Rate limit exceeded, please try again later",
      });
    }

    // Fastify's own 4xx (bad JSON body, unsupported media type, ...).
    if (statusCode && statusCode >= 400 && statusCode < 500) {
      return reply.code(statusCode).send({
        error: error instanceof Error ? error.name : "Bad Request",
        message:
          error instanceof Error ? error.message : "Request could not be processed",
      });
    }

    // Anything unrecognized is a bug. Log it in full, but return a generic
    // body — stack traces and driver messages leak schema and file paths.
    request.log.error({ err: error }, "unhandled error");
    return reply.code(500).send({
      error: "Internal Server Error",
      message:
        config.isProduction || !(error instanceof Error)
          ? "Something went wrong"
          : error.message,
    });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      error: "Not Found",
      message: `Route ${request.method} ${request.url} not found`,
    });
  });
});
