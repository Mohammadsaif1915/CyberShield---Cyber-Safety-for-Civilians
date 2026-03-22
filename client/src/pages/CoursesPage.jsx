import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import styles from './CoursesPage.module.css'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function CoursesPage() {
  const [courses,  setCourses]  = useState([])
  const [progress, setProgress] = useState({})
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [level,    setLevel]    = useState('All')
  const navigate = useNavigate()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (level !== 'All') params.set('level', level)
      if (search.trim())   params.set('search', search.trim())
      const query = params.toString() ? `?${params.toString()}` : ''

      const [coursesRes, progressRes] = await Promise.all([
        api.get(`/courses${query}`),
        api.get('/progress/all')
      ])

      // Guard: API may return array directly or nested under .courses
      const rawCourses = coursesRes.data?.courses ?? coursesRes.data
      setCourses(Array.isArray(rawCourses) ? rawCourses : [])

      // Guard: API may return array directly or nested under .allProgress
      const rawProgress = progressRes.data?.allProgress ?? progressRes.data
      const progressList = Array.isArray(rawProgress) ? rawProgress : []
      const pMap = {}
      progressList.forEach(p => {
        if (p && (p.course?._id || p.course)) {
          pMap[p.course?._id || p.course] = p
        }
      })
      setProgress(pMap)

    } catch (err) {
      console.error('Failed to load courses:', err)
      setCourses([])
      setProgress({})
    } finally {
      setLoading(false)
    }
  }, [level, search])

  useEffect(() => {
    const timer = setTimeout(fetchData, 300)
    return () => clearTimeout(timer)
  }, [fetchData])

  const getProgressPercent = (courseId, totalVideos) => {
    const p = progress[courseId]
    if (!p || !totalVideos) return 0
    return Math.round((p.completedVideos / totalVideos) * 100)
  }

  const getStatusLabel = (courseId) => {
    const p = progress[courseId]
    if (!p) return null
    if (p.certificateIssued) return { label: '🏆 Certified',      cls: styles.statusCert }
    if (p.quizPassed)        return { label: '✅ Passed Quiz',    cls: styles.statusPassed }
    if (p.allVideosWatched)  return { label: '🧠 Quiz Unlocked',  cls: styles.statusQuiz }
    if (p.completedVideos > 0) return { label: '▶ In Progress',  cls: styles.statusProgress }
    return null
  }

  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Master <span>Cybersecurity</span><br />One Course at a Time
          </h1>
          <p className={styles.heroSub}>
            25+ expert-crafted courses with video lessons, quizzes, and certificates.
          </p>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search courses…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Filters */}
        <div className={styles.filters}>
          <span className={styles.filterLabel}>Filter by level:</span>
          {LEVELS.map(l => (
            <button
              key={l}
              className={`${styles.filterBtn} ${level === l ? styles.filterActive : ''}`}
              onClick={() => setLevel(l)}
            >
              {l}
            </button>
          ))}
          <span className={styles.countBadge}>
            {loading ? '…' : `${courses.length} courses`}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className={styles.loadingWrap}>
            <div className="spinner" />
            <p>Loading courses…</p>
          </div>
        )}

        {/* Empty */}
        {!loading && courses.length === 0 && (
          <div className="empty-state fade-up">
            <div className="icon">🔎</div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        )}

        {/* Course Grid */}
        {!loading && courses.length > 0 && (
          <div className={styles.grid}>
            {courses.map((course, i) => {
              const pct    = getProgressPercent(course._id, course.totalVideos)
              const status = getStatusLabel(course._id)
              return (
                <div
                  key={course._id}
                  className={`${styles.courseCard} fade-up`}
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/courses/${course._id}`)}
                >
                  <div className={styles.cardAccent} style={{ background: course.color }} />

                  <div className={styles.cardThumb} style={{ background: `${course.color}18` }}>
                    <span className={styles.courseIcon}>{course.icon}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <span className={`badge badge-${course.level.toLowerCase()}`}>
                        {course.level}
                      </span>
                      {status && (
                        <span className={`${styles.statusTag} ${status.cls}`}>{status.label}</span>
                      )}
                    </div>

                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <p className={styles.courseDesc}>{course.description}</p>

                    <div className={styles.courseMeta}>
                      <span>📹 {course.totalVideos} videos</span>
                      <span>📝 15 questions</span>
                    </div>

                    {pct > 0 && (
                      <div className={styles.progressWrap}>
                        <div className="progress-bar-wrap">
                          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className={styles.progressPct}>{pct}%</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <button
                      className={`btn ${pct > 0 ? 'btn-accent' : 'btn-primary'} btn-sm`}
                      onClick={e => { e.stopPropagation(); navigate(`/courses/${course._id}`) }}
                    >
                      {pct === 0 ? 'Start Course' : pct === 100 ? 'Review' : 'Continue'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}