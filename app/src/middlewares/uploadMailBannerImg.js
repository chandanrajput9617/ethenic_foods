import multer from "multer";
import path from "path";

const allowedFileTypes = [".jpg", ".jpeg", ".png", ".mp4", ".zip"];

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.fieldname === "bannerImg" &&
      (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png")
    ) {
      cb(null, path.join(__dirname, "../../public/emailBanner"));
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
    cb(new Error("Invalid file type. Only jpg, jpeg, png an are allowed."));
  }
};

const uploadEmailBanner = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
export { uploadEmailBanner };
