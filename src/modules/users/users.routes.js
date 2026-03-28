import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import * as usersController from "./users.controller.js";

const router = Router();

router.get("/", optionalAuth, usersController.list);
router.get("/:id", usersController.getOne);
router.patch("/me/profile", requireAuth, usersController.updateMe);
router.post("/:id/follow", requireAuth, usersController.follow);
router.delete("/:id/follow", requireAuth, usersController.unfollow);

export default router;
