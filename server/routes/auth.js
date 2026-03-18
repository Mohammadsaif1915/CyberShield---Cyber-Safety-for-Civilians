// ═══════════════════════════════════════════════════════════
// FILE: backend/routes/auth.js
// Login aur Register — cookie set karta hai
// ═══════════════════════════════════════════════════════════

const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const User     = require("../models/User");

// ─── REGISTER ───────────────────────────────────────────────
// Tera Register.jsx already POST /api/register call karta hai
// Bas ensure karo ki JWT cookie set ho jaaye
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
      name:  fullName,
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
      httpOnly: true,                                      // JS se access nahi hoga
      secure:   process.env.NODE_ENV === "production",    // HTTPS pe hi jaayega
      sameSite: "strict",
      maxAge:   7 * 24 * 60 * 60 * 1000,                 // 7 din
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id:   user._id,
        name: user.name,
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
        id:   user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});


module.exports = router;