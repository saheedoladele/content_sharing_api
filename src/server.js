import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function main() {
  await connectDatabase();

  const baseUrl = `http://localhost:${env.port}`;

  const server = app.listen(env.port, () => {
    console.log(`[api] listening ${baseUrl}`);
    console.log(`[api] health ${baseUrl}/health`);
    console.log(`[api] swagger ${baseUrl}/api-docs`);
    console.log(`[api] openapi ${baseUrl}/openapi.json`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${env.port} is already in use. Stop the other process, or set PORT to a free port in .env / .env.dev.`
      );
    } else {
      console.error(err);
    }
    process.exit(1);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
