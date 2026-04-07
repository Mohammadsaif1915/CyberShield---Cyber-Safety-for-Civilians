import { Routes, Route, Navigate } from "react-router-dom";

import CyberSafetyLanding from "./pages/Landing/CyberSafetyLanding";
import Dashboard          from "./pages/Dashboard";
import GamePage           from "./pages/GamePage";

import Register            from "./components/Register";
import Login               from "./components/Login";
import ForgotPasswordPopup from "./components/ForgotPasswordPopup";
import ResetPassword       from "./components/ResetPassword";
import About_us            from "./components/About_us";
import Features            from "./components/Features";
import Community           from "./components/Community";
import Our_Team            from "./components/Our_Team";
import Blog                from "./components/Blog";
import Help_Center         from "./components/Help_Center";
import Contact_Us          from "./components/Contact_us";
import Faq                 from "./components/Faq";
import BlogPostPage from "./components/Blogpostpage";

import LeaderboardPage      from "./LeaderboardPage";
import PhisingSimulatorPage from "./PhisingSimulatorPage";
import ReportsPage          from "./ReportsPage";
import ThreatsPage          from "./ThreatsPage";

import QuizPages        from "./pages/QuizPages";
import CoursesPage      from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import QuizPage         from './pages/QuizPage';
import CertificatePage  from './pages/CertificatePage';
import ProfilePage      from './pages/ProfilePage';
import Navbar           from './components/common/Navbar';

import PrivacyPolicy  from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy   from './pages/CookiePolicy';
import Accessibility  from './pages/Accessibility';

// ── Layout wraps Navbar + page content ──────────────────────
function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '62px' }}>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* ── Public / Landing ── */}
      <Route path="/"                        element={<CyberSafetyLanding />} />
      <Route path="/dashboard"               element={<Dashboard />} />
      <Route path="/game"                    element={<GamePage />} />

      {/* ── Auth ── */}
      <Route path="/register"                element={<Register />} />
      <Route path="/login"                   element={<Login />} />
      <Route path="/forgot-password"         element={<ForgotPasswordPopup />} />
      <Route path="/reset-password/:token"   element={<ResetPassword />} />
      <Route path="/blog" element={<Blog />} />
<Route path="/blog/:id" element={<BlogPostPage />} />

      {/* ── Info pages ── */}
      <Route path="/about_us"                element={<About_us />} />
      <Route path="/features"                element={<Features />} />
      <Route path="/community"               element={<Community />} />
      <Route path="/our_team"                element={<Our_Team />} />
      <Route path="/blog"                    element={<Blog />} />
      <Route path="/help_center"             element={<Help_Center />} />
      <Route path="/contact_us"              element={<Contact_Us />} />
      <Route path="/faq"                     element={<Faq />} />

      {/* ── App pages (with Navbar) ── */}
      <Route path="/leaderboard"             element={<Layout><LeaderboardPage /></Layout>} />
      <Route path="/phishing-simulator"      element={<Layout><PhisingSimulatorPage /></Layout>} />
      <Route path="/reports"                 element={<Layout><ReportsPage /></Layout>} />
      <Route path="/threats"                 element={<Layout><ThreatsPage /></Layout>} />

      <Route path="/quiz"                    element={<QuizPage />} />
      <Route path="/courses"                 element={<CoursesPage />} />
      <Route path="/courses/:id"             element={<CourseDetailPage />} />
      <Route path="/courses/:id/quiz"        element={<QuizPages />} />
      <Route path="/courses/:id/certificate" element={<Layout><CertificatePage /></Layout>} />
      <Route path="/profile"                 element={<Layout><ProfilePage /></Layout>} />

      {/* ── Legal ── */}
      <Route path="/privacy-policy"          element={<PrivacyPolicy />} />
      <Route path="/terms-of-service"        element={<TermsOfService />} />
      <Route path="/cookie-policy"           element={<CookiePolicy />} />
      <Route path="/accessibility"           element={<Accessibility />} />

      {/* ── Catch-all ── */}
      <Route path="*"                        element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;