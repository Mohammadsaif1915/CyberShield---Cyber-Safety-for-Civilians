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