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
      const [coursesRes, progressRes] = await Promise.allSettled([
        api.get(`/courses?level=${level !== 'All' ? level : ''}&search=${search}`),
        api.get('/progress/all')
      ])

      if (coursesRes.status === 'fulfilled') {
        setCourses(coursesRes.value.data.courses ?? [])
      } else {
        console.error('Courses fetch failed:', coursesRes.reason)
        setCourses([])
      }

      if (progressRes.status === 'fulfilled') {
        const pMap = {}
        progressRes.value.data.allProgress?.forEach(p => {
          pMap[p.course?._id || p.course] = p
        })
        setProgress(pMap)
      }

    } catch (err) {
      console.error('Failed to load courses:', err)
      setCourses([])
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
    if (p.certificateIssued)   return { label: '🏆 Certified',     cls: styles.statusCert }
    if (p.quizPassed)          return { label: '✅ Passed Quiz',   cls: styles.statusPassed }
    if (p.allVideosWatched)    return { label: '🧠 Quiz Unlocked', cls: styles.statusQuiz }
    if (p.completedVideos > 0) return { label: '▶ In Progress',   cls: styles.statusProgress }
    return null
  }

  return (
    <div className={styles.page}>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div>
              <h1 className={styles.heroTitle}>
                Master <span style={{ color: '#38bdf8' }}>Cybersecurity</span>
              </h1>
              <p className={styles.heroSub}>
                Learn from industry experts with 25+ comprehensive courses covering all aspects of cyber security. Each course includes video lessons, practical exercises, and certificates upon completion.
              </p>
            </div>
            <div className={styles.heroBadge}>
              <div className={styles.heroBadgeNumber}>25+</div>
              <div className={styles.heroBadgeText}>Expert Courses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters Section */}
      <div className={styles.controlsSection}>
        <div className="container">
          <div className={styles.searchAndFilters}>
            {/* Search Bar */}
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search courses by name or topic…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              {search && (
                <button className={styles.clearBtn} onClick={() => setSearch('')} aria-label="Clear search">
                  ✕
                </button>
              )}
            </div>

            {/* Filters */}
            <div className={styles.filtersGroup}>
              <span className={styles.filterLabel}>Level:</span>
              <div className={styles.filterButtons}>
                {LEVELS.map(l => (
                  <button
                    key={l}
                    className={`${styles.filterBtn} ${level === l ? styles.filterActive : ''}`}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className={styles.resultsCount}>
              <span className={styles.countBadge}>
                {loading ? '...' : `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Loading State */}
        {loading && (
          <div className={styles.loadingWrap}>
            <div className="spinner" />
            <p>Loading courses…</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔎</div>
            <h3 className={styles.emptyTitle}>No courses found</h3>
            <p className={styles.emptyText}>Try adjusting your search or filter to find more courses.</p>
            <button
              onClick={() => { setSearch(''); setLevel('All') }}
              className={styles.resetButton}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Course Grid */}
        {!loading && courses.length > 0 && (
          <div className={styles.gridWrapper}>
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
                    {/* Card Accent Bar */}
                    <div className={styles.cardAccent} style={{ background: course.color }} />

                    {/* Card Header with Icon */}
                    <div className={styles.cardHeader}>
                      <div className={styles.iconBox} style={{ background: `${course.color}15`, borderLeft: `3px solid ${course.color}` }}>
                        <span className={styles.courseIcon}>{course.icon}</span>
                      </div>
                      {status && (
                        <span className={`${styles.statusBadge} ${status.cls}`}>
                          {status.label}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className={styles.cardBody}>
                      <div className={styles.badgeRow}>
                        <span className={`badge badge-${course.level?.toLowerCase() || 'beginner'}`}>
                          {course.level}
                        </span>
                        <span className={styles.duration}>💾 {course.totalVideos} videos</span>
                      </div>

                      <h3 className={styles.courseTitle}>{course.title}</h3>
                      <p className={styles.courseDesc}>{course.description}</p>

                      <div className={styles.courseMeta}>
                        <span>⏱️ {course.totalVideos * 15} min estimated</span>
                      </div>
                    </div>

                    {/* Progress Section */}
                    {pct > 0 && (
                      <div className={styles.progressSection}>
                        <div className="progress-bar-wrap">
                          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className={styles.progressText}>{pct}% complete</span>
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className={styles.cardFooter}>
                      <button
                        className={`btn ${pct > 0 ? 'btn-accent' : 'btn-primary'} btn-sm`}
                        onClick={e => { e.stopPropagation(); navigate(`/courses/${course._id}`) }}
                      >
                        {pct === 0 ? '▶ Start Course' : pct === 100 ? '✅ Review' : '→ Continue'}
                      </button>
                      {pct > 0 && (
                        <div className={styles.progressBadge}>{pct}%</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}