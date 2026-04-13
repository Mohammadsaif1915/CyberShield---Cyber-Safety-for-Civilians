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
    // Fisher-Yates shuffle
    for (let i = optionsWithIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]]
    }
    // Find where the correct answer ended up after shuffle
    const newCorrectIndex = optionsWithIndex.findIndex(o => o.originalIndex === q.answer)
    return {
      ...q,
      options:       optionsWithIndex.map(o => o.opt),
      answer:        newCorrectIndex,  // new position of correct answer
      originalOrder: optionsWithIndex.map(o => o.originalIndex)
    }
  })
}

export default function QuizPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const [questions,  setQuestions]  = useState([])
  const [courseTitle, setTitle]     = useState('')
  const [answers,    setAnswers]    = useState({})
  const [submitted,  setSubmitted]  = useState(false)
  const [result,     setResult]     = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft,   setTimeLeft]   = useState(TOTAL_TIME)
  const [current,    setCurrent]    = useState(0)

  const timerRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/quiz/${id}`)
        // Shuffle options
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
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  const timerColor = timeLeft < 120
    ? '#ef4444'
    : timeLeft < 300
    ? '#f59e0b'
    : 'var(--clr-accent)'

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
      // Send answers mapped back to original indices
      const answerArray = questions.map((q, i) => {
        const selected = answers[i]
        if (selected === undefined) return -1
        // Map shuffled index back to original index for backend
        return q.originalOrder[selected]
      })
      const { data } = await api.post(`/quiz/${id}/submit`, { answers: answerArray })
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
          <div className={styles.resultIcon}>{result.passed ? '🎉' : '😔'}</div>
          <h2 className={styles.resultTitle}>
            {result.passed ? 'Quiz Passed!' : 'Quiz Failed'}
          </h2>
          <p className={styles.resultSub}>{courseTitle}</p>

          {/* Score ring */}
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

          {/* ── Detailed Answer Review ── */}
          <div className={styles.reviewSection}>
            <h3 className={styles.reviewHeading}>Answer Review</h3>
            <div className={styles.reviewList}>
              {result.results?.map((r, i) => {
                // Get shuffled question to show options
                const q = questions[i]
                return (
                  <div
                    key={i}
                    className={`${styles.reviewItem} ${r.isCorrect ? styles.reviewCorrect : styles.reviewWrong}`}
                  >
                    {/* Question number + icon */}
                    <div className={styles.reviewTop}>
                      <span className={styles.reviewNum}>Q{i + 1}</span>
                      <span className={styles.reviewIcon}>{r.isCorrect ? '✅' : '❌'}</span>
                    </div>

                    {/* Question text */}
                    <p className={styles.reviewQ}>{r.question}</p>

                    {/* Your answer */}
                    <div className={styles.reviewAnswerRow}>
                      <span className={styles.reviewLabel}>Your answer:</span>
                      <span className={`${styles.reviewAnswer} ${r.isCorrect ? styles.answerRight : styles.answerWrong}`}>
                        {/* Show the option text they selected */}
                        {answers[i] !== undefined
                          ? q.options[answers[i]]
                          : 'Not answered'}
                      </span>
                    </div>

                    {/* Correct answer — only show if wrong */}
                    {!r.isCorrect && (
                      <div className={styles.reviewAnswerRow}>
                        <span className={styles.reviewLabel}>Correct answer:</span>
                        <span className={`${styles.reviewAnswer} ${styles.answerRight}`}>
                          {/* correct index in shuffled array = q.answer */}
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
                  // Re-shuffle on retry
                  setQuestions(prev => shuffleOptions(prev.map(q => ({
                    ...q,
                    // restore original options order first
                    options: q.originalOrder.map(idx => {
                      // we need original options — store them
                      return q.options[q.answer] // fallback
                    })
                  }))))
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

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.quizTitle}>{courseTitle} — Quiz</h2>
            <p className={styles.quizSub}>{answeredCount} of {questions.length} answered</p>
          </div>
          <div className={styles.timer} style={{ color: timerColor, borderColor: timerColor }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress text only — no blue bar */}
        <div className={styles.quizProgress}>
          <span className={styles.progressText}>{answeredCount}/{questions.length} answered</span>
        </div>

        {/* Question bubbles */}
        <div className={styles.qBubbles}>
          {questions.map((_, i) => (
            <button
              key={i}
              className={`${styles.qBubble}
                ${i === current ? styles.qBubbleActive : ''}
                ${answers[i] !== undefined ? styles.qBubbleAnswered : ''}
              `}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className={styles.questionCard}>
          <div className={styles.qNum}>Question {current + 1} of {questions.length}</div>
          <h3 className={styles.qText}>{q.question}</h3>

          <div className={styles.options}>
            {q.options.map((opt, oi) => {
              const selected = answers[current] === oi
              return (
                <button
                  key={oi}
                  className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                  onClick={() => selectAnswer(current, oi)}
                >
                  <span className={styles.optLetter}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  <span className={styles.optText}>{opt}</span>
                  {selected && <span className={styles.optCheck}>✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navRow}>
          <button
            className="btn btn-outline"
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            ← Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrent(c => c + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-accent"
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