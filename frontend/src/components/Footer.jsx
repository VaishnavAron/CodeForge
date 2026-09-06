import React from 'react';
import { Terminal } from 'lucide-react';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full bg-[#080c14] border-t border-slate-800/80 mt-auto py-8 px-4 sm:px-6 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand & Developer Bio */}
        <div className="flex flex-col items-center sm:items-start gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-white tracking-tight">CodeForge</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM OPERATIONAL
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Engineered with passion by <span className="text-white font-medium">Vaishnav Aron</span>. Built as a high-throughput algorithmic assessment platform.
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="px-2 py-1 rounded-md bg-slate-800/70 border border-slate-700/60">React 19</span>
          <span className="px-2 py-1 rounded-md bg-slate-800/70 border border-slate-700/60">Node.js</span>
          <span className="px-2 py-1 rounded-md bg-slate-800/70 border border-slate-700/60">Redis Cloud</span>
          <span className="px-2 py-1 rounded-md bg-slate-800/70 border border-slate-700/60">Judge0 CE</span>
          <span className="px-2 py-1 rounded-md bg-purple-950/40 text-purple-300 border border-purple-800/50">Groq LPU</span>
        </div>

        {/* Social & Portfolio Links */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/VaishnavAron/CodeForge"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all text-[11px] font-medium shadow-sm"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/vaishnav-aron/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 hover:text-cyan-200 border border-cyan-800/40 transition-all text-[11px] font-medium shadow-sm"
          >
            <LinkedinIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
