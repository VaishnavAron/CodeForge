import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../authSlice";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "../context/ToastContext";

const formSchema = z.object({
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (error) {
      toast.error(error, "Authentication Failed");
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Welcome back to CodeForge!", "Logged In");
      navigate("/problems");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid mask-radial-faded pointer-events-none opacity-30" />
      
      {/* Ambient Lighting Beams */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
              <LogIn className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Sign in to execute code, track submissions, and build streaks.
            </p>
          </div>

          {/* ⚡ ONE-CLICK RECRUITER DEMO LOGIN */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => dispatch(loginUser({ emailId: "demo@codeforge.com", password: "DemoUser@2026!" }))}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_-3px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse group-hover:scale-110 transition-transform" />
              <span>⚡ One-Click Recruiter Demo Login</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-[#0b101b] px-2 text-gray-400">or sign in with credentials</span>
              </div>
            </div>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>{typeof error === "string" ? error : "Invalid credentials"}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register("emailId")}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-black/40 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.emailId 
                      ? "border-red-500/60 focus:border-red-400" 
                      : "border-white/10 focus:border-cyan-500/60"
                  }`}
                />
              </div>
              {errors.emailId && (
                <p className="text-[11px] text-red-400 mt-1">
                  {errors.emailId.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-black/40 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.password 
                      ? "border-red-500/60 focus:border-red-400" 
                      : "border-white/10 focus:border-cyan-500/60"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_0px_rgba(99,102,241,0.7)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Create an account
            </NavLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;