import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CyberSafetyLanding from "./pages/Landing/CyberSafetyLanding.jsx";
import Register from "./components/Register.jsx";
import Login from './components/Login.jsx';
import ForgotPasswordPopup from './components/ForgotPasswordPopup.jsx';
import ResetPassword from './components/ResetPassword';
import About_us from "./components/About_us";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CyberSafetyLanding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPopup />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/about_us" element={<About_us />} />
      </Routes>
    </Router>
  );
}

export default App;