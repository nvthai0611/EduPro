import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloundinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});

export const uploadSingle = multer({ storage }).single("image");
export const uploadMultiple = multer({ storage }).array("images", 5);
