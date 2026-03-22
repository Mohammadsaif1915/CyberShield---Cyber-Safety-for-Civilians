import mongoose from 'mongoose'
import bcrypt    from 'bcryptjs'

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, minlength: 2 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  city:     { type: String, required: true, trim: true },
  role: {
    type: String,
    required: true,
    enum: ['student', 'working_professional', 'senior_citizen'],
  },
  googleId:             { type: String },
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date },
  phone:      { type: String, default: '' },
  avatar:     { type: String, default: null },
  coverImage: { type: String, default: null },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)