import "./config/env.js";
import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./config/logger.js";
import routes from "./routes/index.js";
import { setupSwagger } from "./config/swagger.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => {
        const path = (req.url || "").split("?")[0];
        const shouldLog =
          path === "/health" ||
          path === "/openapi.json" ||
          path.startsWith("/api-docs");
        return !shouldLog;
      },
    },
  })
);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

setupSwagger(app);

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
