import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'
import LogoIcon from './LogoIcon'

export default function Navbar() {
  const location = useLocation()

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <LogoIcon size={32} />
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', fontFamily: "'Syne', sans-serif" }}>CyberShield</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/courses"
            className={`${styles.navLink} ${location.pathname === '/courses' ? styles.active : ''}`}
          >
            Courses
          </Link>
          <Link
            to="/community-forum"
            className={`${styles.navLink} ${location.pathname === '/community-forum' ? styles.active : ''}`}
          >
            Community
          </Link>
          <Link
            to="/leaderboard"
            className={`${styles.navLink} ${location.pathname === '/leaderboard' ? styles.active : ''}`}
          >
            Leaderboard
          </Link>
          <Link
            to="/reports"
            className={`${styles.navLink} ${location.pathname === '/reports' ? styles.active : ''}`}
          >
            Reports
          </Link>
          <Link
            to="/threats"
            className={`${styles.navLink} ${location.pathname === '/threats' ? styles.active : ''}`}
          >
            Threats
          </Link>
        </nav>

        <div className={styles.userArea}>
          <Link to="/profile" className={styles.profileBtn}>
            <div className={styles.avatar}>👤</div>
          </Link>
        </div>
      </div>
    </header>
  )
}