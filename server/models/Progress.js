import mongoose from 'mongoose'

const watchedVideoSchema = new mongoose.Schema({
  videoId:         { type: mongoose.Schema.Types.ObjectId },
  watchedDuration: { type: Number, default: 0 },
  totalDuration:   { type: Number, default: 0 },
  completed:       { type: Boolean, default: false }
}, { _id: false })

const progressSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

  watchedVideos:    [watchedVideoSchema],
  completedVideos:  { type: Number,  default: 0 },
  allVideosWatched: { type: Boolean, default: false },

  quizAttempts: { type: Number,  default: 0 },
  quizPassed:   { type: Boolean, default: false },
  quizScore:    { type: Number,  default: 0 },
  bestScore:    { type: Number,  default: 0 },

  certificateIssued: { type: Boolean, default: false },
  certificateName:   { type: String,  default: '' },
  completedAt:       { type: Date }
}, { timestamps: true })

progressSchema.index({ user: 1, course: 1 }, { unique: true })

export default mongoose.model('Progress', progressSchema)