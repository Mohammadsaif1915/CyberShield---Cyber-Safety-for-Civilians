import Course    from '../models/Course.js'
import Progress  from '../models/Progress.js'
import mongoose  from 'mongoose'

const TEMP_USER_ID = '000000000000000000000001'
const getTempUser  = () => new mongoose.Types.ObjectId(TEMP_USER_ID)

export const getQuiz = async (req, res) => {
  try {
    const userId   = getTempUser()
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

export const submitQuiz = async (req, res) => {
  try {
    const userId  = getTempUser()
    const { answers } = req.body

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

    progress.quizAttempts++
    progress.quizScore = correct
    if (correct > progress.bestScore) progress.bestScore = correct
    if (passed) {
      progress.quizPassed  = true
      progress.completedAt = progress.completedAt || new Date()
    }
    await progress.save()

    res.json({ success: true, score: correct, total: course.quiz.length, percentage, passed, attempts: progress.quizAttempts, results })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}