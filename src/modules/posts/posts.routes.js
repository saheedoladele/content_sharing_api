import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import * as postsController from "./posts.controller.js";

const router = Router();

router.get("/search", postsController.search);
router.get("/user/:userId", postsController.byAuthor);
router.get("/user/:userId/liked", postsController.likedByUser);
router.get("/", optionalAuth, postsController.list);
router.post("/", requireAuth, postsController.create);
router.get("/:id", postsController.getOne);
router.post("/:id/like", requireAuth, postsController.like);

export default router;
