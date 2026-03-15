// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import CyberSafetyLanding from "./pages/Landing/CyberSafetyLanding.jsx";
// import Register from "./components/Register.jsx";
// import Login from './components/Login.jsx';
// import ForgotPasswordPopup from './components/ForgotPasswordPopup.jsx';
// import ResetPassword from './components/ResetPassword';
// import About_us from "./components/About_us";

// import Contact_cyber from "./components/Contact-cyber";
// import Features_cyber from "./components/Features-cyber";
// import Help_center from "./components/Help-center";

// function App() {
//   return (
//     <Router>
//       <Routes>

//         <Route path="/" element={<CyberSafetyLanding />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPopup />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />
//         <Route path="/about_us" element={<About_us />} />

//         <Route path="/contact" element={<Contact_cyber />} />
//         <Route path="/features" element={<Features_cyber />} />
//         <Route path="/help-center" element={<Help_center />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CyberSafetyLanding from "./pages/Landing/CyberSafetyLanding";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPasswordPopup from "./components/ForgotPasswordPopup";
import ResetPassword from "./components/ResetPassword";
import About_us from "./components/About_us";
<<<<<<< HEAD

import Contact_cyber from "./components/Contact-cyber";
import Features_cyber from "./components/Features-cyber";
import Help_center from "./components/Help-center";
=======
import Features from "./components/Features";
import Courses from "./components/Courses";
import Community from "./components/Community";
import Our_Team from "./components/Our_Team";
import Blog from "./components/Blog";
import Help_Center from "./components/Help_Center"; 
import Contact_Us from "./components/Contact_us";
import Faq from "./components/Faq.jsx";
>>>>>>> e66201894e5818cdaba39841f3e195c83f6f9c8f

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<CyberSafetyLanding />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPasswordPopup />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
<<<<<<< HEAD

        <Route path="/about-us" element={<About_us />} />

        <Route path="/features" element={<Features_cyber />} />
        <Route path="/contact" element={<Contact_cyber />} />
        <Route path="/help-center" element={<Help_center />} />

=======
        <Route path="/about_us" element={<About_us />} />
        <Route path="/features" element={<Features />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/community" element={<Community />} />
        <Route path="/our_team" element={<Our_Team />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/help_center" element={<Help_Center />} />
        <Route path="/contact_us" element={<Contact_Us />} />
        <Route path="/faq" element={<Faq />} />
>>>>>>> e66201894e5818cdaba39841f3e195c83f6f9c8f
      </Routes>
    </Router>
  );
}

export default App;