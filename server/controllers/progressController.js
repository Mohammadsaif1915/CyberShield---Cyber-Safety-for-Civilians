import Progress  from '../models/Progress.js'
import Course    from '../models/Course.js'
import User      from '../models/User.js'

const getUserId = (req) => req.user._id

const getUserEmail = async (req) => {
  if (req.user && req.user.email) return req.user.email
  if (req.user && req.user._id) {
    try {
      const user = await User.findById(req.user._id).select('email')
      return user?.email || ''
    } catch { return '' }
  }
  return ''
}

// GET /api/progress/:courseId
export const getProgress = async (req, res) => {
  try {
    const userId = getUserId(req)
    let progress = await Progress.findOne({ user: userId, course: req.params.courseId })

    if (!progress) {
      const course = await Course.findById(req.params.courseId)
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' })
      const email = await getUserEmail(req)
      progress = await Progress.create({
        user:       userId,
        course:     req.params.courseId,
        userEmail:  email,
        courseName: course.title,
        watchedVideos: course.videos.map(v => ({
          videoId:         v._id,
          videoName:       v.title,
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

// POST /api/progress/:courseId/video
export const updateVideoProgress = async (req, res) => {
  try {
    const userId = getUserId(req)
    const { videoId, watchedDuration, totalDuration } = req.body

    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

    let progress = await Progress.findOne({ user: userId, course: req.params.courseId })

    if (!progress) {
      const email = await getUserEmail(req)
      progress = await Progress.create({
        user:       userId,
        course:     req.params.courseId,
        userEmail:  email,
        courseName: course.title,
        watchedVideos: course.videos.map(v => ({
          videoId:         v._id,
          videoName:       v.title,
          watchedDuration: 0,
          totalDuration:   v.duration,
          completed:       false
        }))
      })
    }

    if (!progress.userEmail) {
      const email = await getUserEmail(req)
      if (email) progress.userEmail = email
    }
    if (!progress.courseName) progress.courseName = course.title

    const idx = progress.watchedVideos.findIndex(
      wv => wv.videoId.toString() === videoId.toString()
    )

    const isCompleted = totalDuration > 0 && watchedDuration >= totalDuration * 0.95
    const videoDoc    = course.videos.find(v => v._id.toString() === videoId.toString())
    const videoName   = videoDoc?.title || ''

    progress.currentVideoName = videoName

    if (idx > -1) {
      if (watchedDuration > progress.watchedVideos[idx].watchedDuration)
        progress.watchedVideos[idx].watchedDuration = watchedDuration
      progress.watchedVideos[idx].completed = isCompleted
      if (!progress.watchedVideos[idx].videoName)
        progress.watchedVideos[idx].videoName = videoName
    } else {
      progress.watchedVideos.push({ videoId, videoName, watchedDuration, totalDuration, completed: isCompleted })
    }

    progress.completedVideos  = progress.watchedVideos.filter(v => v.completed).length
    progress.allVideosWatched = progress.completedVideos >= course.videos.length
    
    // AUTO-MARK AS QUIZ PASSED WHEN ALL VIDEOS WATCHED (for dashboard)
    if (progress.allVideosWatched && !progress.quizPassed) {
      progress.quizPassed = true
      progress.completedAt = new Date()
      console.log('[Course] All videos watched, marking course as completed for dashboard. User:', userId, 'Course:', course.title)
    }
    
    await progress.save()

    res.json({ success: true, progress })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/progress/all
export const getAllProgress = async (req, res) => {
  try {
    const userId = getUserId(req)
    
    // 1. Pehle fetch karo
    const allProgress = await Progress.find({ user: userId })
      .populate('course', 'title level totalVideos icon color')
      .lean()

    // 2. Phir filter karo
    const valid = allProgress.filter(p => p.course !== null)

    // 3. valid.map use karo, allProgress.map nahi
    const fixed = valid.map(p => {
      const completedVideos = p.watchedVideos?.filter(v => v.completed).length || 0
      const totalVideos     = p.course?.totalVideos || p.watchedVideos?.length || 0
      const pct             = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0
      return { ...p, completedVideos, totalVideos, pct }
    })

    res.json({ success: true, allProgress: fixed })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}