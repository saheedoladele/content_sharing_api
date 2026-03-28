import mongoose from "mongoose";
import { User } from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { toPublicUser } from "../../utils/serializers.js";

export async function listUsers({ excludeUserId }) {
  const q = excludeUserId ? { _id: { $ne: new mongoose.Types.ObjectId(excludeUserId) } } : {};
  const users = await User.find(q).sort({ username: 1 }).lean();
  return users.map((u) => toPublicUser(u));
}

export async function getUserById(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("User not found", 404);
  }
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toPublicUser(user);
}

export async function updateProfile(userId, { displayName, bio, avatar }) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (displayName !== undefined) user.displayName = String(displayName).trim();
  if (bio !== undefined) user.bio = String(bio);
  if (avatar !== undefined) user.avatar = String(avatar).trim();
  await user.save();
  return toPublicUser(user);
}

export async function follow(followerId, targetId) {
  if (followerId === targetId) {
    throw new AppError("Cannot follow yourself", 400);
  }
  if (!mongoose.isValidObjectId(targetId)) {
    throw new AppError("User not found", 404);
  }
  const [follower, target] = await Promise.all([User.findById(followerId), User.findById(targetId)]);
  if (!follower || !target) {
    throw new AppError("User not found", 404);
  }
  await User.updateOne({ _id: follower._id }, { $addToSet: { following: target._id } });
  await User.updateOne({ _id: target._id }, { $addToSet: { followers: follower._id } });
  return getUserById(targetId);
}

export async function unfollow(followerId, targetId) {
  if (followerId === targetId) {
    throw new AppError("Cannot unfollow yourself", 400);
  }
  if (!mongoose.isValidObjectId(targetId)) {
    throw new AppError("User not found", 404);
  }
  const [follower, target] = await Promise.all([User.findById(followerId), User.findById(targetId)]);
  if (!follower || !target) {
    throw new AppError("User not found", 404);
  }
  await User.updateOne({ _id: follower._id }, { $pull: { following: target._id } });
  await User.updateOne({ _id: target._id }, { $pull: { followers: follower._id } });
  return getUserById(targetId);
}
