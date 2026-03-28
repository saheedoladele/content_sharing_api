const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const root = process.cwd();
const shellKeys = new Set(Object.keys(process.env));
dotenv.config({ path: path.join(root, ".env") });
const envDev = path.join(root, ".env.dev");
if (fs.existsSync(envDev)) {
  const parsed = dotenv.parse(fs.readFileSync(envDev, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (!shellKeys.has(key)) {
      process.env[key] = value;
    }
  }
}

const url =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/content-sharing";

module.exports = {
  mongodb: {
    url,
    options: {},
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".cjs",
  useFileHash: false,
  moduleSystem: "commonjs",
};
