import multer from "multer";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "text/csv") {
      cb(null, path.join(__dirname, "../../public/csvFiles"));
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
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only CSV files are allowed."));
  }
};

const uploadCSVFile = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export { uploadCSVFile };
