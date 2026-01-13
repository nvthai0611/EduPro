import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // console.log('[CloudinaryStorage] Processing file:', file.originalname);
    return {
      folder: "banners",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
     transformation: [
      { width: 1200, height: 1200, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
    };
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB
  }
});

// Wrapper function với error handling
export const uploadSingle = (req: any, res: any, next: any) => {
  const multerSingle = upload.single("image");
  
  multerSingle(req, res, (err: any) => {
    if (err) {
      console.error('[uploadSingle] ERROR:', err.message);
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
};

export const uploadMultiple = upload.array("images", 5);

// Forum images upload (cover + content images)
export const uploadForumImages = (req: any, res: any, next: any) => {
  const multerFields = upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "contentImages", maxCount: 5 }
  ]);
  
  multerFields(req, res, (err: any) => {
    if (err) {
      console.error('[uploadForumImages] ERROR:', err.message);
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
};
