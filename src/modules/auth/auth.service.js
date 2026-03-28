import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { signToken } from "../../utils/jwt.js";
import { toPublicUser } from "../../utils/serializers.js";

const SALT_ROUNDS = 10;

export async function register({ username, displayName, email, password }) {
  const emailNorm = email.trim().toLowerCase();
  const usernameNorm = username.trim().toLowerCase();
  if (await User.findOne({ email: emailNorm })) {
    throw new AppError("Email already in use", 409);
  }
  if (await User.findOne({ username: usernameNorm })) {
    throw new AppError("Username taken", 409);
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const avatar = ``;
  const user = await User.create({
    username: usernameNorm,
    displayName: displayName.trim(),
    email: emailNorm,
    passwordHash,
    avatar,
    bio: "",
    followers: [],
    following: [],
  });
  const token = signToken(user._id.toString());
  return { token, user: toPublicUser(user) };
}

export async function login({ email, password }) {
  const emailNorm = email.trim().toLowerCase();
  const user = await User.findOne({ email: emailNorm });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new AppError("Invalid email or password", 401);
  }
  const token = signToken(user._id.toString());
  return { token, user: toPublicUser(user) };
}

export async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toPublicUser(user);
}
