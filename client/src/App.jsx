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

import CoursesPage      from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LeaderboardPage from "./LeaderboardPage";
import PhisingSimulatorPage from "./PhisingSimulatorPage";
import ReportsPage from "./ReportsPage";
import ThreatsPage from "./ThreatsPage";
import QuizPages        from './pages/QuizPages';
import QuizPage  from "./pages/QuizPage";
import CertificatePage  from './pages/CertificatePage';
import Navbar           from './components/common/Navbar';

function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/"                        element={<CyberSafetyLanding />} />
      <Route path="/dashboard"               element={<Dashboard />} />
      <Route path="/game"                    element={<GamePage />} />
      <Route path="/quiz"                  element={<QuizPages />} />
      <Route path="/QuizPage"                  element={<QuizPage />} />

      <Route path="/register"                element={<Register />} />
      <Route path="/login"                   element={<Login />} />
      <Route path="/forgot-password"         element={<ForgotPasswordPopup />} />
      <Route path="/reset-password/:token"   element={<ResetPassword />} />

      <Route path="/about_us"                element={<About_us />} />
      <Route path="/features"                element={<Features />} />
      <Route path="/community"               element={<Community />} />
      <Route path="/our_team"                element={<Our_Team />} />
      <Route path="/blog"                    element={<Blog />} />
      <Route path="/help_center"             element={<Help_Center />} />
      <Route path="/contact_us"              element={<Contact_Us />} />
      <Route path="/faq"                     element={<Faq />} />
      <Route path="/leaderboard"             element={<Layout><LeaderboardPage /></Layout>} />
      <Route path="/phishing-simulator"      element={<Layout><PhisingSimulatorPage /></Layout>} />
      <Route path="/reports"                 element={<Layout><ReportsPage /></Layout>} />
      <Route path="/threats"                element={<Layout><ThreatsPage /></Layout>} />

      <Route path="/courses"                 element={<Layout><CoursesPage /></Layout>} />
      <Route path="/courses/:id"             element={<Layout><CourseDetailPage /></Layout>} />
      <Route path="/courses/:id/quiz"        element={<Layout><QuizPages /></Layout>} />
      <Route path="/courses/:id/certificate" element={<Layout><CertificatePage /></Layout>} />

      <Route path="*"                        element={<Navigate to="/courses" replace />} />
    </Routes>
  );
}

export default App;