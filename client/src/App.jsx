import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CyberSafetyLanding from "./pages/Landing/CyberSafetyLanding";
import Dashboard from "./pages/Dashboard";
import LearnPage from "./pages/LearnPage";
import QuizPage from "./pages/QuizPage";
import GamePage from "./pages/GamePage";

import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPasswordPopup from "./components/ForgotPasswordPopup";
import ResetPassword from "./components/ResetPassword";
import About_us from "./components/About_us";

import Features from "./components/Features";
import Courses from "./components/Courses";
import Community from "./components/Community";
import Our_Team from "./components/Our_Team";
import Blog from "./components/Blog";
import Help_Center from "./components/Help_Center"; 
import Contact_Us from "./components/Contact_us";
import Faq from "./components/Faq";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<CyberSafetyLanding />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/learn" element={<LearnPage />} />

        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/game" element={<GamePage />} />


        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPasswordPopup />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/about_us" element={<About_us />} />
        <Route path="/features" element={<Features />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/community" element={<Community />} />
        <Route path="/our_team" element={<Our_Team />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/help_center" element={<Help_Center />} />
        <Route path="/contact_us" element={<Contact_Us />} />
        <Route path="/faq" element={<Faq />} />

      </Routes>
    </Router>
  );
}

export default App;