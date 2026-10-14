# Auth Module

JWT access tokens + rotating refresh tokens + role-based authorization.

## File map

| File | Role |
|---|---|
| `src/config/env.ts` | Env loading; throws at boot on missing secrets |
| `src/plugins/auth.ts` | Registers `@fastify/jwt` + `@fastify/cookie`; decorates `authenticate` / `authorize` |
| `src/plugins/error-handler.ts` | Central error → HTTP response mapping |
| `src/modules/auth/password.service.ts` | argon2id hashing + timing-safe dummy verify |
| `src/modules/auth/token.service.ts` | Access token signing, refresh rotation, reuse detection |
| `src/modules/auth/auth.service.ts` | Register / login business logic |
| `src/modules/auth/auth.routes.ts` | `/api/auth/*` |
| `src/modules/users/users.routes.ts` | `/api/users/*`, demonstrates RBAC |
| `src/types/fastify.d.ts` | Types `request.user` and the decorators |

## Endpoints

| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/register` | public (10/hr) |
| POST | `/api/auth/login` | public (5/15min) |
| POST | `/api/auth/refresh` | refresh cookie |
| POST | `/api/auth/logout` | refresh cookie |
| POST | `/api/auth/logout-all` | access token |
| GET | `/api/auth/me` | access token |
| GET | `/api/users/me` | any role |
| GET | `/api/users` | MODERATOR, ADMIN |
| PATCH | `/api/users/:id/role` | ADMIN |
| DELETE | `/api/users/:id` | ADMIN |

## The two-token design

**Access token** — a JWT, 15 min, sent as `Authorization: Bearer <token>`, held in
client memory. Self-validating: verifying it is a signature check, no DB hit. That
speed is exactly why it cannot be revoked, hence the short life.

**Refresh token** — 48 random bytes, 30 days, in an httpOnly cookie. Opaque, not a
JWT: it means nothing without its DB row, which is what makes revocation possible.

Splitting them means the fast path (every API call) never touches the database,
while the long-lived credential stays revocable and out of reach of JavaScript.

## Rotation and reuse detection

Every refresh revokes the presented token and issues a new one. Tokens are
single-use, so if an already-revoked token is presented again, two parties hold
the same token — the real user and a thief. We cannot tell which is calling, so
**every session for that user is revoked** and both must log in again.

```
login ─→ RT1
RT1 ─→ refresh ─→ RT2   (RT1 revoked)
RT1 ─→ refresh ─→ 401 + all sessions killed   ← theft detected
```

The rotation runs inside a transaction so two concurrent refreshes cannot both win.

## Authorization

`authenticate` verifies the token and fills `request.user`. `authorize(...roles)`
checks the role. Order matters — `authorize` reads what `authenticate` writes:

```ts
app.get("/", {
  preHandler: [app.authenticate, app.authorize("MODERATOR", "ADMIN")],
}, handler);
```

401 = "I don't know who you are." 403 = "I know who you are, and no."

The role is carried *in the token*, so checks need no DB round-trip. The trade-off:
a role change only lands when the token expires — which is why `PATCH /:id/role`
revokes the target's sessions to force it immediately.

## Security decisions

- **argon2id**, OWASP params (19 MiB, 2 iterations); salt is inside the digest.
- **Refresh tokens stored as SHA-256.** Plain hash, not argon2, is correct here:
  48 bytes of CSPRNG output has no low-entropy guess to brute-force.
- **No user enumeration.** Unknown email and wrong password return byte-identical
  401s, and the unknown-email path runs a dummy hash so timing matches too.
- **Role never read from the request body** on register — that would be self-service
  privilege escalation.
- **Duplicate email caught via the unique index**, not a pre-check: SELECT-then-INSERT
  has a race window.
- **Cookie**: `httpOnly` (XSS can't read it), `sameSite=strict` (CSRF defense for a
  cookie-authed endpoint), `secure` in production, `path=/api/auth` (not sent to
  ordinary routes), signed (tamper-evident).
- **Rate limits** on login/register — the real defense against credential stuffing.
- **Logs redact** `authorization`, `cookie`, and `password`.
- **Self-lockout guards**: an admin cannot demote or delete themselves.

## Setup

```bash
npm install
npx prisma migrate deploy
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-password' npm run db:seed
npm run dev
```

The seed exists because role promotion is admin-only — without it there is no way
to create the first admin through the API.

## Try it

```bash
curl -X POST localhost:3100/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"a@b.com","password":"a-long-enough-password"}' -c jar.txt

