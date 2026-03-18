// ═══════════════════════════════════════════════════════════
// FILE: backend/routes/user.js
// Yahan likhna hai — backend ka routes file
// ═══════════════════════════════════════════════════════════

const express = require("express");
const router  = express.Router();
const User    = require("../models/User"); // tera MongoDB model
const jwt     = require("jsonwebtoken");

// ─── MIDDLEWARE: Har request pe token check karo ───────────
// Ye function check karta hai ki user logged in hai ya nahi
const authMiddleware = (req, res, next) => {
  // Cookie se token uthao (ya Authorization header se)
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Login karo pehle" });
  }

  try {
    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user ki info req mein daal do
    next();             // aage badho
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// ═══════════════════════════════════════════════════════════
// 1. GET /api/me
//    KYA KARTA HAI: Logged-in user ki info MongoDB se laata hai
//    DASHBOARD USE: Welcome banner mein naam, profile page mein details
// ═══════════════════════════════════════════════════════════
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user.id = token mein stored user ka id
    const user = await User.findById(req.user.id).select("-password");
    //                                               ^^^^^^^^^^^
    //                              password wapas mat bhejo security ke liye

    if (!user) {
      return res.status(404).json({ message: "User nahi mila" });
    }

    res.json(user);
    // Dashboard ko milega:
    // { name: "Arjun Sharma", email: "arjun@...", city: "Mumbai", ... }

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ═══════════════════════════════════════════════════════════
// 2. PUT /api/me
//    KYA KARTA HAI: User ki profile update karta hai MongoDB mein
//    DASHBOARD USE: Profile page ka "Save Changes" button
// ═══════════════════════════════════════════════════════════
router.put("/me", authMiddleware, async (req, res) => {
  try {
    // req.body mein aayega: { name, email, phone, city, department }
    const { name, email, phone, city, department } = req.body;

    // MongoDB mein update karo
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, city, department }, // ye fields update hongi
      { new: true }                             // updated document wapas bhejo
    ).select("-password");

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ message: "Update nahi hua", error: err.message });
  }
});


// ═══════════════════════════════════════════════════════════
// 3. POST /api/logout
//    KYA KARTA HAI: Cookie delete karta hai — user logout ho jaata hai
//    DASHBOARD USE: Header ka "Logout" button
// ═══════════════════════════════════════════════════════════
router.post("/logout", (req, res) => {
  // Cookie clear karo
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ message: "Logout successful" });
  // Dashboard phir /login pe redirect kar dega
});


module.exports = router;