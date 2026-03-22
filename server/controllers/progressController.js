import Progress from '../models/Progress.js'
import Course   from '../models/Course.js'
import User     from '../models/User.js'

// ─────────────────────────────────────────────────────────────
// GET /api/progress/:courseId
// ─────────────────────────────────────────────────────────────
export const getProgress = async (req, res) => {
  try {
    const userId   = req.userId
    const courseId = req.params.courseId

    let progress = await Progress.findOne({ user: userId, course: courseId })

    if (!progress) {
      const course = await Course.findById(courseId)
      if (!course)
        return res.status(404).json({ success: false, message: 'Course not found' })

      progress = await Progress.create({
        user:   userId,
        course: courseId,
        watchedVideos: course.videos.map(v => ({
          videoId:         v._id,
          watchedDuration: 0,
          totalDuration:   v.duration,
          completed:       false
        }))
      })
    }

    res.json({ success: true, progress })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/progress/:courseId/video
// ─────────────────────────────────────────────────────────────
export const updateVideoProgress = async (req, res) => {
  try {
    const userId   = req.userId
    const courseId = req.params.courseId
    const { videoId, watchedDuration, totalDuration } = req.body

    const course = await Course.findById(courseId)
    if (!course)
      return res.status(404).json({ success: false, message: 'Course not found' })

    let progress = await Progress.findOne({ user: userId, course: courseId })

    if (!progress) {
      progress = await Progress.create({
        user:   userId,
        course: courseId,
        watchedVideos: course.videos.map(v => ({
          videoId:         v._id,
          watchedDuration: 0,
          totalDuration:   v.duration,
          completed:       false
        }))
      })
    }

    const isCompleted = totalDuration > 0 && watchedDuration >= totalDuration * 0.95
    const idx = progress.watchedVideos.findIndex(
      wv => wv.videoId.toString() === videoId.toString()
    )

    if (idx > -1) {
      if (watchedDuration > progress.watchedVideos[idx].watchedDuration)
        progress.watchedVideos[idx].watchedDuration = watchedDuration
      progress.watchedVideos[idx].completed = isCompleted
    } else {
      progress.watchedVideos.push({ videoId, watchedDuration, totalDuration, completed: isCompleted })
    }

    progress.completedVideos  = progress.watchedVideos.filter(v => v.completed).length
    progress.allVideosWatched = progress.completedVideos >= course.videos.length

    await progress.save()
    res.json({ success: true, progress })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/progress/all
// Logged-in user ki details + saare courses ka progress
// ─────────────────────────────────────────────────────────────
export const getAllProgress = async (req, res) => {
  try {
    const userId = req.userId

    // ✅ Logged-in user ki details
    const user = await User.findById(userId).select('fullName email avatar role city')
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' })

    // ✅ Us user ke saare courses ka progress
    const allProgress = await Progress.find({ user: userId })
      .populate('course', 'title level totalVideos icon color description')
      .lean()

    const progressList = allProgress.map(p => {
      const completedVideos = p.watchedVideos?.filter(v => v.completed).length ?? 0
      const totalVideos     = p.course?.totalVideos ?? p.watchedVideos?.length ?? 0
      const pct             = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0

      return {
        _id:               p._id,
        course:            p.course,
        completedVideos,
        totalVideos,
        pct,
        allVideosWatched:  p.allVideosWatched,
        quizPassed:        p.quizPassed,
        quizScore:         p.quizScore,
        bestScore:         p.bestScore,
        certificateIssued: p.certificateIssued,
        watchedVideos:     p.watchedVideos?.map(wv => ({
          videoId:         wv.videoId,
          completed:       wv.completed,
          watchedDuration: wv.watchedDuration,
          totalDuration:   wv.totalDuration,
        })) ?? []
      }
    })

    // ✅ Response — user info + progress saath mein
    res.json({
      success: true,
      user: {
        fullName: user.fullName,
        email:    user.email,
        avatar:   user.avatar,
        role:     user.role,
        city:     user.city,
      },
      totalCoursesStarted:   progressList.length,
      totalCoursesCompleted: progressList.filter(p => p.allVideosWatched).length,
      totalCertificates:     progressList.filter(p => p.certificateIssued).length,
      allProgress:           progressList
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}