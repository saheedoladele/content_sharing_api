import pino from "pino";
import { env } from "./env.js";

const isProd = env.nodeEnv === "production";

export const logger = pino(
  isProd
    ? { level: process.env.LOG_LEVEL || "info" }
    : {
        level: process.env.LOG_LEVEL || "debug",
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:HH:MM:ss Z" },
        },
      }
);
