import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, LogOut, Code2, Sparkles, RefreshCw, Laptop, Menu, X } from "lucide-react";
import { logoutUser, checkAuth } from "../authSlice";
import axiosClient from "../utils/axiosClient";

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Explore Problems", path: "/problems" },
    { name: "Premium", path: "/premium", isPro: true, badge: "Pro" },
  ];

  if (isAuthenticated && user?.role === "admin") {
    navItems.push({ 
      name: "Admin CMS", 
      path: "/admin", 
      badge: "Admin" 
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full pt-4 px-4 sm:px-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl mx-auto pointer-events-auto rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 shadow-[0_12px_40px_-5px_rgba(0,0,0,0.7)] px-5 py-3 flex items-center justify-between transition-all"
      >
        {/* Brand Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-violet-500/30 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 text-cyan-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-none">
              CodeForge
            </span>
            <span className="text-[10px] text-cyan-400/80 font-mono tracking-wide mt-0.5">
              ASSESSMENT OS
            </span>
          </div>
        </NavLink>

        {/* Center Nav Links with Framer Motion Sliding Pill */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/50 border border-slate-700/40 p-1 rounded-xl">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg focus:outline-none"
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-slate-700/70 border border-slate-600/60 rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.path === "/admin" && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                  {item.isPro && <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
                  <span className={item.isPro ? "bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent font-medium" : ""}>
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      item.isPro 
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold" 
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Right Side User / Auth Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Read-Only Admin Role Badge (Only for legitimate admins) */}
              {user.role === "admin" && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-semibold shadow-sm">
                  <Shield className="w-3 h-3 text-amber-400" />
                  <span>Admin</span>
                </div>
              )}

              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white leading-none">
                  {user.firstName || "User"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {user.emailId || "verified"}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-slate-800"
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="relative group overflow-hidden px-4 py-1.5 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_0px_rgba(99,102,241,0.7)] transition-all cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-1">
                  Sign Up Free
                </span>
              </NavLink>
            </div>
          )}

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/VaishnavAron/CodeForge"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition-colors shadow-sm ml-1"
            title="View Source on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto mt-2 pointer-events-auto rounded-2xl bg-[#0d131f]/95 backdrop-blur-2xl border border-slate-700/80 p-3 flex flex-col gap-1.5 shadow-2xl md:hidden"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.path === "/admin" && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                    {item.isPro && <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
                    <span>{item.name}</span>
                  </span>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      item.isPro 
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold" 
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
