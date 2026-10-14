import { buildApp } from "./app";
import { config } from "./config/env";
import { prisma } from "./lib/prisma";

async function start() {
  const app = await buildApp();

  // Finish in-flight requests and close the DB pool before exiting, so a
  // deploy does not sever live connections mid-transaction.
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, async () => {
      app.log.info(`${signal} received, shutting down`);
      await app.close();
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  try {
    await app.listen({ port: config.port, host: config.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
