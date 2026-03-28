import mongoose from "mongoose";
import { Comment } from "../../models/Comment.js";
import { Post } from "../../models/Post.js";
import { AppError } from "../../utils/AppError.js";
import { toPublicComment } from "../../utils/serializers.js";

export async function listByPost(postId) {
  if (!mongoose.isValidObjectId(postId)) {
    throw new AppError("Post not found", 404);
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const comments = await Comment.find({ postId }).sort({ createdAt: 1 });
  return comments.map(toPublicComment);
}

export async function createComment(postId, authorId, { text, parentCommentId }) {
  if (!mongoose.isValidObjectId(postId)) {
    throw new AppError("Post not found", 404);
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const t = String(text || "").trim();
  if (!t) {
    throw new AppError("Text is required", 400);
  }
  let parentId = null;
  if (parentCommentId) {
    if (!mongoose.isValidObjectId(parentCommentId)) {
      throw new AppError("Invalid parent comment", 400);
    }
    const parent = await Comment.findOne({ _id: parentCommentId, postId });
    if (!parent) {
      throw new AppError("Parent comment not found", 400);
    }
    parentId = parent._id;
  }
  const comment = await Comment.create({
    postId,
    parentCommentId: parentId,
    authorId,
    text: t,
  });
  return toPublicComment(comment);
}
