import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import postsRoutes from "../modules/posts/posts.routes.js";
import commentsRoutes from "../modules/comments/comments.routes.js";
import uploadRoutes from "../modules/upload/upload.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);
router.use("/users", usersRoutes);
router.use("/posts/:postId/comments", commentsRoutes);
router.use("/posts", postsRoutes);

export default router;
