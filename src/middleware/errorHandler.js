import multer from "multer";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { AppError } from "../utils/AppError.js";
import { sendError } from "../utils/errorResponse.js";

function mongooseValidationDetails(err) {
  if (!err.errors || typeof err.errors !== "object") return undefined;
  const fields = Object.entries(err.errors).map(([field, e]) => ({
    field,
    message: e?.message || String(e),
  }));
  return fields.length > 0 ? { fields } : undefined;
}

function duplicateKeyMessage(err) {
  const key = err.keyPattern && typeof err.keyPattern === "object" ? err.keyPattern : {};
  let fields = Object.keys(key);
  if (fields.length === 0 && err.keyValue && typeof err.keyValue === "object") {
    fields = Object.keys(err.keyValue);
  }
  const field = fields[0] || "value";
  const readable =
    field === "email"
      ? "This email is already registered."
      : field === "username"
        ? "This username is already taken."
        : `This ${field} is already in use.`;
  return { message: readable, field };
}

export function notFoundHandler(req, res) {
  sendError(res, 404, "The requested resource was not found.", {
    code: "NOT_FOUND",
    path: req.originalUrl,
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, {
      code: err.code,
      details: err.details,
    });
  }

  if (err.type === "entity.parse.failed") {
    return sendError(res, 400, "Request body must be valid JSON.", {
      code: "INVALID_JSON",
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return sendError(res, 400, "File is too large (maximum 5MB).", {
        code: "FILE_TOO_LARGE",
      });
    }
    return sendError(res, 400, err.message || "Upload failed.", {
      code: "UPLOAD_ERROR",
      details: { multerCode: err.code },
    });
  }

  if (typeof err.http_code === "number" && err.http_code >= 400) {
    const status = err.http_code < 600 ? err.http_code : 502;
    return sendError(res, status, err.message || "Upload failed.", {
      code: "EXTERNAL_UPLOAD_ERROR",
    });
  }

  if (err.code === 11000) {
    const { message, field } = duplicateKeyMessage(err);
    return sendError(res, 409, message, {
      code: "DUPLICATE_KEY",
      details: { field },
    });
  }

  if (err.name === "ValidationError") {
    const details = mongooseValidationDetails(err);
    const summary =
      details?.fields?.map((f) => `${f.field}: ${f.message}`).join("; ") ||
      err.message ||
      "Validation failed.";
    return sendError(res, 400, summary, {
      code: "VALIDATION_ERROR",
      details,
    });
  }

  if (err.name === "CastError") {
    return sendError(res, 400, "Invalid ID or data format.", { code: "INVALID_ID" });
  }

  const status =
    typeof err.statusCode === "number"
      ? err.statusCode
      : typeof err.status === "number"
        ? err.status
        : 500;

  const safeStatus = status >= 400 && status < 600 ? status : 500;

  if (safeStatus >= 500) {
    const logPayload = {
      err,
      method: req.method,
      path: req.originalUrl,
      status: safeStatus,
    };
    if (env.nodeEnv === "production") {
      logger.error(logPayload, "unhandled error");
    } else {
      logger.error(logPayload, err.message || "unhandled error");
    }
  }

  const exposeMessage =
    safeStatus < 500 || env.nodeEnv !== "production"
      ? err.message || "Request could not be completed."
      : "Something went wrong. Please try again later.";

  const fallbackOptions = {
    code: safeStatus >= 500 ? "INTERNAL_ERROR" : "ERROR",
  };
  if (env.nodeEnv !== "production" && safeStatus >= 500 && err.stack) {
    fallbackOptions.details = { stack: err.stack };
  }
  return sendError(res, safeStatus, exposeMessage, fallbackOptions);
}
