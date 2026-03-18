// ─────────────────────────────────────────────────────────────────
// routes/upload.js
// Profile image & cover image upload endpoint
//
// Uses Cloudinary for image hosting (free tier: 25GB storage, 25GB bandwidth/month)
// Install: npm install multer cloudinary @cloudinary/url-gen
//
// .env mein yeh add karo:
//   CLOUDINARY_CLOUD_NAME=your_cloud_name
//   CLOUDINARY_API_KEY=your_api_key
//   CLOUDINARY_API_SECRET=your_api_secret
// ─────────────────────────────────────────────────────────────────

const express    = require("express");
const multer     = require("multer");
const cloudinary = require("cloudinary").v2;
const User       = require("../models/User"); // tera existing User model
const authMiddleware = require("../middleware/auth"); // tera existing JWT middleware

const router = express.Router();

// ── Cloudinary Config ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer — memory storage (file disk pe save nahi hoga) ─────────
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Sirf JPEG, PNG, WebP, GIF images allowed hain"), false);
    }
  },
});

// ── Helper: buffer ko Cloudinary pe upload karo ───────────────────
const uploadToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id:       publicId,
        overwrite:       true,           // same user ka purana image replace ho
        transformation:  folder === "cybershield/avatars"
          ? [{ width: 400, height: 400, crop: "fill", gravity: "face" }]  // face crop
          : [{ width: 1200, height: 300, crop: "fill" }],                  // cover crop
        format: "webp",                  // auto-convert to webp for smaller size
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ══════════════════════════════════════════════════════════════════
// POST /api/upload-profile-image
// Headers: Authorization: Bearer <token>
// Body: multipart/form-data
//   - image: File
//   - type: "avatar" | "cover"
// Response: { success: true, url: "https://..." }
// ══════════════════════════════════════════════════════════════════
router.post(
  "/upload-profile-image",
  authMiddleware,                 // JWT verify karo
  upload.single("image"),         // "image" field se file lo
  async (req, res) => {
    try {
      // ── Validation ──────────────────────────────────────────────
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Koi image nahi mili" });
      }

      const type = req.body.type; // "avatar" or "cover"
      if (!["avatar", "cover"].includes(type)) {
        return res.status(400).json({ success: false, message: "type 'avatar' ya 'cover' hona chahiye" });
      }

      // ── Cloudinary folder & public ID ───────────────────────────
      const userId  = req.user._id || req.user.id;
      const folder  = type === "avatar" ? "cybershield/avatars" : "cybershield/covers";
      const publicId = `${userId}_${type}`;   // e.g. "64abc123_avatar"

      // ── Upload to Cloudinary ────────────────────────────────────
      const result = await uploadToCloudinary(req.file.buffer, folder, publicId);
      const imageUrl = result.secure_url;     // https://res.cloudinary.com/...

      // ── Save URL in MongoDB ─────────────────────────────────────
      const updateField = type === "avatar" ? { avatar: imageUrl } : { coverImage: imageUrl };
      await User.findByIdAndUpdate(userId, updateField, { new: true });

      // ── Response ────────────────────────────────────────────────
      return res.status(200).json({
        success: true,
        url:     imageUrl,
        type,
        message: `${type === "avatar" ? "Profile photo" : "Cover image"} update ho gaya!`,
      });

    } catch (error) {
      console.error("Image upload error:", error);
      return res.status(500).json({
        success:  false,
        message:  "Image upload failed",
        error:    error.message,
      });
    }
  }
);

// ══════════════════════════════════════════════════════════════════
// DELETE /api/upload-profile-image?type=avatar|cover
// Avatar ya cover image hata do (Cloudinary se bhi)
// ══════════════════════════════════════════════════════════════════
router.delete("/upload-profile-image", authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    if (!["avatar", "cover"].includes(type)) {
      return res.status(400).json({ success: false, message: "type 'avatar' ya 'cover' hona chahiye" });
    }

    const userId   = req.user._id || req.user.id;
    const publicId = `cybershield/${type === "avatar" ? "avatars" : "covers"}/${userId}_${type}`;

    // Cloudinary se delete karo
    await cloudinary.uploader.destroy(publicId).catch(() => {}); // ignore if already deleted

    // MongoDB mein field clear karo
    const clearField = type === "avatar" ? { avatar: null } : { coverImage: null };
    await User.findByIdAndUpdate(userId, clearField);

    return res.status(200).json({ success: true, message: `${type} image hata diya gaya` });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


// ─────────────────────────────────────────────────────────────────
// app.js / server.js mein yeh add karo:
// ─────────────────────────────────────────────────────────────────
//
//   const uploadRoutes = require("./routes/upload");
//   app.use("/api", uploadRoutes);
//
// ─────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────
// models/User.js mein yeh 2 fields add karo (agar already nahi hain):
// ─────────────────────────────────────────────────────────────────
//
//   avatar:     { type: String, default: null },
//   coverImage: { type: String, default: null },
//
// ─────────────────────────────────────────────────────────────────