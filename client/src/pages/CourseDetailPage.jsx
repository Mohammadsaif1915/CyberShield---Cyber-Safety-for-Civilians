import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import styles from './CourseDetailPage.module.css'

// ══════════════════════════════════════════════════════════════════════
// COURSE VIDEO LINKS
// YouTube embed links → rendered as <iframe>
// Direct MP4 links   → rendered as <video>
// ══════════════════════════════════════════════════════════════════════
const COURSE_VIDEOS = {
  'Phishing Attacks': [
    'https://www.youtube.com/embed/XBkzBrXlle0', // What is Phishing? - Simplilearn
    'https://www.youtube.com/embed/Wvjj65_5LiM', // Phishing Attacks Explained
    'https://www.youtube.com/embed/aO858HyFbKI', // How Phishing Emails Work - Computerphile
    'https://www.youtube.com/embed/Y7zNlEMDmI4', // Spear Phishing Explained
    'https://www.youtube.com/embed/pCHXm9a3Vc8', // How to Spot Phishing
  ],
  'Malware Analysis': [
    'https://www.youtube.com/embed/NMYbkzjI5EY', // Malware Analysis Intro
    'https://www.youtube.com/embed/n8mbzU0X2nQ', // Types of Malware
    'https://www.youtube.com/embed/GbMAlHR0NRw', // How Malware Works - Computerphile
    'https://www.youtube.com/embed/rNMDQ10LMIY', // Static vs Dynamic Analysis
    'https://www.youtube.com/embed/5d6zYoWUbR4', // Malware Reverse Engineering
  ],
  'Ransomware': [
    'https://www.youtube.com/embed/WqD-ATqw3js', // What is Ransomware? - IBM
    'https://www.youtube.com/embed/Vkjekr6jacg', // Ransomware Explained
    'https://www.youtube.com/embed/ihElrBBJQo8', // How Ransomware Spreads
    'https://www.youtube.com/embed/5_mv9hBpbLQ', // Ransomware Attack Walkthrough
    'https://www.youtube.com/embed/DwLqFTfnVKA', // Protecting Against Ransomware
  ],
  'Social Engineering': [
    'https://www.youtube.com/embed/lc7scxvKQOo', // Social Engineering Attacks - Simplilearn
    'https://www.youtube.com/embed/YYany7rjpQo', // Social Engineering Explained
    'https://www.youtube.com/embed/PWVN3Rq4gzw', // Pretexting & Baiting
    'https://www.youtube.com/embed/OGBFm1jFjGc', // Famous Social Engineering Hacks
    'https://www.youtube.com/embed/zap3NKPsEYA', // How to Defend Against Social Engineering
  ],
  'Password Security': [
    'https://www.youtube.com/embed/aEmXfZm0I7o', // Password Security Explained
    'https://www.youtube.com/embed/7U-RbOKanYs', // How Passwords Are Hacked - Computerphile
    'https://www.youtube.com/embed/3NjQ9b3pgIg', // Password Managers Explained
    'https://www.youtube.com/embed/P7mQe7Yc5LM', // Multi-Factor Authentication
    'https://www.youtube.com/embed/CLvNSs7f8bg', // Best Password Practices
  ],
  'Network Security Basics': [
    'https://www.youtube.com/embed/qiQR5rTSshw', // Computer Networking Full Course
    'https://www.youtube.com/embed/GbmgagKvFjk', // Network Security Basics - Simplilearn
    'https://www.youtube.com/embed/5OqgVdNAR4c', // OSI Model Explained
    'https://www.youtube.com/embed/VXmvM2QtuMU', // Firewalls & Network Security
    'https://www.youtube.com/embed/qlK-pHFCBUs', // Intrusion Detection Systems
  ],
  'Firewall & Network Security': [
    'https://www.youtube.com/embed/9GZlVOafYTg', // Firewall Explained
    'https://www.youtube.com/embed/G2X3wVGYgjI', // Types of Firewalls
    'https://www.youtube.com/embed/wmEtcBVJMNg', // How Firewalls Work - Cisco
    'https://www.youtube.com/embed/kDEX1HXybrU', // Next-Gen Firewall Features
    'https://www.youtube.com/embed/ZhCBPsv2acs', // Configuring Firewall Rules
  ],
  'Hashing & Encryption': [
    'https://www.youtube.com/embed/jmtzX-NPFDc', // Hashing Explained - Computerphile
    'https://www.youtube.com/embed/LA3fah6i-4A', // Encryption vs Hashing
    'https://www.youtube.com/embed/AQDCe585Lnc', // SHA vs MD5 Hashing
    'https://www.youtube.com/embed/O4xNJsjtN6E', // How Password Hashing Works
    'https://www.youtube.com/embed/wlSG3pEiQdc', // Symmetric vs Asymmetric Encryption
  ],
  'Cryptography & Common Attacks': [
    'https://www.youtube.com/embed/GQvu49c0ZZc', // Cryptography Basics
    'https://www.youtube.com/embed/_jzSvSk-lX0', // Common Crypto Attacks
    'https://www.youtube.com/embed/AQDCe585Lnc', // Public Key Cryptography
    'https://www.youtube.com/embed/NmM9HA2MQGI', // RSA Encryption Explained
    'https://www.youtube.com/embed/j9QmMEWmcfo', // Brute Force & Dictionary Attacks
  ],
  'Man-in-the-Middle Attack': [
    'https://www.youtube.com/embed/Ep1Z0YU-wuw', // MITM Attack Explained
    'https://www.youtube.com/embed/uLo_kI1gcBc', // How MITM Works
    'https://www.youtube.com/embed/LfaJSJa5P-A', // ARP Spoofing Demo
    'https://www.youtube.com/embed/h67gFHPQ30c', // SSL Stripping Attack
    'https://www.youtube.com/embed/hkN5gCB0fKo', // Preventing MITM Attacks
  ],
  'Ethical Hacking': [
    'https://www.youtube.com/embed/3Kq1MIfTWCE', // Ethical Hacking Full Course - freeCodeCamp
    'https://www.youtube.com/embed/lGWV_ij0FkM', // What is Ethical Hacking?
    'https://www.youtube.com/embed/MSl_V2xuDsM', // Penetration Testing Process
    'https://www.youtube.com/embed/bQF8iFRCkmE', // Hacking Tools Overview
    'https://www.youtube.com/embed/2_lswM1S264', // CEH Certification Guide
  ],
  'SQL Injection': [
    'https://www.youtube.com/embed/_jKylhJtPmI', // SQL Injection - Computerphile (Tom Scott)
    'https://www.youtube.com/embed/ciNHn38EyRc', // Running SQL Injection - Computerphile (Dr Mike Pound)
    'https://www.youtube.com/embed/cx6Xs3F_1Uc', // SQL Injection Tutorial for Beginners
    'https://www.youtube.com/embed/2OPVViV-GGk', // Blind SQL Injection Explained
    'https://www.youtube.com/embed/1nJgupaUPEQ', // Preventing SQL Injection
  ],
  'XSS Attacks': [
    'https://www.youtube.com/embed/EoaDgUgS6QA', // XSS Attack Explained - Computerphile
    'https://www.youtube.com/embed/ns1LX6mEvyM', // Cross-Site Scripting Tutorial
    'https://www.youtube.com/embed/M_nIIcKTxGk', // Reflected vs Stored XSS
    'https://www.youtube.com/embed/gkMl1suyj3M', // DOM-Based XSS
    'https://www.youtube.com/embed/cbmBDiR6WPY', // XSS Prevention Techniques
  ],
  'DoS & DDoS Attacks': [
    'https://www.youtube.com/embed/ilhGh9CEIwM', // DDoS Attack Explained
    'https://www.youtube.com/embed/BcDZS7iYNsA', // How DDoS Works - Linus Tech Tips
    'https://www.youtube.com/embed/WwQyQ6T3tVU', // Types of DoS Attacks
    'https://www.youtube.com/embed/oxz6Xp6bwAk', // Botnet & DDoS Demo
    'https://www.youtube.com/embed/bXJwLGPPNOQ', // DDoS Mitigation Techniques
  ],
  'VPN Security': [
    'https://www.youtube.com/embed/R-JUOpCgTZc', // How VPN Works - NetworkChuck
    'https://www.youtube.com/embed/fYFnMGNNd2E', // VPN Explained
    'https://www.youtube.com/embed/ONoQkJkNYd8', // VPN Protocols Compared
    'https://www.youtube.com/embed/RIFhDNlnb1A', // VPN Security & Privacy
    'https://www.youtube.com/embed/aA_wqB0Xh1Q', // WireGuard vs OpenVPN
  ],
  'Wi-Fi Hacking & Security': [
    'https://www.youtube.com/embed/AelxX2b-DXM', // Wi-Fi Hacking Explained
    'https://www.youtube.com/embed/Il5Sz63Q3-0', // WPA2 Cracking Demo
    'https://www.youtube.com/embed/VtFxF2s91CI', // Evil Twin Attack
    'https://www.youtube.com/embed/4Fxh0sOmVkQ', // Wi-Fi Security Best Practices
    'https://www.youtube.com/embed/5HOHNXaK1RA', // Deauth Attacks Explained
  ],
  'Cyber Laws & Compliance': [
    'https://www.youtube.com/embed/ERTkN3FNVeI', // Cyber Laws Overview
    'https://www.youtube.com/embed/tPGLOkx9CZk', // GDPR Explained
    'https://www.youtube.com/embed/p_1VRiCHFMw', // HIPAA Compliance Basics
    'https://www.youtube.com/embed/6ULDqQnN5-8', // ISO 27001 Overview
    'https://www.youtube.com/embed/FhnUr-MkDFc', // NIST Cybersecurity Framework
  ],
  'Digital Forensics': [
    'https://www.youtube.com/embed/TlFERVez86c', // Digital Forensics Explained
    'https://www.youtube.com/embed/Bjr5KThmPMI', // Computer Forensics Process
    'https://www.youtube.com/embed/WkCRzmKQsig', // Forensics Tools Overview
    'https://www.youtube.com/embed/BI35UZfRnBE', // Memory Forensics Explained
    'https://www.youtube.com/embed/1RKjIy5kSzA', // Network Forensics
  ],
  'Identity Theft': [
    'https://www.youtube.com/embed/gCbhsE5aRl4', // Identity Theft Explained
    'https://www.youtube.com/embed/QBJFIuZ9ndE', // How Identity Theft Happens
    'https://www.youtube.com/embed/gTBCfSNBk5c', // Preventing Identity Theft
    'https://www.youtube.com/embed/ZFMxeIWsXU0', // Dark Web & Identity Theft
    'https://www.youtube.com/embed/Vo9tMm8PCIA', // Recovery from Identity Theft
  ],
  'Spyware & Adware': [
    'https://www.youtube.com/embed/Q34qFb1vL8E', // Spyware Explained
    'https://www.youtube.com/embed/qHFDhbj6UUw', // How Adware Works
    'https://www.youtube.com/embed/G5qO2_UgCmA', // Detecting & Removing Spyware
    'https://www.youtube.com/embed/f0YSNxqBqgQ', // Keyloggers & Spyware Demo
    'https://www.youtube.com/embed/nstBlwVAAkA', // Spyware Prevention
  ],
  'Trojans & Backdoors': [
    'https://www.youtube.com/embed/oIClbAC8vHQ', // Trojans Explained
    'https://www.youtube.com/embed/ulK3bRIFMfU', // How Backdoors Work
    'https://www.youtube.com/embed/geStpJhf3KA', // Remote Access Trojans (RATs)
    'https://www.youtube.com/embed/N3dFGNQqVAA', // Detecting Trojans
    'https://www.youtube.com/embed/yKJKVjVIaV4', // Trojan vs Virus vs Worm
  ],
  'Rootkits': [
    'https://www.youtube.com/embed/MkSP2z1XPGE', // Rootkits Explained
    'https://www.youtube.com/embed/hHjmFOKvAoQ', // How Rootkits Hide
    'https://www.youtube.com/embed/dVjnOoMuGxc', // Kernel-Level Rootkits
    'https://www.youtube.com/embed/H8-wr8OanQ0', // Detecting Rootkits
    'https://www.youtube.com/embed/UOt36TaRRbI', // Removing Rootkits
  ],
  'Cloud Security': [
    'https://www.youtube.com/embed/M988_fsOSWo', // Cloud Security Fundamentals
    'https://www.youtube.com/embed/pTCkTwNkRbQ', // AWS Security Basics
    'https://www.youtube.com/embed/5g-4pVEbSiQ', // Cloud Threat Models
    'https://www.youtube.com/embed/aeMP6OWFpMY', // Zero Trust Architecture
    'https://www.youtube.com/embed/NHE98N3pSUo', // Cloud Compliance & CSPM
  ],
  'Mobile Security': [
    'https://www.youtube.com/embed/wdCOBGDjA6c', // Mobile Security Overview
    'https://www.youtube.com/embed/5OjWChOeUD8', // Android vs iOS Security
    'https://www.youtube.com/embed/UMYCq8W2QVA', // Mobile App Vulnerabilities
    'https://www.youtube.com/embed/0rHY_2GCNEU', // Mobile Malware Explained
    'https://www.youtube.com/embed/E8T_ywdOcRY', // Securing Your Mobile Device
  ],
  'Email Security': [
    'https://www.youtube.com/embed/oqvC6PgQU3I', // Email Security Explained
    'https://www.youtube.com/embed/qN9cFsaFW3c', // SPF DKIM DMARC Explained
    'https://www.youtube.com/embed/OU0xFHR4sJc', // Email Spoofing Demo
    'https://www.youtube.com/embed/K3HloZpCNow', // Business Email Compromise (BEC)
    'https://www.youtube.com/embed/MlSDBVB3Bbc', // Email Encryption Explained
  ],
  'Zero-Day Attacks': [
    'https://www.youtube.com/embed/HYHbmXU7Eo4', // Zero-Day Vulnerabilities Explained
    'https://www.youtube.com/embed/sLMB4SNoLM0', // How Zero-Days Are Exploited
    'https://www.youtube.com/embed/3ow0FyvmH7o', // Bug Bounty & Zero-Days
    'https://www.youtube.com/embed/Uh2mKuGMJhg', // Patch Management
    'https://www.youtube.com/embed/vhh2JHvjsGs', // Zero-Day Defense Strategies
  ],
  'Cyber Attack Overview': [
    'https://www.youtube.com/embed/-KL9APUjj3E', // Cyber Attacks Overview
    'https://www.youtube.com/embed/inWWhr5tnEA', // Types of Cyber Attacks
    'https://www.youtube.com/embed/Dk-ZqQ-bfy4', // Cyber Kill Chain Explained
    'https://www.youtube.com/embed/9gJrXqk4fMM', // MITRE ATT&CK Framework
    'https://www.youtube.com/embed/pn1oMsGVDKI', // How Hackers Think
  ],
  'Spoofing Attacks': [
    'https://www.youtube.com/embed/LpN1Nd-PVBk', // Spoofing Attacks Explained
    'https://www.youtube.com/embed/lggWxsHYK2o', // IP & Email Spoofing
    'https://www.youtube.com/embed/BdXrDUDo7E0', // DNS Spoofing Demo
    'https://www.youtube.com/embed/0RHQf4YSWOY', // ARP Spoofing Explained
    'https://www.youtube.com/embed/nT55J5NxeYo', // Preventing Spoofing Attacks
  ],
}

