import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, type = "error", title = null, duration = 4500 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const defaultTitle = 
      type === "error" ? "Action Failed" :
      type === "success" ? "Success" :
      type === "warning" ? "Notice" : "System Alert";

    const newToast = {
      id,
      message,
      type,
      title: title || defaultTitle,
      duration
    };

    setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 toasts on screen

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    error: (msg, title, duration) => addToast({ message: msg, type: "error", title, duration }),
    success: (msg, title, duration) => addToast({ message: msg, type: "success", title, duration }),
    warning: (msg, title, duration) => addToast({ message: msg, type: "warning", title, duration }),
    info: (msg, title, duration) => addToast({ message: msg, type: "info", title, duration }),
  };

  const getStyle = (type) => {
    switch (type) {
      case "success":
        return {
          border: "border-emerald-500/40",
          glow: "shadow-[0_8px_30px_rgb(16,185,129,0.15)]",
          iconBg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
          bar: "bg-emerald-400",
          icon: <CheckCircle2 className="w-5 h-5" />
        };
      case "warning":
        return {
          border: "border-amber-500/40",
          glow: "shadow-[0_8px_30px_rgb(245,158,11,0.15)]",
          iconBg: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
          bar: "bg-amber-400",
          icon: <AlertTriangle className="w-5 h-5" />
        };
      case "info":
        return {
          border: "border-cyan-500/40",
          glow: "shadow-[0_8px_30px_rgb(6,182,212,0.15)]",
          iconBg: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
          bar: "bg-cyan-400",
          icon: <Info className="w-5 h-5" />
        };
      case "error":
      default:
        return {
          border: "border-rose-500/40",
          glow: "shadow-[0_8px_30px_rgb(244,63,94,0.2)]",
          iconBg: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
          bar: "bg-rose-500",
          icon: <XCircle className="w-5 h-5" />
        };
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* FLOATING TOP-RIGHT TOAST NOTIFICATION CONTAINER */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-none max-w-sm w-full sm:w-96 px-3 sm:px-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const style = getStyle(t.type);
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 120, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ 
                  opacity: 0, 
                  y: 30, 
                  scale: 0.92, 
                  transition: { duration: 0.35, ease: "easeIn" } 
                }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-[#0c121e]/95 backdrop-blur-2xl border ${style.border} ${style.glow} p-4 text-slate-100 shadow-2xl flex items-start gap-3.5`}
              >
                {/* ICON */}
                <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${style.iconBg}`}>
                  {style.icon}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs font-bold tracking-wide text-white capitalize">
                    {t.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words font-sans">
                    {t.message}
                  </p>
                </div>

                {/* DISMISS BUTTON */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* TIMEOUT PROGRESS BAR AT BOTTOM */}
                {t.duration > 0 && (
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: t.duration / 1000, ease: "linear" }}
                    style={{ originX: 0 }}
                    className={`absolute bottom-0 left-0 right-0 h-1 ${style.bar} opacity-70`}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
