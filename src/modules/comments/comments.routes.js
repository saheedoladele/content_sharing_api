import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import * as commentsController from "./comments.controller.js";

const router = Router({ mergeParams: true });

router.get("/", commentsController.list);
router.post("/", requireAuth, commentsController.create);

export default router;
