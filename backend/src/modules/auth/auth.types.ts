import type { Role } from "@prisma/client";

/**
 * The payload we sign into every access token.
 *
 * Keep this small: it travels on every request and is base64 — not encrypted —
 * so it is readable by anyone holding the token. Never put secrets here.
 * The role is embedded so authorization checks need no database round-trip;
 * the trade-off is that a role change only takes effect once the current
 * access token expires (hence the short TTL).
 */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
}

/** What `request.user` is after `authenticate` has run. */
export interface AuthenticatedUser extends AccessTokenPayload {
  iat: number;
  exp: number;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
}
