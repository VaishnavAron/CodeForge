import React from "react";
import { RotateCcw, Check, Sparkles, Terminal } from "lucide-react";

const languages = [
  { id: "javascript", label: "JavaScript (Node 20)" },
  { id: "java", label: "Java (OpenJDK 17)" },
  { id: "c++", label: "C++ (GCC 13)" },
];

const EditorHeader = ({
  selectedLanguage,
  onLanguageChange,
  onResetCode,
  isDraftSaved = false,
  isExecuting = false,
}) => {
  return (
    <div className="h-12 border-b border-slate-800/80 flex items-center justify-between px-4 bg-[#0d131f]/70 backdrop-blur-md flex-shrink-0">
      {/* LANGUAGE SELECTOR PILLS */}
      <div className="flex items-center gap-1.5">
        {languages.map((lang) => {
          const isActive = selectedLanguage === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              disabled={isExecuting}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>

      {/* RIGHT METRICS & UTILITY ACTIONS */}
      <div className="flex items-center gap-3">
        {/* DRAFT SAVED INDICATOR */}
        {isDraftSaved && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Draft saved locally</span>
          </div>
        )}

        {/* RESET STARTER TEMPLATE */}
        <button
          onClick={onResetCode}
          disabled={isExecuting}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all font-medium"
          title="Reset code to original starter template"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">Reset</span>
        </button>

        {/* HOTKEY BADGE */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/50">
          <span>Run:</span>
          <kbd className="text-slate-300 bg-slate-800 px-1 py-0.2 rounded text-[9px]">Ctrl</kbd>
          <span>+</span>
          <kbd className="text-slate-300 bg-slate-800 px-1 py-0.2 rounded text-[9px]">Enter</kbd>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
