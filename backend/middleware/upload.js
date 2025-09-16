// backend/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Always resolve absolute path relative to project root
        const dir = path.join(process.cwd(), "uploads/avatars");

        // Ensure folder exists (no crash if missing)
        fs.mkdirSync(dir, { recursive: true });

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}-${Date.now()}${ext}`);
    },
});

// Only allow image uploads
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

// Multer instance
const upload = multer({ storage, fileFilter });

export default upload;

