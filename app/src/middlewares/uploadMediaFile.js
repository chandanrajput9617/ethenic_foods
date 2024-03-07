import multer from "multer";
import path from "path";

const allowedFileTypes = [".jpg", ".jpeg", ".png", ".mp4", ".zip"];

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      (file.fieldname === "hero_section_image" ||
        file.fieldname === "reviews_image" ||
        file.fieldname === "about_us_image" ||
        file.fieldname === "blog_image" ||
        file.fieldname === "images" ||
        file.fieldname === "loginBackgoundImg") &&
      (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png")
    ) {
      cb(null, path.join(__dirname, "../../public/images"));
    } else if (file.fieldname === "logo" && file.mimetype === "image/png") {
      cb(null, path.join(__dirname, "../../public/logo"));
    } else if (file.mimetype === "video/mp4") {
      cb(null, path.join(__dirname, "../../public/videos"));
    } else if (file.mimetype === "application/zip") {
      cb(null, path.join(__dirname, "../../public/zipfiles"));
    } else {
      cb("Invalid file type.");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      path.basename(file.originalname, path.extname(file.originalname)) +
        "-" +
        file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only jpg, jpeg, png and mp4 are allowed.")
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export { upload };
