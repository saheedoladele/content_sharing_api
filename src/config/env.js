import "./loadEnv.js";

export const env = {
  port: Number(process.env.PORT) || 3001,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/content-sharing",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
  /** Set `CLOUDINARY_URL` (from Cloudinary dashboard) to enable image uploads */
  cloudinaryUrl: process.env.CLOUDINARY_URL || "",
};
