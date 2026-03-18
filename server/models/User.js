// ═══════════════════════════════════════════════════════════
// FILE: backend/models/User.js
// MongoDB ka schema — user ka data kaisa store hoga
// ═══════════════════════════════════════════════════════════

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // Register page se aane wale fields
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },  // hashed (bcrypt)
  city:       { type: String, default: "" },
  role:       { type: String, default: "student" }, // student / professional / senior_citizen

  // Dashboard profile mein dikhne wale extra fields
  phone:       { type: String, default: "" },
  department:  { type: String, default: "InfoSec" },
  joinDate:    { type: String, default: () => new Date().getFullYear().toString() },

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);