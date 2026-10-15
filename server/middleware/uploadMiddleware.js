
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Local development uses server/uploads.
// Render can use a persistent disk through UPLOAD_DIR.
const uploadDirectory =
  process.env.UPLOAD_DIR ||
  path.join(__dirname, "../uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const originalName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );

    const name = originalName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Prevent overwriting files with the same original name.
    const filename =
      `${Date.now()}-${crypto.randomBytes(6).toString("hex")}-` +
      `${name || "image"}${extension}`;

    cb(null, filename);
  },
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedTypes.includes(file.mimetype) &&
    allowedExtensions.includes(extension)
  ) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Only JPG, JPEG, PNG, WEBP, GIF and SVG images are allowed."
    )
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
