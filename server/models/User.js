

import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // ── Core identity ──────────────────────────────────────
    fullName: { type: String, trim: true, default: '' },
    name:     { type: String, trim: true, default: '' },   // legacy field kept
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    // ── Profile info ───────────────────────────────────────
    avatar:    { type: String, default: '' },
    coverImage:{ type: String, default: '' },
    phone:     { type: String, default: '' },
    city:      { type: String, default: '' },
    location:  { type: String, default: '' },
    bio:       { type: String, default: '' },
    role:      { type: String, default: 'student' },    // student / working_professional / etc.
    department:{ type: String, default: '' },
    googleId:  { type: String, default: '' },

    // ── Auth ───────────────────────────────────────────────
    resetPasswordToken:   { type: String },
    resetPasswordExpires: { type: Date },
    twoFaEnabled:         { type: Boolean, default: false },

    // ── Gamification / Stats ───────────────────────────────
    score:       { type: Number, default: 0 },   // total cumulative score
    xp:          { type: Number, default: 0 },   // same as score for now
    level:       { type: Number, default: 1 },
    loginStreak: { type: Number, default: 0 },
    lastLoginDate:{ type: Date,  default: null },

    // Quiz stats
    quizzesDone: { type: Number, default: 0 },
    avgScore:    { type: Number, default: 0 },   // percentage average

    // Phishing simulator
    phishingSimCorrect: { type: Number, default: 0 },
    phishingSimTotal:   { type: Number, default: 0 },

    // Game
    gameScore:       { type: Number, default: 0 },
    gamesPlayed:     { type: Number, default: 0 },
    gameHighScore:   { type: Number, default: 0 },

    // Course progress
    coursesCompleted:{ type: Number, default: 0 },

    // Domain scores (0-100)
    phishingScore: { type: Number, default: 0 },
    malwareScore:  { type: Number, default: 0 },
    networkScore:  { type: Number, default: 0 },
    privacyScore:  { type: Number, default: 0 },
    cloudScore:    { type: Number, default: 0 },

    // ── Misc ───────────────────────────────────────────────
    badges:         { type: Array,  default: [] },
    notifPrefs:     { type: Object, default: { email: true, push: true, threats: true, weekly: false } },
    weeklyActivity: { type: Array,  default: [] },
    recentActivity: { type: Array,  default: [] },
  },
  { timestamps: true }
);

// ── Virtual: resolve name from either field ──────────────────
userSchema.virtual('displayName').get(function () {
  return this.fullName || this.name || this.email.split('@')[0];
});

// ── Hash password before save ─────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // Keep fullName ↔ name in sync on save
  if (this.fullName && !this.name)  this.name     = this.fullName;
  if (this.name     && !this.fullName) this.fullName = this.name;
  next();
});

// ── Compare password ──────────────────────────────────────────
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);