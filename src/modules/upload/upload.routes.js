import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../../middleware/auth.js";
import { AppError } from "../../utils/AppError.js";
import * as uploadController from "./upload.controller.js";
import { MAX_BYTES } from "./upload.service.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new AppError("Only image uploads are allowed", 400));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.post("/image", requireAuth, upload.single("image"), uploadController.uploadImage);

export default router;
