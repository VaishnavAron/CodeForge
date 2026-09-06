import React from "react";
import { Play, Send, ChevronUp, ChevronDown, ShieldCheck } from "lucide-react";

const WorkspaceActions = ({
  onRun,
  onSubmit,
  loading = false,
  toggleConsole,
  isConsoleOpen = true,
}) => {
  return (
    <div className="h-14 border-t border-slate-800/90 flex items-center justify-between px-4 bg-[#0d131f]/90 backdrop-blur-md flex-shrink-0">
      {/* CONSOLE TOGGLE & SERVICE BADGES */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleConsole}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 border border-slate-800 transition-all font-mono"
        >
          {isConsoleOpen ? (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Console</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Console</span>
            </>
          )}
        </button>

        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-500 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800/80">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400/80" />
          <span>Redis Sliding Window • Judge0 Sandbox</span>
        </div>
      </div>

      {/* RUN & SUBMIT BUTTONS */}
      <div className="flex items-center gap-3">
        {/* RUN BUTTON */}
        <button
          onClick={onRun}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700/80 transition-all shadow-sm group"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          )}
          <span>Run</span>
        </button>

        {/* SUBMIT BUTTON */}
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-950/40 border border-emerald-400/20 group"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          )}
          <span>Submit Solution</span>
        </button>
      </div>
    </div>
  );
};

export default WorkspaceActions;
