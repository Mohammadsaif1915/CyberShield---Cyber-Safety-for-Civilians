// ═══════════════════════════════════════════════════════════
// FILE: backend/routes/auth.js
// Login aur Register — cookie set karta hai
// ═══════════════════════════════════════════════════════════

import express  from "express";
import bcrypt   from "bcryptjs";
import jwt      from "jsonwebtoken";
import multer   from "multer";
import { v2 as cloudinary } from "cloudinary";
import User     from "../models/User.js";

const router = express.Router();

// ── Multer memory storage for avatar uploads ─────────────────
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// ── Auth middleware ──────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// ─── REGISTER ───────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, city, role } = req.body;

    // Check: email already exist karta hai?
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Password hash karo
    const hashed = await bcrypt.hash(password, 12);

    // MongoDB mein save karo
    const user = await User.create({
      name: fullName,
      email,
      password: hashed,
      city,
      role,
    });

    // JWT token banao
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ⭐ Cookie mein token daalo (localStorage nahi!)
    res.cookie("token", token, {
      httpOnly: true,                                   // JS se access nahi hoga
      secure:   process.env.NODE_ENV === "production",  // HTTPS pe hi jaayega
      sameSite: "strict",
      maxAge:   7 * 24 * 60 * 60 * 1000,               // 7 din
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});


// ─── LOGIN ──────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // User dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Password check karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Token banao
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ⭐ Cookie mein daalo
    res.cookie("token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});


// ─── GET ME (Protected) ──────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Calculate login streak on backend (date-based, not hour-based)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    const lastLoginDate = lastLogin ? new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate()) : null;

    // Calculate days difference
    const daysDiff = lastLoginDate ? Math.floor((today - lastLoginDate) / (1000 * 60 * 60 * 24)) : 999;

    if (daysDiff === 1) {
      // Increment streak (logged in next day)
      user.loginStreak = (user.loginStreak || 0) + 1;
      user.lastLoginDate = now;
      await user.save();
    } else if (daysDiff > 1) {
      // Reset streak (missed a day)
      user.loginStreak = 1;
      user.lastLoginDate = now;
      await user.save();
    }
    // If daysDiff === 0, don't change anything (already logged in today)

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ─── UPDATE PROFILE (Protected, with Avatar Upload) ──────────
router.put("/profile", protect, upload.single("avatar"), async (req, res) => {
  try {
    const { fullName, email, phone, location, role, bio } = req.body;
    const userId = req.user._id;

    // Build update object
    const updateData = {};
    if (fullName) {
      updateData.fullName = fullName;
      updateData.name = fullName; // Keep name field in sync
    }
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (role) updateData.role = role;
    if (bio) updateData.bio = bio;

    // Handle avatar file upload to Cloudinary
    if (req.file) {
      try {
        const transformation = [{ width: 400, height: 400, crop: "fill", gravity: "face" }];

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "cybershield/avatars",
              public_id: `${userId}_avatar`,
              overwrite: true,
              transformation,
              format: "webp",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        updateData.avatar = result.secure_url;
        console.log(`✅ Avatar uploaded for user ${userId}: ${result.secure_url}`);
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        return res.status(500).json({ success: false, message: "Avatar upload failed", error: uploadErr.message });
      }
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: false });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;