import mongoose from "mongoose";
import { Post } from "../../models/Post.js";
import { User } from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { toPublicPost } from "../../utils/serializers.js";

export async function listPosts({ scope, userId }) {
  if (scope === "following") {
    if (!userId) {
      throw new AppError("Authentication required for following feed", 401);
    }
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const allowed = [...(user.following || []).map((id) => id.toString()), userId];
    const oids = allowed.map((id) => new mongoose.Types.ObjectId(id));
    const posts = await Post.find({ authorId: { $in: oids } }).sort({ createdAt: -1 });
    return posts.map(toPublicPost);
  }
  const posts = await Post.find().sort({ createdAt: -1 });
  return posts.map(toPublicPost);
}

export async function searchPosts(q) {
  if (!q || !String(q).trim()) {
    return [];
  }
  const regex = new RegExp(String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const posts = await Post.find({ text: regex }).sort({ createdAt: -1 }).limit(100);
  return posts.map(toPublicPost);
}

export async function getPostById(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Post not found", 404);
  }
  const post = await Post.findById(id);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  return toPublicPost(post);
}

export async function createPost(userId, { text, imageUrl }) {
  if (!userId || !mongoose.isValidObjectId(String(userId))) {
    throw new AppError("Invalid or missing session", 401);
  }
  const t = String(text || "").trim();
  if (!t) {
    throw new AppError("Text is required", 400);
  }
  if (t.length > 500) {
    throw new AppError("Text must be 500 characters or less", 400);
  }
  const post = await Post.create({
    authorId: userId,
    text: t,
    imageUrl: imageUrl?.trim() || undefined,
    likes: [],
  });
  return toPublicPost(post);
}

export async function toggleLike(userId, postId) {
  if (!mongoose.isValidObjectId(postId)) {
    throw new AppError("Post not found", 404);
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const uid = new mongoose.Types.ObjectId(userId);
  const idx = post.likes.findIndex((id) => id.equals(uid));
  if (idx >= 0) {
    post.likes.splice(idx, 1);
  } else {
    post.likes.push(uid);
  }
  await post.save();
  return toPublicPost(post);
}

export async function listPostsByAuthor(authorId) {
  if (!mongoose.isValidObjectId(authorId)) {
    return [];
  }
  const posts = await Post.find({ authorId }).sort({ createdAt: -1 });
  return posts.map(toPublicPost);
}

export async function listLikedPosts(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    return [];
  }
  const uid = new mongoose.Types.ObjectId(userId);
  const posts = await Post.find({ likes: uid }).sort({ createdAt: -1 });
  return posts.map(toPublicPost);
}
