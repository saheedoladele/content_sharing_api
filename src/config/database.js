import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(env.mongoUri);
    const c = mongoose.connection;
    const dbName = c.db?.databaseName ?? "unknown";
    const host = c.host ?? "unknown";
    const port = c.port != null ? `:${c.port}` : "";
    console.log(`[database] connected (${dbName} @ ${host}${port})`);
  } catch (err) {
    console.error(
      "MongoDB connection failed. Check MONGODB_URI in .env or .env.dev (and that the cluster allows your IP)."
    );
    throw err;
  }
}
