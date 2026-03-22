import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import styles from './CourseDetailPage.module.css'

// ══════════════════════════════════════════════════════════════════════
// APNE REAL VIDEO LINKS YAHAN LAGAO
// Har course ke 5 videos ke MP4 links
// ══════════════════════════════════════════════════════════════════════
const COURSE_VIDEOS = {
  'Phishing Attacks':          ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Malware Analysis':          ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Ransomware':                ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Social Engineering':        ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Password Security':         ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Network Security Basics':   ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Firewall & IDS/IPS':        ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Encryption & Cryptography': ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Ethical Hacking':           ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'SQL Injection':             ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'XSS Attacks':               ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Man-in-the-Middle Attack':  ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'DoS & DDoS Attacks':        ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'VPN Security':              ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Wi-Fi Hacking & Security':  ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Cyber Laws & Compliance':   ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Digital Forensics':         ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Identity Theft':            ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Spyware & Adware':          ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Trojans & Backdoors':       ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Rootkits':                  ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Cloud Security':            ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Mobile Security':           ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Email Security':            ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
  'Zero-Day Attacks':          ['https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4','https://www.w3schools.com/html/mov_bbb.mp4'],
}

const DEFAULT_LINKS = ['https://www.w3schools.com/html/mov_bbb.mp4']

const getVideoLink = (courseTitle, videoIndex) => {
  const links = COURSE_VIDEOS[courseTitle] || DEFAULT_LINKS
  return links[videoIndex] || links[0]
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course,     setCourse]     = useState(null)
  const [progress,   setProgress]   = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [activeIdx,  setActiveIdx]  = useState(0)
  const [isPlaying,  setIsPlaying]  = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,   setDuration]   = useState(0)

  const videoRef      = useRef(null)
  const progressRef   = useRef(null)
  const saveTimerRef  = useRef(null)
  const isCompleting  = useRef(false)
  const maxReachedRef = useRef(0) // Max position reached — rewatch prevent

  // ── Load course + progress ────────────────────────────────────────────────
  useEffect(() => {
  if (!id) return  // ← ADD THIS ONE LINE
  const load = async () => {
    setLoading(true)
    try {
      const [cRes, pRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/progress/${id}`)
      ])
        setCourse(cRes.data.course)
        setProgress(pRes.data.progress)
        progressRef.current = pRes.data.progress
        const firstUnwatched = pRes.data.progress.watchedVideos.findIndex(v => !v.completed)
        setActiveIdx(firstUnwatched >= 0 ? firstUnwatched : 0)
      } catch (err) {
        toast.error('Failed to load course')
        navigate('/courses')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // ── Reset when video changes ──────────────────────────────────────────────
  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    isCompleting.current = false

    // Load existing progress for this video
    if (course && progressRef.current) {
      const video    = course.videos[activeIdx]
      const existing = progressRef.current?.watchedVideos?.find(wv => {
        const wid = wv.videoId?._id?.toString() || wv.videoId?.toString()
        return wid === video?._id?.toString()
      })
      maxReachedRef.current = existing?.watchedDuration || 0
    }

    if (saveTimerRef.current) clearInterval(saveTimerRef.current)
  }, [activeIdx, course])

  // ── Save progress periodically when playing ───────────────────────────────
  useEffect(() => {
    if (saveTimerRef.current) clearInterval(saveTimerRef.current)

    if (isPlaying) {
      saveTimerRef.current = setInterval(() => {
        saveCurrentProgress()
      }, 10000) // Save every 10 seconds
    }

    return () => { if (saveTimerRef.current) clearInterval(saveTimerRef.current) }
  }, [isPlaying, activeIdx])

  // ── Save progress to backend ──────────────────────────────────────────────
  const saveCurrentProgress = async (forceComplete = false) => {
    if (!course || !videoRef.current) return
    const video       = course.videos[activeIdx]
    const videoDur    = videoRef.current.duration || video.duration || 300
    const watched     = forceComplete ? videoDur : maxReachedRef.current

    try {
      const { data } = await api.post(`/progress/${id}/video`, {
        videoId:         video._id,
        watchedDuration: Math.floor(watched),
        totalDuration:   Math.floor(videoDur)
      })
      setProgress(data.progress)
      progressRef.current = data.progress
    } catch (err) { console.error('Save error:', err) }
  }

  // ── Video event handlers ──────────────────────────────────────────────────

  // Video metadata loaded — get real duration
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    const realDuration = videoRef.current.duration
    setDuration(realDuration)

    // Restore previous position (where user left off)
    const video    = course?.videos[activeIdx]
    const existing = progressRef.current?.watchedVideos?.find(wv => {
      const wid = wv.videoId?._id?.toString() || wv.videoId?.toString()
      return wid === video?._id?.toString()
    })
    if (existing?.watchedDuration > 0 && !existing?.completed) {
      videoRef.current.currentTime = existing.watchedDuration
    }
  }

  // timeupdate — fires as video plays
  // Track maxReached — this prevents rewatch from inflating count
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const ct = videoRef.current.currentTime
    setCurrentTime(ct)

    // Only update maxReached if moving forward
    if (ct > maxReachedRef.current) {
      maxReachedRef.current = ct
    }

    // Check completion — based on real video position not timer
    const vid     = videoRef.current
    const vidDur  = vid.duration || duration
    if (vidDur > 0 && ct >= vidDur * 0.95 && !isCompleting.current) {
      isCompleting.current = true
      handleVideoComplete()
    }
  }

  // Video completed
  const handleVideoComplete = async () => {
    if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    await saveCurrentProgress(true)

    const video = course.videos[activeIdx]
    toast.success(`✅ "${video.title}" completed!`)

    if (activeIdx < course.videos.length - 1) {
      setTimeout(() => {
        changeVideo(activeIdx + 1)
      }, 1500)
    }
  }

  // Play / pause
  const handlePlay  = () => setIsPlaying(true)
  const handlePause = () => {
    setIsPlaying(false)
    saveCurrentProgress() // Save on pause
  }

  // Seeking — prevent skipping forward beyond maxReached
  const handleSeeking = () => {
    if (!videoRef.current) return
    const video    = course?.videos[activeIdx]
    const existing = progressRef.current?.watchedVideos?.find(wv => {
      const wid = wv.videoId?._id?.toString() || wv.videoId?.toString()
      return wid === video?._id?.toString()
    })

    // If already completed — allow free seeking
    if (existing?.completed) return

    const maxAllowed = maxReachedRef.current + 3 // 3 sec tolerance
    if (videoRef.current.currentTime > maxAllowed) {
      videoRef.current.currentTime = maxReachedRef.current
      toast('⛔ You cannot skip forward!', { icon: '🔒', duration: 2000 })
    }
  }

  // Change video
  const changeVideo = (idx) => {
    if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    isCompleting.current  = false
    maxReachedRef.current = 0
    setActiveIdx(idx)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const activeVideo    = course?.videos[activeIdx]
  const completedCount = progress?.completedVideos || 0
  const totalVideos    = course?.videos?.length || 0
  const pct            = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0

  const vidDuration = duration || activeVideo?.duration || 300
  const timerPct    = Math.min(100, Math.round((maxReachedRef.current / vidDuration) * 100))
  const formatTime  = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`

  const isVideoCompleted = (videoId) => {
    const vid = videoId?._id?.toString() || videoId?.toString()
    return progress?.watchedVideos?.find(v => {
      const wid = v.videoId?._id?.toString() || v.videoId?.toString()
      return wid === vid
    })?.completed || false
  }

  const getWatchedPct = (videoId, dur) => {
    const vid = videoId?._id?.toString() || videoId?.toString()
    const wv  = progress?.watchedVideos?.find(v => {
      const wid = v.videoId?._id?.toString() || v.videoId?.toString()
      return wid === vid
    })
    if (!wv || !dur) return 0
    return Math.min(100, Math.round((wv.watchedDuration / dur) * 100))
  }

  if (loading) return (
    <div className={styles.loadCenter}>
      <div className="spinner" />
      <p>Loading course…</p>
    </div>
  )
  if (!course) return null

  const currentVideoLink = getVideoLink(course.title, activeIdx)
  const videoDone        = isVideoCompleted(activeVideo?._id)

  return (
    <div className={styles.page}>

      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topInner}`}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/courses')}>
            ← Back
          </button>
          <div className={styles.topMeta}>
            <span className={styles.topIcon}>{course.icon}</span>
            <div>
              <h2 className={styles.topTitle}>{course.title}</h2>
              <span className={`badge badge-${course.level.toLowerCase()}`}>{course.level}</span>
            </div>
          </div>
          <div className={styles.topProgress}>
            <div className="progress-bar-wrap" style={{ width: 160 }}>
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className={styles.topPct}>{completedCount}/{totalVideos} videos</span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className={`container ${styles.layout}`}>

        {/* Left: video player */}
        <div className={styles.playerSide}>
          <div className={styles.playerWrap}>

            {/* Video player */}
            <div className={styles.videoFrame}>
              <video
                ref={videoRef}
                key={`video-${activeIdx}-${course.title}`}
                src={currentVideoLink}
                controls
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onSeeking={handleSeeking}
                onEnded={handleVideoComplete}
                onContextMenu={e => e.preventDefault()}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  background: '#000'
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video title */}
            <div className={styles.videoInfo}>
              <div>
                <h3 className={styles.videoTitle}>{activeVideo?.title}</h3>
                <p className={styles.videoMeta}>
                  Video {activeIdx + 1} of {totalVideos}
                  {videoDone && (
                    <span className={styles.completedTag}>✅ Completed</span>
                  )}
                  {isPlaying && !videoDone && (
                    <span className={styles.playingTag}>▶ Playing</span>
                  )}
                </p>
              </div>
            </div>

            {/* Progress bar — based on real video position */}
            <div className={styles.timerWrap}>
              <div className={styles.timerBar}>
                <div
                  className={styles.timerFill}
                  style={{ width: `${videoDone ? 100 : timerPct}%` }}
                />
              </div>
              <span className={styles.timerText}>
                {videoDone
                  ? '✅ Video Completed!'
                  : duration > 0
                  ? `${formatTime(currentTime)} / ${formatTime(duration)} — ${timerPct}% watched`
                  : 'Loading video…'}
              </span>
            </div>

            <div className={styles.restrictionNote}>
              🔒 Forward skipping is disabled. Watch fully to unlock next video & quiz.
            </div>
          </div>

          {/* Quiz / Certificate banner */}
          {progress?.allVideosWatched && (
            <div className={styles.quizBanner}>
              <div>
                <h4>🎉 All videos completed!</h4>
                <p>
                  {progress.quizPassed
                    ? 'Quiz passed! Claim your certificate.'
                    : 'Take the quiz now (need 8/15 to pass).'}
                </p>
              </div>
              {!progress.quizPassed ? (
                <button
                  className="btn btn-accent btn-lg"
                  onClick={() => navigate(`/courses/${id}/quiz`)}
                >
                  Take Quiz →
                </button>
              ) : (
                <button
                  className="btn btn-lg"
                  style={{ background: '#f59e0b', color: '#fff' }}
                  onClick={() => navigate(`/courses/${id}/certificate`)}
                >
                  🏆 Get Certificate
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHead}>
            <h4 className={styles.sidebarTitle}>Course Content</h4>
            <span className={styles.sidebarCount}>{completedCount}/{totalVideos} completed</span>
          </div>

          <div className={styles.videoList}>
            {course.videos.map((video, idx) => {
              const done   = isVideoCompleted(video._id)
              const active = idx === activeIdx
              const wpct   = getWatchedPct(video._id, video.duration)
              return (
                <div
                  key={video._id}
                  className={`${styles.videoItem} ${active ? styles.videoItemActive : ''} ${done ? styles.videoItemDone : ''}`}
                  onClick={() => changeVideo(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && changeVideo(idx)}
                >
                  <div className={styles.videoNum}>
                    {done ? '✅' : active ? '▶' : idx + 1}
                  </div>
                  <div className={styles.videoItemInfo}>
                    <span className={styles.videoItemTitle}>{video.title}</span>
                    <div className={styles.videoItemMeta}>
                      <span>
                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')} min
                      </span>
                      {wpct > 0 && !done && (
                        <div className={styles.miniProgress}>
                          <div style={{ width: `${wpct}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className={styles.sidebarQuiz}>
            <div className={`${styles.quizStatus} ${progress?.allVideosWatched ? styles.quizUnlocked : styles.quizLocked}`}>
              {progress?.allVideosWatched ? '🧠' : '🔒'}
              <div>
                <strong>{progress?.allVideosWatched ? 'Quiz Unlocked' : 'Quiz Locked'}</strong>
                <span>
                  {progress?.quizPassed
                    ? `Passed (${progress.quizScore}/15)`
                    : progress?.allVideosWatched
                    ? 'Ready to attempt'
                    : `Watch all ${totalVideos} videos first`}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}