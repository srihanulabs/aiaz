import Fastify, { type FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { config } from "./config/env";
import authPlugin from "./plugins/auth";
import errorHandler from "./plugins/error-handler";
import swaggerPlugin from "./plugins/swagger";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      transport:
        config.nodeEnv === "development" ? { target: "pino-pretty" } : undefined,
      // Credentials must never reach the log, not even at debug level.
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        "req.body.password",
      ],
    },
  }).withTypeProvider<ZodTypeProvider>();

  // Teach Fastify to validate requests and serialize responses with Zod.
  // One schema per route then drives validation, serialization, TypeScript
  // inference and the OpenAPI docs — they cannot drift apart.
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(errorHandler);

  // Swagger must be registered before the routes it documents, so the spec
  // sees their schemas as they are added.
  await app.register(swaggerPlugin);

  // Global backstop. Individual auth routes tighten this further via
  // their own `config.rateLimit`.
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  await app.register(authPlugin);

  app.get(
    "/health",
    {
      schema: {
        tags: ["system"],
        summary: "Liveness check",
        response: { 200: z.object({ status: z.literal("ok") }) },
      },
    },
    async () => ({ status: "ok" as const }),
  );

  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(userRoutes, { prefix: "/api/users" });

  return app;
}
