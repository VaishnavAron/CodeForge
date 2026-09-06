import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import PremiumPage from "./pages/PremiumPage";
import Footer from "./components/Footer";
import { checkAuth } from "./authSlice";

function App() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      {/* Unified Global Floating Glassmorphic Navbar */}
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Landing Page (v0.dev Aesthetic) */}
          <Route path="/" element={<LandingPage />} />

          {/* Explore Problems Arena */}
          <Route path="/problems" element={<Homepage />} />

          {/* Premium Pricing & Tiers */}
          <Route path="/premium" element={<PremiumPage />} />

          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/problems" replace /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/problems" replace /> : <Signup />} 
          />

          {/* Problem Workspace IDE */}
          <Route path="/problem/:problemId" element={<ProblemPage />} />

          {/* Admin Problem Creator */}
          <Route 
            path="/admin" 
            element={isAuthenticated && user?.role === "admin" ? <AdminPanel /> : <Navigate to="/login" replace />} 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Application Footer */}
      <Footer />
    </div>
  );
}

export default App;