import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import styles from './CertificatePage.module.css'

export default function CertificatePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get(`/certificate/${id}`)
        if (res.data.certificate) { navigate('/profile'); return }
      } catch { }
      try {
        const pRes = await api.get(`/progress/${id}`)
        setQuizPassed(pRes.data.progress?.quizPassed || false)
      } catch { }
      setLoading(false)
    }
    check()
  }, [id])

  const handlePayAndGet = async () => {
    if (!name.trim()) { toast.error('Please enter your full name'); return }
    setPaying(true)
    try {
      const { data } = await api.post(`/certificate/${id}/create-order`, {
        recipientName: name.trim(),
      })

      if (data.alreadyPaid) {
        toast.success('Certificate already issued!')
        navigate('/profile')
        return
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'CyberShield',
        description: 'Course Completion Certificate — ₹100',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post(`/certificate/${id}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              recipientName: name.trim(),
            })
            if (verifyRes.data.success) {
              toast.success('🏆 Payment successful! Certificate issued!')
              navigate('/profile')
            }
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed')
          } finally {
            setPaying(false)
          }
        },
        prefill: { name: name.trim() },
        theme: { color: '#0f4c81' },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled', { icon: 'ℹ️' })
            setPaying(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment')
      setPaying(false)
    }
  }

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: 16
    }}>
      <div className="spinner" />
      <p style={{ color: 'var(--clr-text3)' }}>Loading…</p>
    </div>
  )

  if (!quizPassed) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: 16, textAlign: 'center', padding: 24
    }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <h3 style={{ fontFamily: 'var(--font-display)' }}>Quiz not passed yet</h3>
      <p style={{ color: 'var(--clr-text2)' }}>Pass the course quiz to earn your certificate.</p>
      <button className="btn btn-primary"
        onClick={() => navigate(`/courses/${id}/quiz`)}>Take Quiz</button>
    </div>
  )

  return (
    <div className={styles.payPage}>
      <div className={styles.payCard}>

        <div className={styles.payHeader}>
          <div className={styles.trophyIcon}>🏆</div>
          <h2 className={styles.payTitle}>Get Your Certificate</h2>
          <p className={styles.paySub}>
            You've passed the quiz! Unlock your official certificate of completion.
          </p>
        </div>

        <div className={styles.benefitBox}>
          <p className={styles.benefitTitle}>What you'll receive:</p>
          <ul className={styles.benefitList}>
            <li>✅ Official CyberShield certificate with unique ID</li>
            <li>✅ Downloadable high-quality PDF</li>
            <li>✅ Verifiable certificate code</li>
            <li>✅ Lifetime access from your profile</li>
          </ul>
        </div>

        <div className={styles.nameSection}>
          <label className={styles.nameLabel}>Name to print on certificate</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={60}
            className={styles.nameInput}
          />
        </div>

        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Certificate fee</span>
          <span className={styles.priceAmount}>₹100</span>
        </div>

        <button
          className={styles.payBtn}
          onClick={handlePayAndGet}
          disabled={paying || !name.trim()}
        >
          {paying
            ? <><span className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} /> Processing…</>
            : <>🔒 Pay ₹100 &amp; Get Certificate</>
          }
        </button>

        <div className={styles.methodsRow}>
          <span className={styles.methodsLabel}>Accepted payments:</span>
          <div className={styles.methodBadges}>
            <span className={styles.badge}>📱 UPI / GPay</span>
            <span className={styles.badge}>💳 Card</span>
            <span className={styles.badge}>🏦 Net Banking</span>
            <span className={styles.badge}>💰 Wallets</span>
          </div>
        </div>

        <p className={styles.secureNote}>
          🔐 Secured by Razorpay · 256-bit SSL encryption
        </p>
      </div>
    </div>
  )
}