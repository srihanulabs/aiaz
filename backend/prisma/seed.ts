import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/modules/auth/password.service";

/**
 * Bootstraps the first ADMIN.
 *
 * Role promotion is admin-only, so without this there is no way to create
 * the first one through the API — a chicken-and-egg lockout.
 *
 * Run with: npm run db:seed
 */
async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "Set ADMIN_PASSWORD before seeding, e.g. ADMIN_PASSWORD='...' npm run db:seed",
    );
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      passwordHash: await hashPassword(password),
      name: "Administrator",
      role: "ADMIN",
    },
  });

  console.log(`Seeded admin: ${user.email} (${user.id})`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
