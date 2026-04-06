import Course from '../models/Course.js'

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