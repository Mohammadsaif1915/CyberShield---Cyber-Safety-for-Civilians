import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import styles from './QuizPages.module.css'

const TOTAL_TIME = 15 * 60

// Shuffle options but keep track of correct answer
const shuffleOptions = (questions) => {
  return questions.map(q => {
    const optionsWithIndex = q.options.map((opt, i) => ({ opt, originalIndex: i }))
    for (let i = optionsWithIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]]
    }
    const newCorrectIndex = optionsWithIndex.findIndex(o => o.originalIndex === q.answer)
    return {
      ...q,
      options:       optionsWithIndex.map(o => o.opt),
      answer:        newCorrectIndex,
      originalOrder: optionsWithIndex.map(o => o.originalIndex)
    }
  })
}

// ── Helper: sync quiz result back to Dashboard's localStorage user ──
const syncResultToDashboard = (result, courseTitle) => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return
    const user = JSON.parse(raw)

    const totalCorrect   = result.score
    const totalQuestions = result.total
    const percentage     = Math.round((totalCorrect / totalQuestions) * 100)

    // Grade calculation
    const grade =
      percentage >= 90 ? 'A+' :
      percentage >= 80 ? 'A'  :
      percentage >= 70 ? 'B'  :
      percentage >= 60 ? 'C'  : 'D'

    // XP earned
    const xpEarned = result.passed
      ? Math.round(percentage * 2)   // max 200 XP on pass
      : Math.round(percentage * 0.5) // partial XP on fail

    // Update quizHistory — upsert by courseId
    const history = user.quizHistory || []
    const existingIdx = history.findIndex(h => h.moduleId === result.courseId)
    const newEntry = {
      moduleId:       result.courseId,
      moduleTitle:    courseTitle,
      totalCorrect,
      totalQuestions,
      percentage,
      grade,
      updatedAt:      new Date().toISOString(),
    }
    if (existingIdx >= 0) {
      history[existingIdx] = newEntry
    } else {
      history.unshift(newEntry)
    }

    // Recalculate avgScore from all history
    const allPcts  = history.map(h => h.percentage)
    const avgScore = Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length)

    // Update score — add points for this attempt
    const scoreGained = result.passed ? totalCorrect * 10 : totalCorrect * 3
    const newScore    = (user.score || 0) + scoreGained
    const newXP       = (user.xp   || 0) + xpEarned

    // Level up every 500 XP
    const newLevel = Math.floor(newXP / 500) + 1

    // Weekly activity — update today's entry
    const weeklyActivity = user.weeklyActivity || []
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'short' })
    const todayIdx = weeklyActivity.findIndex(w => w.d === today)
    if (todayIdx >= 0) {
      weeklyActivity[todayIdx].score = (weeklyActivity[todayIdx].score || 0) + scoreGained
      weeklyActivity[todayIdx].quiz  = (weeklyActivity[todayIdx].quiz  || 0) + 1
    } else {
      weeklyActivity.push({ d: today, score: scoreGained, quiz: 1 })
    }
    // Keep last 7 days only
    const last7 = weeklyActivity.slice(-7)

    // Domain scores — update based on courseTitle keywords
    const titleLower = (courseTitle || '').toLowerCase()
    const domainUpdate = {}
    if (titleLower.includes('phish'))   domainUpdate.phishingScore = Math.max(user.phishingScore || 0, percentage)
    if (titleLower.includes('malware')) domainUpdate.malwareScore  = Math.max(user.malwareScore  || 0, percentage)
    if (titleLower.includes('network')) domainUpdate.networkScore  = Math.max(user.networkScore  || 0, percentage)
    if (titleLower.includes('privacy')) domainUpdate.privacyScore  = Math.max(user.privacyScore  || 0, percentage)
    if (titleLower.includes('cloud'))   domainUpdate.cloudScore    = Math.max(user.cloudScore    || 0, percentage)

    // Recent activity log
    const recentActivity = [
      {
        msg:  `Quiz: "${courseTitle}" — ${grade} (${percentage}%) +${xpEarned} XP`,
        time: 'Just now',
      },
      ...(user.recentActivity || []).slice(0, 9),
    ]

    // Badges — check for new ones
    const badges = [...(user.badges || [])]
    const hasBadge = (label) => badges.some(b => (b.label || b) === label)

    if (result.passed && !hasBadge('First Pass'))
      badges.push({ emoji: '🎯', label: 'First Pass' })
    if (history.length >= 5 && !hasBadge('Quiz Veteran'))
      badges.push({ emoji: '🧠', label: 'Quiz Veteran' })
    if (percentage === 100 && !hasBadge('Perfect Score'))
      badges.push({ emoji: '💯', label: 'Perfect Score' })
    if (newScore >= 500 && !hasBadge('Score 500'))
      badges.push({ emoji: '⭐', label: 'Score 500' })
    if (newLevel >= 2 && !hasBadge('Level 2'))
      badges.push({ emoji: '🚀', label: 'Level 2' })

    const updatedUser = {
      ...user,
      score:          newScore,
      xp:             newXP,
      level:          newLevel,
      quizzesDone:    (user.quizzesDone || 0) + 1,
      avgScore,
      quizHistory:    history,
      weeklyActivity: last7,
      recentActivity,
      badges,
      ...domainUpdate,
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))
    console.log('[QuizPages] Dashboard synced:', { scoreGained, xpEarned, grade, percentage })
  } catch (err) {
    console.error('[QuizPages] Dashboard sync failed:', err)
  }
}

