import multer from "multer";
import { env } from "../config/env.js";

export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
}

export function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large (max 5MB)" });
    }
    return res.status(400).json({ error: err.message });
  }

  if (typeof err.http_code === "number" && err.http_code >= 400) {
    const status = err.http_code < 600 ? err.http_code : 502;
    return res.status(status).json({ error: err.message || "Upload failed" });
  }

  if (err.name === "ValidationError") {
    const parts =
      err.errors && typeof err.errors === "object"
        ? Object.values(err.errors)
            .map((e) => e.message)
            .filter(Boolean)
        : [];
    const message = parts.length > 0 ? parts.join("; ") : err.message || "Validation failed";
    return res.status(400).json({ error: message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid id or data format" });
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";
  if (env.nodeEnv !== "production" && err.stack) {
    console.error(err.stack);
  } else if (status >= 500) {
    console.error(message);
  }
  res.status(status).json({
    error: message,
    ...(env.nodeEnv !== "production" && err.details ? { details: err.details } : {}),
  });
}
