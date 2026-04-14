import Course    from '../models/Course.js'
import Progress  from '../models/Progress.js'
import QuizResult from '../models/QuizResult.js'
import User from '../models/User.js'

const getUserId = (req) => req.user._id

// GET /api/quiz/:courseId
export const getQuiz = async (req, res) => {
  try {
    const userId   = getUserId(req)
    const progress = await Progress.findOne({ user: userId, course: req.params.courseId })
    if (!progress?.allVideosWatched)
      return res.status(403).json({ success: false, message: 'Complete all videos before taking the quiz' })

    const course = await Course.findById(req.params.courseId).select('quiz title')
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

    const questions = course.quiz.map(q => ({
      _id:      q._id,
      question: q.question,
      options:  q.options
    }))

    res.json({ success: true, questions, courseTitle: course.title })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/quiz/:courseId/submit
export const submitQuiz = async (req, res) => {
  try {
    const userId      = getUserId(req)
    const { answers, timeSpent = 0 } = req.body

    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

    const progress = await Progress.findOne({ user: userId, course: req.params.courseId })
    if (!progress?.allVideosWatched)
      return res.status(403).json({ success: false, message: 'Complete all videos first' })

    let correct = 0
    const results = course.quiz.map((q, i) => {
      const isCorrect = answers[i] === q.answer
      if (isCorrect) correct++
      return { question: q.question, selected: answers[i], correct: q.answer, isCorrect }
    })

    const passed     = correct >= 8
    const percentage = Math.round((correct / course.quiz.length) * 100)

    // Update Progress model
    progress.quizAttempts++
    progress.quizScore = correct
    if (correct > progress.bestScore) progress.bestScore = correct
    if (passed) {
      progress.quizPassed  = true
      progress.completedAt = progress.completedAt || new Date()
    }
    await progress.save()

    // Save to QuizResult model for dashboard
    const quizResult = await QuizResult.create({
      user: userId,
      moduleId: parseInt(course._id.toString().slice(-2)) || Math.random() * 100,
      moduleTitle: course.title,
      totalCorrect: correct,
      totalQuestions: course.quiz.length,
      percentage,
      grade: percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'F',
      timeSpent: Math.round(timeSpent / 1000) || 0,
    })

    // Update user stats
    await User.updateOne(
      { _id: userId },
      {
        $inc: { quizzesDone: 1 },
        $set: { avgScore: percentage }
      }
    )

    console.log('[Quiz] User', userId, 'completed quiz for', course.title, 'Score:', percentage)

    res.json({ success: true, score: correct, total: course.quiz.length, percentage, passed, attempts: progress.quizAttempts, results })
  } catch (err) {
    console.error('[Quiz Submit Error]:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}