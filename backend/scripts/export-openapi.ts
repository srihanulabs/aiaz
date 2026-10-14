import { writeFileSync } from "node:fs";
import { buildApp } from "../src/app";

/**
 * Writes the OpenAPI document to openapi.json without running a server.
 *
 * Useful for committing the spec, diffing it in review to catch unintended
 * API changes, or feeding a client-code generator.
 */
async function main() {
  const app = await buildApp();
  await app.ready();

  const spec = app.swagger();
  writeFileSync("openapi.json", JSON.stringify(spec, null, 2) + "\n");

  const count = Object.values(spec.paths ?? {}).reduce(
    (n, ops) => n + Object.keys(ops as object).length,
    0,
  );
  console.log(`Wrote openapi.json (${count} operations)`);

  await app.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