// ── Helper: is this a YouTube embed URL? ─────────────────────────────────────
const isYouTubeEmbed = (url) =>
  url && (url.includes('youtube.com/embed/') || url.includes('youtu.be/'))

const getVideoLink = (courseTitle, videoIndex) => {
  const links = COURSE_VIDEOS[courseTitle]
  if (!links) return 'https://www.youtube.com/embed/dQw4w9WgXcQ' // fallback
  return links[videoIndex] || links[0]
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const videoRef = useRef(null)
  const progressRef = useRef(null)
  const saveTimerRef = useRef(null)
  const isCompleting = useRef(false)
  const maxReachedRef = useRef(0)

  // ── YouTube iframe timer (since we can't use timeupdate for iframes) ──────
  const iframeTimerRef = useRef(null)
  const iframeElapsedRef = useRef(0) // seconds elapsed while "playing" for YT videos
  const [iframeProgress, setIframeProgress] = useState(0)

  // ── Load course + progress ────────────────────────────────────────────────
  useEffect(() => {
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
    iframeElapsedRef.current = 0
    setIframeProgress(0)

    if (course && progressRef.current) {
      const video = course.videos[activeIdx]
      const existing = progressRef.current?.watchedVideos?.find(wv => {
        const wid = wv.videoId?._id?.toString() || wv.videoId?.toString()
        return wid === video?._id?.toString()
      })
      maxReachedRef.current = existing?.watchedDuration || 0
      iframeElapsedRef.current = existing?.watchedDuration || 0
    }

    if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    if (iframeTimerRef.current) clearInterval(iframeTimerRef.current)
  }, [activeIdx, course])

  // ── For YouTube iframes: simulate time tracking via a JS interval ─────────
  // Since we cannot access YT iframe internals without the YT API,
  // we start a timer when the user clicks "▶ Start Watching" and stop on pause/done.
  const startIframeTimer = () => {
    if (iframeTimerRef.current) clearInterval(iframeTimerRef.current)
    setIsPlaying(true)

    iframeTimerRef.current = setInterval(() => {
      iframeElapsedRef.current += 1
      const vid = course?.videos[activeIdx]
      const totalDur = vid?.duration || 300
      const pct = Math.min(100, Math.round((iframeElapsedRef.current / totalDur) * 100))
      setIframeProgress(pct)
      setCurrentTime(iframeElapsedRef.current)

      // Auto-save every 10 seconds
      if (iframeElapsedRef.current % 10 === 0) {
        saveIframeProgress()
      }

      // Auto-complete at 95%
      if (pct >= 95 && !isCompleting.current) {
        isCompleting.current = true
        clearInterval(iframeTimerRef.current)
        handleIframeVideoComplete()
      }
    }, 1000)
  }

  const pauseIframeTimer = () => {
    if (iframeTimerRef.current) clearInterval(iframeTimerRef.current)
    setIsPlaying(false)
    saveIframeProgress()
  }

  const saveIframeProgress = async (forceComplete = false) => {
    if (!course) return
    const video = course.videos[activeIdx]
    const totalDur = video?.duration || 300
    const watched = forceComplete ? totalDur : iframeElapsedRef.current

    try {
      const { data } = await api.post(`/progress/${id}/video`, {
        videoId: video._id,
        watchedDuration: Math.floor(Math.min(watched, totalDur)),
        totalDuration: Math.floor(totalDur)
      })
      setProgress(data.progress)
      progressRef.current = data.progress
    } catch (err) { console.error('Save error:', err) }
  }

  const handleIframeVideoComplete = async () => {
    if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    if (iframeTimerRef.current) clearInterval(iframeTimerRef.current)
    await saveIframeProgress(true)

    const video = course.videos[activeIdx]
    toast.success(`✅ "${video.title}" completed!`)
    setIsPlaying(false)

    if (activeIdx < course.videos.length - 1) {
      setTimeout(() => changeVideo(activeIdx + 1), 1500)
    }
  }

  // ── Save progress periodically for <video> elements ───────────────────────
  useEffect(() => {
    if (saveTimerRef.current) clearInterval(saveTimerRef.current)

    const currentLink = course ? getVideoLink(course.title, activeIdx) : ''
    if (isPlaying && !isYouTubeEmbed(currentLink)) {
      saveTimerRef.current = setInterval(() => {
        saveCurrentProgress()
      }, 10000)
    }

    return () => { if (saveTimerRef.current) clearInterval(saveTimerRef.current) }
  }, [isPlaying, activeIdx])

  // ── Save progress for native <video> ─────────────────────────────────────
  const saveCurrentProgress = async (forceComplete = false) => {
    if (!course || !videoRef.current) return
    const video = course.videos[activeIdx]
    const videoDur = videoRef.current.duration || video.duration || 300
    const watched = forceComplete ? videoDur : maxReachedRef.current

    try {
      const { data } = await api.post(`/progress/${id}/video`, {
        videoId: video._id,
        watchedDuration: Math.floor(watched),
        totalDuration: Math.floor(videoDur)
      })
      setProgress(data.progress)
      progressRef.current = data.progress
    } catch (err) { console.error('Save error:', err) }
  }

  // ── Native video event handlers ───────────────────────────────────────────
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
    const video = course?.videos[activeIdx]
    const existing = progressRef.current?.watchedVideos?.find(wv => {
      const wid = wv.videoId?._id?.toString() || wv.videoId?.toString()
      return wid === video?._id?.toString()
    })
    if (existing?.watchedDuration > 0 && !existing?.completed) {
      videoRef.current.currentTime = existing.watchedDuration
    }
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const ct = videoRef.current.currentTime
    setCurrentTime(ct)
    if (ct > maxReachedRef.current) maxReachedRef.current = ct

    const vid = videoRef.current
    const vidDur = vid.duration || duration
    if (vidDur > 0 && ct >= vidDur * 0.95 && !isCompleting.current) {
      isCompleting.current = true
      handleVideoComplete()
    }
  }

  const handleVideoComplete = async () => {
    if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    await saveCurrentProgress(true)
    const video = course.videos[activeIdx]
    toast.success(`✅ "${video.title}" completed!`)
    if (activeIdx < course.videos.length - 1) {
      setTimeout(() => changeVideo(activeIdx + 1), 1500)
    }
  }

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => {
    setIsPlaying(false)
    saveCurrentProgress()
  }

  const handleSeeking = () => {
    if (!videoRef.current) return
    const video = course?.videos[activeIdx]
    const existing = progressRef.current?.watchedVideos?.find(wv => {
      const wid = wv.videoId?._id?.toString() || wv.videoId?.toString()
      return wid === video?._id?.toString()
    })
    if (existing?.completed) return
    const maxAllowed = maxReachedRef.current + 3
    if (videoRef.current.currentTime > maxAllowed) {
      videoRef.current.currentTime = maxReachedRef.current
      toast('⛔ You cannot skip forward!', { icon: '🔒', duration: 2000 })
    }
  }

  const changeVideo = (idx) => {
    if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    if (iframeTimerRef.current) clearInterval(iframeTimerRef.current)
    isCompleting.current = false
    maxReachedRef.current = 0
    iframeElapsedRef.current = 0
    setActiveIdx(idx)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIframeProgress(0)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const activeVideo = course?.videos[activeIdx]
  const completedCount = progress?.completedVideos || 0
  const totalVideos = course?.videos?.length || 0
  const pct = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0

  const vidDuration = duration || activeVideo?.duration || 300
  const timerPct = Math.min(100, Math.round((maxReachedRef.current / vidDuration) * 100))
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`

  const isVideoCompleted = (videoId) => {
    const vid = videoId?._id?.toString() || videoId?.toString()
    return progress?.watchedVideos?.find(v => {
      const wid = v.videoId?._id?.toString() || v.videoId?.toString()
      return wid === vid
    })?.completed || false
  }

  const getWatchedPct = (videoId, dur) => {
    const vid = videoId?._id?.toString() || videoId?.toString()
    const wv = progress?.watchedVideos?.find(v => {
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
  const videoDone = isVideoCompleted(activeVideo?._id)
  const isYT = isYouTubeEmbed(currentVideoLink)

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
            <span className={styles.topPct}>{completedCount}/{totalVideos} videos</span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className={`container ${styles.layout}`}>

        {/* Left: video player */}
        <div className={styles.playerSide}>
          <div className={styles.playerWrap}>

            {/* ── VIDEO PLAYER: YouTube iframe OR native <video> ────────── */}
            <div className={styles.videoFrame}>
              {isYT ? (
                /* YouTube embed — rendered inside iframe */
                <iframe
                  key={`yt-${activeIdx}-${course.title}`}
                  src={`${currentVideoLink}?rel=0&modestbranding=1`}
                  title={activeVideo?.title || 'Course Video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: '#000',
                    border: 'none',
                  }}
                />
              ) : (
                /* Direct MP4 — native video element */
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
              )}
            </div>

            {/* Video title */}
            <div className={styles.videoInfo}>
              <div>
                <h3 className={styles.videoTitle}>{activeVideo?.title}</h3>
                <p className={styles.videoMeta}>
                  Video {activeIdx + 1} of {totalVideos}
                  {videoDone && <span className={styles.completedTag}>✅ Completed</span>}
                  {isPlaying && !videoDone && <span className={styles.playingTag}>▶ Playing</span>}
                </p>
              </div>
            </div>

            {/* ── YouTube: manual play/pause tracking controls ──────────── */}
            {isYT && !videoDone && (
              <div className={styles.ytTrackingBar}>
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                  ℹ️ Track your watch time below to unlock completion:
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {!isPlaying ? (
                    <button
                      className="btn btn-sm"
                      style={{ background: '#22c55e', color: '#fff' }}
                      onClick={startIframeTimer}
                    >
                      ▶ I'm Watching
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm"
                      style={{ background: '#f59e0b', color: '#fff' }}
                      onClick={pauseIframeTimer}
                    >
                      ⏸ Pause Tracking
                    </button>
                  )}
                  <span style={{ fontSize: 12, color: '#cbd5e1' }}>
                    {formatTime(currentTime)} watched — {iframeProgress}%
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{
                  marginTop: 8,
                  height: 6,
                  borderRadius: 3,
                  background: '#1e293b',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${iframeProgress}%`,
                    background: '#0ea5e9',
                    transition: 'width 1s linear'
                  }} />
                </div>
              </div>
            )}

            {/* Timer text for native video */}
            {!isYT && (
              <div className={styles.timerWrap}>
                <span className={styles.timerText}>
                  {videoDone
                    ? '✅ Video Completed!'
                    : duration > 0
                      ? `${formatTime(currentTime)} / ${formatTime(duration)} — ${timerPct}% watched`
                      : ''}
                </span>
              </div>
            )}

            {videoDone && (
              <div className={styles.timerWrap}>
                <span className={styles.timerText}>✅ Video Completed!</span>
              </div>
            )}

            <div className={styles.restrictionNote}>
              🔒 {isYT
                ? 'Click "▶ I\'m Watching" while the video plays to track your progress.'
                : 'Forward skipping is disabled. Watch fully to unlock next video & quiz.'}
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
              const done = isVideoCompleted(video._id)
              const active = idx === activeIdx
              const wpct = getWatchedPct(video._id, video.duration)
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
                        <span style={{ fontSize: 10, color: '#0ea5e9', fontWeight: 600 }}>{wpct}%</span>
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