curl localhost:3100/api/auth/me -H "Authorization: Bearer <accessToken>"

curl -X POST localhost:3100/api/auth/refresh -b jar.txt -c jar.txt
```

## Known gaps

Not built, since you didn't ask for them — but worth knowing they're missing:
email verification, password reset, account lockout after repeated failures,
a cleanup job for expired `refresh_tokens` rows, and CORS config for a browser client.

## Testing with Postman

Import `postman/aiaz-auth.postman_collection.json`. It contains 20 requests with
40 assertions covering the full flow plus the security properties.

```bash
npm run dev          # server on :3100
```

Then in Postman: **Import** → select the file → open the collection → **Run**.

Access tokens are captured automatically into `{{accessToken}}` by each request's
test script, so you never copy a JWT by hand. Requests are numbered; run them in
order, because later ones depend on state from earlier ones.

### Leave the cookie jar ON

The refresh token is an **httpOnly** cookie — it will never appear in a response
body, and no test script can read it. That is the whole point of httpOnly. Postman
stores and replays it for you, which is why `POST /api/auth/refresh` needs no
Authorization header: the cookie *is* the credential.

If refresh returns 401, check Settings → General → cookies are enabled.

### The 429 you will probably hit

Rate limits are deliberately tight: **login 5 per 15 min, register 10 per hour**.
Run the collection three or four times in a row and you will start seeing
`429 Too Many Requests`. That is the limiter working, not a broken test.

Limits are held **in memory**, so the fix is to restart the dev server:

```bash
# find and kill the listener, then npm run dev again
netstat -ano | findstr :3100
taskkill /F /PID <pid>
```

Note that `Ctrl+C` in a `tsx watch` terminal does not always kill the child
process — check the port is actually free before restarting, or the old process
keeps serving with its counters intact. The `x-ratelimit-remaining` and
`retry-after` response headers tell you where you stand.

### Admin requests

Requests 15–18 use the seeded admin (`admin@aiaz.local`). If you changed or
skipped the seed, update the `adminEmail` / `adminPassword` collection variables.

### CLI runner

The same file runs headless via Newman, which is what CI would use:

```bash
npx newman run postman/aiaz-auth.postman_collection.json
```

## API docs (Swagger / OpenAPI)

Start the server and open **http://localhost:3100/docs**. The raw spec is at
`/docs/json`.

### Using the UI

1. Run `POST /api/auth/register` or `/login` via **Try it out**.
2. Copy `accessToken` from the response.
3. Click **Authorize** (top right), paste the token — no `Bearer ` prefix, the UI
   adds it — and the locked routes become usable.

`persistAuthorization` is on, so the token survives a page reload.

Refresh and logout are marked with the cookie scheme rather than the bearer one.
You cannot paste a value for those: the cookie is httpOnly, so the browser sends
it automatically and script cannot touch it. That is the point of httpOnly, and
it is why `POST /api/auth/refresh` takes no parameters.

### One schema, four jobs

Routes use `fastify-type-provider-zod`, so the Zod schema on each route drives:

1. **Request validation** — Fastify rejects bad input before the handler runs.
2. **Response serialization** — output is built from the schema.
3. **TypeScript inference** — `request.body` is typed with no cast.
4. **The OpenAPI spec** — these docs.

That is why handlers no longer call `registerSchema.parse(request.body)`; the
framework has already validated by then. The payoff is that the docs cannot drift
from what the server actually enforces, because they are generated from it.

Response serialization is also a real security control, not just tidiness. A
handler that returned `passwordHash` would still not leak it — anything absent
from the response schema is stripped on the way out. Verified: a handler
deliberately returning `passwordHash` and `ssn` emitted neither.

### Exporting the spec

```bash
npm run docs:export     # writes openapi.json (11 operations)
```

Useful for generating a typed client, or for diffing in review to catch
unintended API changes. It is gitignored by default since it is generated —
commit it if you want those diffs in review.
