import dotenv from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

/**
 * Load `.env`, then `.env.dev` when present.
 * Variables already set in the process environment (e.g. `PORT=3002 node ...`) are never overwritten.
 * `.env.dev` overrides `.env` for keys that were not set in the shell.
 */
export function loadEnv() {
  const shellKeys = new Set(Object.keys(process.env));

  dotenv.config({ path: join(root, ".env") });

  const devPath = join(root, ".env.dev");
  if (!existsSync(devPath)) return;

  const parsed = dotenv.parse(readFileSync(devPath, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (!shellKeys.has(key)) {
      process.env[key] = value;
    }
  }
}

loadEnv();
