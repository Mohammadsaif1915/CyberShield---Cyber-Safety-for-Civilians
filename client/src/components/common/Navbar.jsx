import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const location = useLocation()

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/courses" className={styles.logo}>
          <span className={styles.logoIcon}>🛡️</span>
          <span className={styles.logoText}>Cyber<span>Learn</span></span>
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