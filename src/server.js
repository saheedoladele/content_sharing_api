import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function main() {
  await connectDatabase();

  const baseUrl = `http://localhost:${env.port}`;

  const server = app.listen(env.port, () => {
    logger.info(
      {
        url: baseUrl,
        health: `${baseUrl}/health`,
        swagger: `${baseUrl}/api-docs`,
        openapi: `${baseUrl}/openapi.json`,
      },
      "server listening"
    );
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      logger.error(
        { port: env.port, err },
        "port already in use; stop the other process or set PORT in .env / .env.dev"
      );
    } else {
      logger.error({ err }, "server listen error");
    }
    process.exit(1);
  });
}

main().catch((err) => {
  logger.error({ err }, "failed to start server");
  process.exit(1);
});
