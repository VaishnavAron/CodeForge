import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Sparkles, 
  Code2, 
  Clock, 
  Database,
  BarChart3,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Workflow,
  Server,
  Lock,
  Target
} from "lucide-react";
import { useSelector } from "react-redux";

const codeSnippets = {
  cpp: `// Problem: Two Sum Target
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    
    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int val; cin >> val;
        int complement = target - val;
        if (seen.count(complement)) {
            cout << seen[complement] << " " << i << "\\n";
            return 0;
        }
        seen[val] = i;
    }
    return 0;
}`,
  javascript: `// Problem: Two Sum Target
const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length < 2) return;
    
    const [n, target] = [Number(input[0]), Number(input[1])];
    const seen = new Map();
    
    for (let i = 0; i < n; i++) {
        const val = Number(input[2 + i]);
        const comp = target - val;
        if (seen.has(comp)) {
            console.log(\`\${seen.get(comp)} \${i}\`);
            return;
        }
        seen.set(val, i);
    }
}

solve();`,
  java: `// Problem: Two Sum Target
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int target = sc.nextInt();
        
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            int complement = target - val;
            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                return;
            }
            map.put(val, i);
        }
    }
}`
};

const tracks = [
  {
    title: "Array & Two Pointers",
    level: "Foundations",
    levelColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    problems: "24 Challenges",
    desc: "Master in-place manipulation, sliding windows, prefix sums, and binary search patterns.",
    companies: ["Google", "Amazon", "Microsoft"],
    link: "/problems?tag=array"
  },
  {
    title: "Trees & Graph Traversal",
    level: "Intermediate",
    levelColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    problems: "32 Challenges",
    desc: "Depth-first search, BFS level orders, topological sorting, and shortest path trees.",
    companies: ["Meta", "Uber", "Bloomberg"],
    link: "/problems?tag=graph"
  },
  {
    title: "Dynamic Programming",
    level: "Advanced",
    levelColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    problems: "28 Challenges",
    desc: "1D/2D memoization, knapsack variants, decision trees, and space optimization techniques.",
    companies: ["Apple", "Netflix", "Atlassian"],
    link: "/problems?tag=dp"
  },
  {
    title: "System & Concurrency",
    level: "Specialized",
    levelColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    problems: "18 Challenges",
    desc: "Thread-safe data structures, mutex simulation, bitwise tricks, and CPU cache friendly code.",
    companies: ["Stripe", "Databricks", "Jane Street"],
    link: "/problems"
  }
];

