import "dotenv/config";

/**
 * Fail fast on missing configuration. A server that boots with an empty
 * JWT secret is worse than one that refuses to boot at all.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? "development";

export const config = {
  port: Number(process.env.PORT ?? 3100),
  host: process.env.HOST ?? "0.0.0.0",
  nodeEnv,
  isProduction: nodeEnv === "production",
  databaseUrl: required("DATABASE_URL"),

  jwt: {
    secret: required("JWT_SECRET"),
    /** Short-lived by design: it cannot be revoked, so it must expire quickly. */
    accessTtl: process.env.JWT_ACCESS_TTL ?? "15m",
    refreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS ?? 30),
    issuer: process.env.JWT_ISSUER ?? "aiaz-api",
  },

  cookie: {
    secret: required("COOKIE_SECRET"),
    /** The refresh cookie is only ever sent to the refresh/logout routes. */
    path: "/api/auth",
    name: "refresh_token",
  },
} as const;
