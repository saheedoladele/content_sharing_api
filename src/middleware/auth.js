import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { sendError } from "../utils/errorResponse.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return sendError(res, 401, "Authentication required. Send an Authorization: Bearer <token> header.", {
      code: "UNAUTHORIZED",
    });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.userId = payload.sub;
    next();
  } catch {
    return sendError(res, 401, "Invalid or expired token. Please sign in again.", {
      code: "INVALID_TOKEN",
    });
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    req.userId = null;
    return next();
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.userId = payload.sub;
  } catch {
    req.userId = null;
  }
  next();
}
