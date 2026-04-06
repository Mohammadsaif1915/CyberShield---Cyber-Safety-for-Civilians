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

      {/* ✅ Fixed back button — always visible at top */}
      <div style={{
        position:   'sticky',
        top:        0,
        zIndex:     100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(79,70,229,0.1)',
        padding:    '10px 24px',
        display:    'flex',
        alignItems: 'center',
        gap:        12,
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          6,
            padding:      '8px 16px',
            background:   '#4F46E5',
            color:        '#fff',
            border:       'none',
            borderRadius: 10,
            cursor:       'pointer',
            fontSize:     13,
            fontWeight:   700,
            boxShadow:    '0 4px 12px rgba(79,70,229,0.25)',
            fontFamily:   'inherit',
            transition:   'opacity .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          ← Dashboard
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
          Learning Courses
        </span>
      </div>

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
                      <span className={`badge badge-${course.level?.toLowerCase()}`}>
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