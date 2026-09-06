import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../authSlice";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";
import { useToast } from "../context/ToastContext";

const formSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  emailId: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (error) {
      toast.error(error, "Registration Failed");
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Account created successfully!", "Welcome to CodeForge");
      navigate("/problems");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid mask-radial-faded pointer-events-none opacity-30" />

      {/* Ambient Lighting Beams */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
              <UserPlus className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create Account
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Join CodeForge to solve algorithm challenges and test in isolated sandboxes.
            </p>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>{typeof error === "string" ? error : "Registration failed"}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                First Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Alex"
                  {...register("firstName")}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-black/40 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.firstName 
                      ? "border-red-500/60 focus:border-red-400" 
                      : "border-white/10 focus:border-cyan-500/60"
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="text-[11px] text-red-400 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="alex@example.com"
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

            {/* Password Field with Eye Toggle */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm bg-black/40 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.password 
                      ? "border-red-500/60 focus:border-red-400" 
                      : "border-white/10 focus:border-cyan-500/60"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-gray-400">
            Already have an account?{" "}
            <NavLink to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign In
            </NavLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;