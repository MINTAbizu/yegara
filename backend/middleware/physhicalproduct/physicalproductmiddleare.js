// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadPath = path.join(process.cwd(), "uploads/physicalProducts");

// // Create uploads folder if it doesn't exist
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
//   console.log("Created physicalProducts upload folder at:", uploadPath);
// } else {
//   console.log("physicalProducts upload folder exists at:", uploadPath);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadPath),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({ storage });

// export default upload;




import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yegara/pysical-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
  
});

const upload = multer({ storage });

export default upload;
