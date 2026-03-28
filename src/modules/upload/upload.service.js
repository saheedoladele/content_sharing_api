import { cloudinary } from "../../config/cloudinary.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";

const MAX_BYTES = 5 * 1024 * 1024;

export { MAX_BYTES };

export async function uploadImageBuffer(buffer) {
  if (!env.cloudinaryUrl) {
    throw new AppError("Image upload is not configured (set CLOUDINARY_URL)", 503);
  }
  if (!buffer?.length) {
    throw new AppError("No file uploaded", 400);
  }
  if (buffer.length > MAX_BYTES) {
    throw new AppError("Image must be 5MB or smaller", 400);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "content-sharing",
        resource_type: "image",
        overwrite: false,
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}
