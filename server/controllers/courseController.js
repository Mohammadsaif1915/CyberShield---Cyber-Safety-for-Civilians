import Course from '../models/Course.js'
import Progress from '../models/Progress.js'

// GET /api/courses
export const getCourses = async (req, res) => {
  try {
    const { level, search } = req.query
    const filter = {}
    if (level  && level  !== 'All') filter.level  = level
    if (search) filter.title = { $regex: search, $options: 'i' }

    const courses = await Course.find(filter)
      .select('-quiz')
      .sort({ createdAt: -1 })

    res.json({ success: true, count: courses.length, courses })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/courses/:id
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('-quiz.answer')
    if (!course)
      return res.status(404).json({ success: false, message: 'Course not found' })
    res.json({ success: true, course })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/courses/:id/video-watched (track video progress)
export const videoWatched = async (req, res) => {
  try {
    const userId = req.user._id
    const courseId = req.params.id
    const { videoIndex, totalVideos } = req.body

    if (!totalVideos) return res.status(400).json({ success: false, message: 'totalVideos required' })

    let progress = await Progress.findOne({ user: userId, course: courseId })
    if (!progress) {
      progress = new Progress({ user: userId, course: courseId, videosWatched: 0, allVideosWatched: false })
    }

    progress.videosWatched = Math.min((videoIndex || 0) + 1, totalVideos)
    progress.allVideosWatched = progress.videosWatched >= totalVideos

    await progress.save()
    console.log('[Course] Video progress:', userId, 'Course:', courseId, 'Videos:', progress.videosWatched, '/', totalVideos)

    res.json({ success: true, progress: progress.videosWatched, total: totalVideos, allWatched: progress.allVideosWatched })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/courses/:id/complete (mark course as completed)
export const completeCourse = async (req, res) => {
  try {
    const userId = req.user._id
    const courseId = req.params.id

    const progress = await Progress.findOne({ user: userId, course: courseId })
    if (!progress) return res.status(404).json({ success: false, message: 'Progress not found. Watch videos first.' })
    if (!progress.allVideosWatched) return res.status(403).json({ success: false, message: 'Complete all videos first' })

    progress.quizTaken = true
    progress.completedAt = new Date()
    await progress.save()

    console.log('[Course] Completed:', userId, 'Course:', courseId)
    res.json({ success: true, message: 'Course completed', completedAt: progress.completedAt })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}