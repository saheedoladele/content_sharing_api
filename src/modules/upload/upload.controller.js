import { AppError } from "../../utils/AppError.js";
import * as uploadService from "./upload.service.js";

export async function uploadImage(req, res, next) {
  try {
    if (!req.file?.buffer) {
      throw new AppError('Missing file field "image" (multipart/form-data)', 400);
    }
    const result = await uploadService.uploadImageBuffer(req.file.buffer);
    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (e) {
    next(e);
  }
}
