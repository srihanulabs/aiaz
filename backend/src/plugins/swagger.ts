import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { config } from "../config/env";

/**
 * OpenAPI 3.1 spec + Swagger UI at /docs.
 *
 * `jsonSchemaTransform` converts the Zod schemas attached to each route into
 * JSON Schema for the spec. That is the point of routing validation through
 * the Zod type provider: one schema per route drives request validation,
 * response serialization, TypeScript inference, AND these docs — so the
 * documentation cannot drift from what the server actually enforces.
 */
export default fp(async (app) => {
  await app.register(swagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "AIAZ Auth API",
        description: [
          "JWT authentication with rotating refresh tokens and role-based authorization.",
          "",
          "## How to authenticate here",
          "",
          "1. `POST /api/auth/register` or `POST /api/auth/login`.",
          "2. Copy `accessToken` from the response.",
          "3. Click **Authorize** (top right) and paste it — no `Bearer ` prefix, Swagger adds that.",
          "4. Locked routes now work.",
          "",
          "## About the refresh token",
          "",
          "The refresh token is **not** in the response body. It is an httpOnly cookie,",
          "unreadable by JavaScript by design, scoped to `/api/auth`. Your browser stores",
          "it and sends it back automatically, which is why `POST /api/auth/refresh`",
          "takes no parameters — the cookie is the credential.",
          "",
          "Refresh **rotates**: each call revokes the old token and issues a new one.",
          "Presenting an already-used token is treated as theft and revokes every",
          "session for that user.",
          "",
          "## Rate limits",
          "",
          "Login is capped at 5 per 15 minutes and register at 10 per hour. Repeated",
          "experimenting will return `429`; limits are in-memory, so restarting the",
          "server clears them.",
        ].join("\n"),
        version: "1.0.0",
      },
      servers: [
        { url: `http://localhost:${config.port}`, description: "Local development" },
      ],
      tags: [
        { name: "auth", description: "Registration, login, refresh, logout" },
        { name: "users", description: "Role-protected user administration" },
        { name: "system", description: "Health and diagnostics" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description:
              "Short-lived access token from register/login. Expires in 15 minutes.",
          },
          refreshCookie: {
            type: "apiKey",
            in: "cookie",
            name: config.cookie.name,
            description:
              "httpOnly cookie set at login. The browser sends it automatically; " +
              "you cannot set it by hand from Swagger UI.",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      // Keep the endpoint list collapsed-but-visible rather than expanding
      // every schema on load.
      docExpansion: "list",
      persistAuthorization: true,
      tryItOutEnabled: true,
    },
  });
});
