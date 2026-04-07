import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [allProgress,  setAllProgress]  = useState([])
  const [certificates, setCertificates] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [downloading,  setDownloading]  = useState(null)
  const certRefs = useRef({})

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          api.get('/progress/all'),
          api.get('/certificate/my')
        ])
        setAllProgress(pRes.data.allProgress)
        setCertificates(cRes.data.certificates)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDownload = async (cert) => {
    setDownloading(cert._id)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF }                = await import('jspdf')
      const el = certRefs.current[cert._id]
      if (!el) return
      const canvas = await html2canvas(el, { scale: 3, backgroundColor: '#fff' })
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210)
      pdf.save(`CyberLearn_${cert.certificateId}.pdf`)
      toast.success('Downloaded! 🎉')
    } catch { toast.error('Download failed') }
    finally { setDownloading(null) }
  }

  const completedCourses = allProgress.filter(p => p.quizPassed).length
  const inProgress = allProgress.filter(p => p.completedVideos > 0 && !p.quizPassed).length

  return (
    <div className={styles.page}>
      <div className="container">

        {/* Stats */}
        <div className={styles.statsGrid}>
          {[
            { icon:'📚', num: allProgress.length, label:'Enrolled' },
            { icon:'▶️', num: inProgress,          label:'In Progress' },
            { icon:'✅', num: completedCourses,    label:'Completed' },
            { icon:'🏆', num: certificates.length, label:'Certificates' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Certificates */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🏆 My Certificates</h2>
          {loading ? (
            <div style={{ textAlign:'center', padding:40 }}><div className="spinner"/></div>
          ) : certificates.length === 0 ? (
            <div className={styles.emptyBox}>
              <span>🎓</span>
              <p>No certificates yet. Complete a course and pass the quiz!</p>
              <button className="btn btn-primary" onClick={() => navigate('/courses')}>
                Browse Courses
              </button>
            </div>
          ) : (
            <div className={styles.certGrid}>
              {certificates.map(cert => (
                <div key={cert._id} className={styles.certCard}>

                  {/* CERTIFICATE */}
                  <div ref={el => certRefs.current[cert._id] = el} className={styles.certificate}>

                    <div className={styles.topStrip} />

                    {/* LEFT */}
                    <div className={styles.certLeft}>

                      {/* Brand */}
                      <div className={styles.brandRow}>
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                          <path d="M14 2L4 7V14C4 19.5 8.5 24.6 14 26C19.5 24.6 24 19.5 24 14V7L14 2Z"
                            fill="#0f4c81" stroke="#b8960c" strokeWidth="1.5"/>
                          <path d="M10 14L13 17L18 11" stroke="white" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className={styles.brandName}>CyberLearn</span>
                        <span className={styles.brandPipe}> | </span>
                        <span className={styles.brandSub}>CyberShield</span>
                      </div>

                      {/* Heading */}
                      <p className={styles.certOf}>CERTIFICATE OF</p>
                      <h1 className={styles.certCompletion}>COMPLETION</h1>
                      <div className={styles.goldLine} />

                      {/* Name */}
                      <h2 className={styles.recipientName}>{cert.recipientName}</h2>
                      <div className={styles.nameLine} />

                      {/* 1 line content */}
                      <p className={styles.certBodyText}>
                        has successfully completed: <strong>{cert.courseTitle}</strong>
                      </p>

                      {/* Footer */}
                      <div className={styles.certFooterRow}>
                        <div>
                          <p className={styles.certDate}>
                            {new Date(cert.issuedAt).toLocaleDateString('en-IN', {
                              day:'numeric', month:'long', year:'numeric'
                            })}
                          </p>
                          <p className={styles.certCode}>
                            Certificate code: <strong>{cert.certificateId}</strong>
                          </p>
                        </div>

                        {/* Shahim Signature */}
                        <div className={styles.sigBlock}>
                          <svg className={styles.sigSvg} viewBox="0 0 200 80" fill="none">
                            {/* Big loops at start - Sa */}
                            <path d="M8 60 C12 30, 22 15, 28 35 C32 48, 26 62, 34 50 C40 40, 36 18, 48 26 C56 32, 50 55, 60 42 C67 32, 62 14, 75 22 C84 28, 78 52, 88 38 C96 26, 90 10, 104 18 C114 24, 108 50, 120 36 C128 24, 122 8, 138 16 C148 22, 142 46, 155 34 C163 25, 160 12, 172 20 C180 26, 177 42, 185 35"
                              stroke="#0a0a2e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            {/* Underline */}
                            <path d="M6 70 C40 64, 80 68, 120 65 C155 62, 175 66, 192 63"
                              stroke="#0a0a2e" strokeWidth="2" strokeLinecap="round" fill="none"/>
                            {/* Extra flourish */}
                            <path d="M24 35 C20 25, 28 18, 34 26 C38 32, 32 42, 26 38"
                              stroke="#0a0a2e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                            <path d="M46 26 C42 16, 52 10, 58 18 C62 24, 56 34, 48 30"
                              stroke="#0a0a2e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                          </svg>
                          <p className={styles.sigName}>Shahim</p>
                          <p className={styles.sigTitle}>CEO, CyberShield</p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT dark panel */}
                    <div className={styles.certRight}>
                      <div className={styles.rightTopGold} />
                      <div className={styles.rightTopGold2} />

                      {/* CS Shield logo */}
                      <div className={styles.csShield}>
                        <svg width="58" height="66" viewBox="0 0 58 66" fill="none">
                          <path d="M29 3L4 13V31C4 48 15 60 29 64C43 60 54 48 54 31V13L29 3Z"
                            fill="rgba(255,255,255,0.1)" stroke="#f0c040" strokeWidth="2"/>
                          <path d="M29 10L10 19V31C10 44 19 54 29 58C39 54 48 44 48 31V19L29 10Z"
                            fill="rgba(255,255,255,0.06)" stroke="rgba(240,192,64,0.5)" strokeWidth="1.5"/>
                          <text x="29" y="37" textAnchor="middle" fill="#f0c040"
                            fontSize="14" fontWeight="900" fontFamily="Arial">CS</text>
                        </svg>
                      </div>

                      {/* Verified badge — scalloped ring */}
                      <div className={styles.verifiedWrap}>
                        <svg width="90" height="90" viewBox="0 0 90 90">
                          {[...Array(18)].map((_, i) => {
                            const a = (i * 20) * Math.PI / 180
                            const x = 45 + 41 * Math.cos(a)
                            const y = 45 + 41 * Math.sin(a)
                            return <circle key={i} cx={x} cy={y} r="3.5" fill="#f0c040" opacity="0.85"/>
                          })}
                          <circle cx="45" cy="45" r="30" fill="none" stroke="#f0c040" strokeWidth="2"/>
                          <circle cx="45" cy="45" r="24" fill="rgba(255,255,255,0.08)"
                            stroke="rgba(240,192,64,0.4)" strokeWidth="1"/>
                          <text x="45" y="41" textAnchor="middle" fill="#f0c040"
                            fontSize="7.5" fontWeight="800" fontFamily="Arial" letterSpacing="1.5">VERIFIED</text>
                          <text x="45" y="55" textAnchor="middle" fill="white"
                            fontSize="12" fontWeight="700" fontFamily="Arial">
                            {new Date(cert.issuedAt).getFullYear()}
                          </text>
                        </svg>
                      </div>

                      <div className={styles.rightBotGold2} />
                      <div className={styles.rightBotGold} />
                    </div>

                    {/* Corner ornaments */}
                    <div className={styles.cTL} />
                    <div className={styles.cBL} />
                  </div>

                  {/* Actions */}
                  <div className={styles.certActions}>
                    <div>
                      <p className={styles.certActTitle}>{cert.courseTitle}</p>
                      <p className={styles.certActId}>ID: {cert.certificateId}</p>
                    </div>
                    <button className="btn btn-primary"
                      onClick={() => handleDownload(cert)}
                      disabled={downloading === cert._id}>
                      {downloading === cert._id
                        ? <><span className="spinner spinner-sm"/> Downloading…</>
                        : '⬇️ Download PDF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Course Progress */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📚 My Courses</h2>
          {loading ? (
            <div style={{ textAlign:'center', padding:40 }}><div className="spinner"/></div>
          ) : allProgress.length === 0 ? (
            <div className={styles.emptyBox}>
              <span>📖</span>
              <p>No courses started yet.</p>
              <button className="btn btn-primary" onClick={() => navigate('/courses')}>
                Start Learning
              </button>
            </div>
          ) : (
            <div className={styles.progressList}>
              {allProgress.map(p => {
                const course = p.course
                const total  = p.totalVideos || course?.totalVideos || 0
                const pct    = p.pct || (total > 0 ? Math.round((p.completedVideos / total) * 100) : 0)
                return (
                  <div key={p._id} className={styles.progressItem}
                    onClick={() => navigate(`/courses/${course?._id || p.course}`)}>
                    <div className={styles.progressIcon}
                      style={{ background:`${course?.color || '#0ea5e9'}20` }}>
                      {course?.icon || '📚'}
                    </div>
                    <div className={styles.progressInfo}>
                      <div className={styles.progressTop}>
                        <span className={styles.progressTitle}>{course?.title || 'Course'}</span>
                        <span className={`badge badge-${course?.level?.toLowerCase() || 'beginner'}`}>
                          {course?.level || 'Beginner'}
                        </span>
                      </div>
                      <div className="progress-bar-wrap" style={{ marginTop:6 }}>
                        <div className="progress-bar-fill" style={{ width:`${pct}%` }}/>
                      </div>
                      <div className={styles.progressMeta}>
                        <span>{p.completedVideos}/{total} videos</span>
                        <span>{pct}%</span>
                        {p.quizPassed && <span className={styles.passedTag}>✅ Quiz Passed</span>}
                        {p.certificateIssued && <span className={styles.certTag}>🏆 Certified</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}