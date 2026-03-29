/**
 * Single JSON shape for all API errors so clients can show clear messages
 * and optional structured details (e.g. validation fields).
 *
 * @param {import("express").Response} res
 * @param {number} status HTTP status
 * @param {string} message Human-readable summary (safe for end users)
 * @param {{ code?: string, details?: unknown, path?: string }} [options]
 */
export function sendError(res, status, message, options = {}) {
  const { code, details, path } = options;
  const body = {
    error: message,
    status,
    ...(code && { code }),
    ...(details !== undefined && details !== null && { details }),
    ...(path && { path }),
  };
  return res.status(status).json(body);
}
