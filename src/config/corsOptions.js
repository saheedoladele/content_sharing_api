import cors from "cors";
import { env } from "./env.js";

const allowedOrigins = new Set(env.corsOrigins);

/**
 * Reflect only origins listed in `CORS_ORIGINS` (comma-separated in env).
 * Requests with no `Origin` header (curl, server-to-server, same-origin) are allowed.
 */
export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 204,
});