export default function QuizPages() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [questions,   setQuestions]   = useState([])
  const [courseTitle, setTitle]       = useState('')
  const [answers,     setAnswers]     = useState({})
  const [submitted,   setSubmitted]   = useState(false)
  const [result,      setResult]      = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [submitting,  setSubmitting]  = useState(false)
  const [timeLeft,    setTimeLeft]    = useState(TOTAL_TIME)
  const [current,     setCurrent]     = useState(0)

  const timerRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/quiz/${id}`)
        const shuffled = shuffleOptions(data.questions)
        setQuestions(shuffled)
        setTitle(data.courseTitle)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Cannot load quiz')
        navigate(`/courses/${id}`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (loading || submitted) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleSubmit(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [loading, submitted])

  const formatTime = (s) => {
    const m   = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const timerColor =
    timeLeft < 120 ? '#ef4444' :
    timeLeft < 300 ? '#f59e0b' :
    'var(--clr-accent)'

  const selectAnswer = (qIdx, optIdx) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  const handleSubmit = async (auto = false) => {
    if (submitting) return
    const answeredCount = Object.keys(answers).length
    if (!auto && answeredCount < questions.length) {
      const unanswered = questions.length - answeredCount
      if (!window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return
    }
    clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const answerArray = questions.map((q, i) => {
        const selected = answers[i]
        if (selected === undefined) return -1
        return q.originalOrder[selected]
      })
      const { data } = await api.post(`/quiz/${id}/submit`, { answers: answerArray })

      // ✅ FIX: sync result to Dashboard localStorage immediately
      syncResultToDashboard({ ...data, courseId: id }, courseTitle)

      setResult(data)
      setSubmitted(true)
      if (data.passed) toast.success('🎉 Congratulations! You passed!')
      else toast.error(`Score: ${data.score}/15. Need 8 to pass. Try again!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const answeredCount = Object.keys(answers).length

  // ── Back button (shown always) ──
  const BackBtn = () => (
    <button
      onClick={() => navigate('/dashboard')}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            6,
        padding:        '8px 16px',
        background:     '#4F46E5',
        color:          '#fff',
        border:         'none',
        borderRadius:   10,
        cursor:         'pointer',
        fontSize:       13,
        fontWeight:     700,
        marginBottom:   16,
        boxShadow:      '0 4px 12px rgba(79,70,229,0.25)',
        fontFamily:     'inherit',
        transition:     'opacity .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      ← Dashboard
    </button>
  )

  if (loading) return (
    <div className={styles.loadCenter}>
      <div className="spinner" />
      <p>Loading quiz…</p>
    </div>
  )

  // ── Result screen ──
  if (submitted && result) {
    const pct = Math.round((result.score / result.total) * 100)
    return (
      <div className={styles.resultPage}>
        <div className={styles.resultCard}>

          {/* ✅ Back to Dashboard button */}
          <div style={{ marginBottom: 8 }}>
            <BackBtn />
          </div>

          <div className={styles.resultIcon}>{result.passed ? '🎉' : '😔'}</div>
          <h2 className={styles.resultTitle}>
            {result.passed ? 'Quiz Passed!' : 'Quiz Failed'}
          </h2>
          <p className={styles.resultSub}>{courseTitle}</p>

          <div className={styles.scoreRing}>
            <svg viewBox="0 0 120 120" className={styles.ringsvg}>
              <circle cx="60" cy="60" r="50" fill="none"
                stroke="var(--clr-border)" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none"
                stroke={result.passed ? 'var(--clr-success)' : 'var(--clr-danger)'}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className={styles.ringCenter}>
              <span className={styles.scoreNum}>{result.score}</span>
              <span className={styles.scoreTotal}>/ {result.total}</span>
            </div>
          </div>

          <div className={styles.resultStats}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{pct}%</span>
              <span className={styles.statLabel}>Score</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{result.score}</span>
              <span className={styles.statLabel}>Correct</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{result.total - result.score}</span>
              <span className={styles.statLabel}>Wrong</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{result.attempts}</span>
              <span className={styles.statLabel}>Attempt</span>
            </div>
          </div>

          {!result.passed && (
            <p className={styles.passNote}>Minimum 8 correct answers required to pass.</p>
          )}

          <div className={styles.reviewSection}>
            <h3 className={styles.reviewHeading}>Answer Review</h3>
            <div className={styles.reviewList}>
              {result.results?.map((r, i) => {
                const q = questions[i]
                return (
                  <div key={i}
                    className={`${styles.reviewItem} ${r.isCorrect ? styles.reviewCorrect : styles.reviewWrong}`}
                  >
                    <div className={styles.reviewTop}>
                      <span className={styles.reviewNum}>Q{i + 1}</span>
                      <span className={styles.reviewIcon}>{r.isCorrect ? '✅' : '❌'}</span>
                    </div>
                    <p className={styles.reviewQ}>{r.question}</p>
                    <div className={styles.reviewAnswerRow}>
                      <span className={styles.reviewLabel}>Your answer:</span>
                      <span className={`${styles.reviewAnswer} ${r.isCorrect ? styles.answerRight : styles.answerWrong}`}>
                        {answers[i] !== undefined ? q.options[answers[i]] : 'Not answered'}
                      </span>
                    </div>
                    {!r.isCorrect && (
                      <div className={styles.reviewAnswerRow}>
                        <span className={styles.reviewLabel}>Correct answer:</span>
                        <span className={`${styles.reviewAnswer} ${styles.answerRight}`}>
                          {q.options[q.answer]}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.resultActions}>
            {result.passed ? (
              <button
                className="btn btn-lg"
                style={{ background: '#f59e0b', color: '#fff' }}
                onClick={() => navigate(`/courses/${id}/certificate`)}
              >
                🏆 Get Certificate
              </button>
            ) : (
              <button
                className="btn btn-accent btn-lg"
                onClick={() => {
                  setSubmitted(false)
                  setResult(null)
                  setAnswers({})
                  setCurrent(0)
                  setTimeLeft(TOTAL_TIME)
                  setQuestions(prev => shuffleOptions(
                    prev.map(q => ({
                      ...q,
                      options: q.originalOrder.map((_, idx) => q.options[idx])
                    }))
                  ))
                }}
              >
                🔄 Retry Quiz
              </button>
            )}
            <button
              className="btn btn-outline btn-lg"
              onClick={() => navigate(`/courses/${id}`)}
            >
              Back to Course
            </button>
            {/* ✅ Extra back to dashboard button in result actions */}
            <button
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/dashboard')}
            >
              🏠 Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Quiz screen ──
  const q = questions[current]

  return (
    <div className={styles.page}>
      <div className="container-sm">

        {/* ✅ Back button at top */}
        <BackBtn />

        <div className={styles.header}>
          <div>
            <h2 className={styles.quizTitle}>{courseTitle} — Quiz</h2>
            <p className={styles.quizSub}>{answeredCount} of {questions.length} answered</p>
          </div>
          <div className={styles.timer} style={{ color: timerColor, borderColor: timerColor }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        <div className={styles.quizProgress}>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
          </div>
          <span className={styles.progressText}>{answeredCount}/{questions.length}</span>
        </div>

        <div className={styles.qBubbles}>
          {questions.map((_, i) => (
            <button key={i}
              className={`${styles.qBubble}
                ${i === current    ? styles.qBubbleActive   : ''}
                ${answers[i] !== undefined ? styles.qBubbleAnswered : ''}
              `}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className={styles.questionCard}>
          <div className={styles.qNum}>Question {current + 1} of {questions.length}</div>
          <h3 className={styles.qText}>{q.question}</h3>

          <div className={styles.options}>
            {q.options.map((opt, oi) => {
              const selected = answers[current] === oi
              return (
                <button key={oi}
                  className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                  onClick={() => selectAnswer(current, oi)}
                >
                  <span className={styles.optLetter}>{String.fromCharCode(65 + oi)}</span>
                  <span className={styles.optText}>{opt}</span>
                  {selected && <span className={styles.optCheck}>✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.navRow}>
          <button className="btn btn-outline"
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            ← Previous
          </button>

          {current < questions.length - 1 ? (
            <button className="btn btn-primary"
              onClick={() => setCurrent(c => c + 1)}
            >
              Next →
            </button>
          ) : (
            <button className="btn btn-accent"
              onClick={() => handleSubmit()}
              disabled={submitting}
            >
              {submitting ? <span className="spinner spinner-sm" /> : null}
              {submitting ? 'Submitting…' : `Submit Quiz (${answeredCount}/${questions.length})`}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}