const faqs = [
  {
    q: "How does CodeForge safely isolate and execute arbitrary user code?",
    a: "Every submission is offloaded to Judge0 remote execution micro-containers with strict Linux cgroup isolation. Memory is capped per process (max 256MB), CPU wall times are limited to prevent infinite loops, and socket networking is explicitly disabled to prevent server scanning."
  },
  {
    q: "How does CodeForge prevent compiler exhaustion & DDoS attacks?",
    a: "We implemented a sliding-window rate limiter using Redis sorted sets (ZADD, ZREMRANGEBYSCORE). Each authenticated session and IP is throttled to a rolling burst window, preventing automated scripts from overwhelming the compiler."
  },
  {
    q: "Can administrators create and test problems without manual database insertion?",
    a: "Yes! The platform includes a dedicated Admin CMS (/admin). Administrators can specify visible test cases, hidden edge suites, starter templates across multiple languages, and automatic reference solution verification prior to publishing."
  },
  {
    q: "How does the platform benchmark code runtime and memory?",
    a: "Execution metrics are measured directly from the Linux kernel execution runtime using the Judge0 engine. Total wall time (in seconds) and peak resident memory (KB) are measured across every test case and reported in the interactive console."
  }
];

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedLang, setSelectedLang] = useState("cpp");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative">
      {/* Background Dot Grid Matrix with Soft Radial Mask */}
      <div className="absolute inset-0 bg-dot-grid mask-radial-faded pointer-events-none opacity-25" />

      {/* Ambient Lighting Beams (Soft Slate, Cyan, Violet) */}
      <div className="absolute top-10 left-1/4 w-[32rem] h-[32rem] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-36 right-1/4 w-[36rem] h-[36rem] bg-indigo-600/12 rounded-full blur-[160px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* STAGE 1: COMMERCIAL HERO PITCH */}
      {/* ========================================================================= */}
      <main className="relative max-w-6xl mx-auto px-6 pt-10 pb-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Pitch */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-slate-900/80 text-cyan-300 text-xs font-medium backdrop-blur-md mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Enterprise Algorithmic Assessment Platform</span>
            </div>

            {/* Commercial Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] mb-6 text-slate-50">
              The Next-Gen{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                Engineering Sandbox
              </span>{" "}
              for Scalable Algorithms.
            </h1>

            {/* Outcome-focused Pitch */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-8">
              Practice, evaluate, and benchmark code against edge-case test matrices in zero-trust micro-containers. Engineered for high-throughput technical recruitment and mastery.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <NavLink to="/problems">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-semibold text-sm flex items-center gap-2.5 shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_0px_rgba(99,102,241,0.7)] transition-all cursor-pointer"
                >
                  <span>Explore All Problems</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </NavLink>

              {!isAuthenticated ? (
                <NavLink to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm backdrop-blur-md transition-all cursor-pointer"
                  >
                    Start Free Trial
                  </motion.button>
                </NavLink>
              ) : (
                <NavLink to="/admin">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-sm backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Challenge Studio</span>
                  </motion.button>
                </NavLink>
              )}
            </div>

            {/* Trust Checklist */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-6 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Host Overhead</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Real-Time Benchmarks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Anti-Abuse Engine</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Code Terminal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-purple-500/15 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden"
            >
              {/* Window Header */}
              <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>

                <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
                  {["cpp", "javascript", "java"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        selectedLang === lang 
                          ? "bg-slate-700/80 text-cyan-300 font-semibold shadow-sm" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {lang === "cpp" ? "Solution.cpp" : lang === "javascript" ? "Solution.js" : "Solution.java"}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Sandbox Live</span>
                </div>
              </div>

              {/* Code Editor Body */}
              <div className="p-5 font-mono text-xs leading-relaxed text-slate-300 overflow-x-auto bg-[#070b12]">
                <pre className="text-slate-200">
                  <code>{codeSnippets[selectedLang]}</code>
                </pre>
              </div>

              {/* Verified Result Banner */}
              <div className="px-4 py-3 bg-emerald-950/20 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Accepted (All 4 Tests Passed)</span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span>Runtime: <span className="text-slate-200 font-semibold">0.012s</span></span>
                  <span>•</span>
                  <span>Memory: <span className="text-slate-200 font-semibold">3.4 MB</span></span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 2: HOW IT WORKS — THE 3-STAGE EXECUTION PIPELINE */}
        {/* ========================================================================= */}
        <section className="mt-32">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/20 text-indigo-300 text-xs font-medium mb-3">
              <Workflow className="w-3.5 h-3.5 text-indigo-400" />
              <span>High-Throughput Architecture</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
              How CodeForge Evaluates Submissions
            </h2>
            <p className="text-sm text-slate-400">
              A decoupled distributed pipeline designed to handle concurrent compilations safely and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all backdrop-blur-sm relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Monaco Code Authoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Users draft solutions in a VS Code Monaco editor with dynamic multi-language AST switching, syntax validation, and draft autosaving.
              </p>
              <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                <span>Client Payload</span> ➔ <span>POST /submission/run</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-violet-500/30 transition-all backdrop-blur-sm relative">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Redis Sliding-Window Gate</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Submissions pass through an atomic Redis ZADD rolling window. Exhaustion limits block runaway loops and bot denial-of-service attempts.
              </p>
              <div className="text-[11px] font-mono text-violet-400 flex items-center gap-1">
                <span>Redis Sorted Sets</span> ➔ <span>O(1) Throttling</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all backdrop-blur-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Isolated Judge0 Sandbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                The compilation executes in sandboxed micro-containers across visible and hidden test batches with real-time CPU & memory metrics.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span>Linux cgroups</span> ➔ <span>Sub-second Pass/Fail</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STAGE 3: STRUCTURED CURRICULUM TRACKS */}
        {/* ========================================================================= */}
        <section className="mt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs font-medium mb-3">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Curated Interview Roadmaps</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Master DSA by Industry Topic
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Structured patterns tested by top engineering organizations worldwide.
              </p>
            </div>

            <NavLink to="/problems">
              <span className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer">
                View All Categories <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tracks.map((track) => (
              <NavLink 
                to={track.link} 
                key={track.title}
                className="block h-full group focus:outline-none"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 group-hover:border-cyan-500/50 group-hover:bg-slate-900/90 transition-all flex flex-col justify-between shadow-sm group-hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)] cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${track.levelColor}`}>
                        {track.level}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {track.problems}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{track.title}</span>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      {track.desc}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Targeted By:</span>
                    <span className="text-slate-300 font-sans">{track.companies.join(", ")}</span>
                  </div>
                </motion.div>
              </NavLink>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STAGE 4: PLATFORM COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <section className="mt-32">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs font-medium mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              <span>Competitive Benchmarks</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
              Why CodeForge Outperforms Legacy Platforms
            </h2>
            <p className="text-sm text-slate-400">
              Modern cloud architecture versus dated single-server monolithic execution.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="p-4 sm:p-5">Architectural Feature</th>
                  <th className="p-4 sm:p-5 text-cyan-300 font-bold">CodeForge Platform</th>
                  <th className="p-4 sm:p-5">Generic Tutorial Clones</th>
                  <th className="p-4 sm:p-5">Legacy CP Websites</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Execution Isolation</td>
                  <td className="p-4 sm:p-5 text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Dedicated Linux cgroups
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Unsafe Local child_process</td>
                  <td className="p-4 sm:p-5 text-slate-400">Heavyweight Virtual Machines</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Abuse & DDoS Defense</td>
                  <td className="p-4 sm:p-5 text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Redis Sliding-Window Log
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">None (Prone to server crashes)</td>
                  <td className="p-4 sm:p-5 text-slate-400">Static IP bans (Unfriendly)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Token Invalidation</td>
                  <td className="p-4 sm:p-5 text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Redis TTL Session Blacklist
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Stateless (Cannot revoke JWT)</td>
                  <td className="p-4 sm:p-5 text-slate-400">Database read per request</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">CMS Problem Creation</td>
                  <td className="p-4 sm:p-5 text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Full In-Browser Studio
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Manual database seeding</td>
                  <td className="p-4 sm:p-5 text-slate-400">Closed internal backoffice</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STAGE 5: ENTERPRISE FAQ & TECHNICAL SPECIFICATIONS */}
        {/* ========================================================================= */}
        <section className="mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs font-medium mb-3">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Technical Deep Dive</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400">
              Clear technical breakdowns of our sandboxing, caching, and security architecture.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-200 hover:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STAGE 6: PRE-FOOTER CALL TO ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="mt-32 p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950/40 border border-slate-700/80 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to Master Your Next Technical Interview?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Join hundreds of engineers practicing on clean, low-latency micro-containers with instant test benchmarks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <NavLink to="/problems">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] hover:shadow-[0_0_35px_0px_rgba(99,102,241,0.8)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Launch Practice Arena</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </NavLink>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-28 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold">CodeForge Assessment Platform</span>
          </div>
          <div>
            Architected with Node.js, Express, MongoDB Atlas, Redis, & Judge0 CE.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
