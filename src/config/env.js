import "./loadEnv.js";

/** Comma-separated browser origins, e.g. `http://localhost:5173,http://localhost:3000` */
function parseCorsOrigins(raw) {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT) || 3002,
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/content-sharing",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
  /** Set `CLOUDINARY_URL` (from Cloudinary dashboard) to enable image uploads */
  cloudinaryUrl: process.env.CLOUDINARY_URL || "",
};
