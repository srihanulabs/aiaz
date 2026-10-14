import argon2 from "argon2";

/**
 * Argon2id — the variant recommended by OWASP, resistant to both GPU
 * cracking and side-channel attacks. These parameters follow the OWASP
 * Password Storage Cheat Sheet minimum (19 MiB memory, 2 iterations).
 *
 * The salt is generated per-hash by argon2 and stored inside the returned
 * digest string, so there is no separate salt column.
 */
const HASH_OPTIONS: argon2.HashOptions = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, HASH_OPTIONS);
}

export async function verifyPassword(
  hash: string,
  plain: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    // A malformed or truncated hash in the database should read as
    // "wrong password", never as a 500 that reveals account internals.
    return false;
  }
}

/**
 * Burns roughly the same CPU time as a real verification.
 *
 * Login calls this when the email does not exist, so that "unknown email"
 * and "wrong password" take the same time. Without it, response latency
 * leaks which addresses are registered.
 */
export async function fakeVerify(): Promise<void> {
  await argon2.hash("timing-equalizer", HASH_OPTIONS);
}
