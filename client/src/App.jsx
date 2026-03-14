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

import Contact_cyber from "./components/Contact-cyber";
import Features_cyber from "./components/Features-cyber";
import Help_center from "./components/Help-center";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<CyberSafetyLanding />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPasswordPopup />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/about-us" element={<About_us />} />

        <Route path="/features" element={<Features_cyber />} />
        <Route path="/contact" element={<Contact_cyber />} />
        <Route path="/help-center" element={<Help_center />} />

      </Routes>
    </Router>
  );
}

export default App;