import "../config/env.js";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { User, Post, Comment } from "../models/index.js";

/**
 * Applies indexes defined on Mongoose models (same as runtime syncIndexes).
 * Used by migrate-mongo so DB indexes match `src/models/*.js`.
 */
export async function syncModelIndexes() {
  const wasConnected = mongoose.connection.readyState === 1;
  if (!wasConnected) {
    await mongoose.connect(env.mongoUri);
  }
  try {
    await User.syncIndexes();
    await Post.syncIndexes();
    await Comment.syncIndexes();
  } finally {
    if (!wasConnected) {
      await mongoose.disconnect();
    }
  }
}

/**
 * Drops all indexes except `_id` on model collections (for migrate down).
 * Matches Mongoose default collection names.
 */
export async function dropModelIndexes() {
  const wasConnected = mongoose.connection.readyState === 1;
  if (!wasConnected) {
    await mongoose.connect(env.mongoUri);
  }
  try {
    await User.collection.dropIndexes();
    await Post.collection.dropIndexes();
    await Comment.collection.dropIndexes();
  } finally {
    if (!wasConnected) {
      await mongoose.disconnect();
    }
  }
}
