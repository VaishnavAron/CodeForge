import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Shield, 
  Crown, 
  ArrowRight, 
  Cpu, 
  Terminal, 
  HelpCircle, 
  Star,
  Layers,
  Code2,
  CheckCircle2,
  Rocket,
  X
} from "lucide-react";

const PremiumPage = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [comingSoonModal, setComingSoonModal] = useState({ isOpen: false, planName: "" });

  const plans = [
    {
      id: "free",
      name: "Community",
      tagline: "Foundational algorithm practice for everyone.",
      priceMonthly: 0,
      priceAnnual: 0,
      popular: false,
      badge: null,
      ctaText: "Current Plan",
      ctaLink: "/problems",
      ctaStyle: "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700",
      features: [
        "103 Curated DSA challenges (Foundations, Graphs, DP)",
        "1 Free Groq AI Mentor query per problem",
        "Multi-language runtime (C++, Java, Python, JS)",
        "Public test suites & complexity bounds",
        "Discussion forum & peer solutions",
        "Standard community execution queue"
      ],
      missing: [
        "Unlimited Groq LPU AI hints",
        "Company tags (Google, Meta, Amazon)",
        "Priority sandbox queue",
        "Mock interview simulation"
      ]
    },
    {
      id: "plus",
      name: "CodeForge Plus",
      tagline: "Accelerated interview readiness for top tech offers.",
      priceMonthly: 15,
      priceAnnual: 12,
      popular: true,
      badge: "MOST POPULAR",
      ctaText: "Upgrade to Plus",
      ctaLink: null,
      ctaStyle: "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-950/60 font-bold",
      features: [
        "Everything in Community",
        "Unlimited Groq LPU AI Socratic hints (sub-400ms)",
        "Automated edge-case generator & bug diagnoser",
        "FAANG company question tags & frequencies",
        "Zero-latency priority Judge0 sandbox queue",
        "Video editorials & formal proofs of optimality",
        "Targeted interview study pathways"
      ],
      missing: [
        "1-on-1 AI technical mock interviews",
        "Concurrency & multi-threaded sandbox"
      ]
    },
    {
      id: "booster",
      name: "Pro Booster",
      tagline: "Comprehensive system simulation for Senior/Staff roles.",
      priceMonthly: 35,
      priceAnnual: 29,
      popular: false,
      badge: "SYSTEMS & ENTERPRISE",
      ctaText: "Upgrade to Booster",
      ctaLink: null,
      ctaStyle: "bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white shadow-lg shadow-amber-950/40 font-bold",
      features: [
        "Everything in CodeForge Plus",
        "1-on-1 Voice/Text AI Technical Mock Interviews",
        "Real-time behavioral & algorithmic rubric scoring",
        "Concurrency & multi-threading sandbox environment",
        "Dedicated isolated Docker runtime worker",
        "Verified Candidate Badge for LinkedIn & Resume",
        "Direct 24/7 Slack channel access to engineering mentors"
      ],
      missing: []
    }
  ];

  const comparisonRows = [
    { name: "DSA Problems Catalog", free: "103 Problems", plus: "All 103 + Bonus", booster: "Full Catalog + New Weekly" },
    { name: "Groq LPU AI Mentor", free: "1 query / problem", plus: "Unlimited Queries", booster: "Unlimited + Socratic Voice" },
    { name: "AI Inference Latency", free: "Standard (~1.5s)", plus: "Sub-second (<400ms)", booster: "Sub-second (<400ms)" },
    { name: "Execution Queue Priority", free: "Standard Shared", plus: "Priority Accelerated", booster: "Dedicated Isolated Worker" },
    { name: "FAANG Company Tags", free: "Locked", plus: "Included (Meta, Google, etc.)", booster: "Included + Frequency Trends" },
    { name: "Concurrency & Mutex Sandbox", free: "No", plus: "Read-only", booster: "Full Multi-thread Debugger" },
    { name: "AI Mock Interviews", free: "No", plus: "1 Session / mo", booster: "Unlimited Sessions" },
    { name: "Verified Portfolio Badge", free: "No", plus: "Standard", booster: "Verified Cryptographic Proof" },
  ];

  const faqs = [
    {
      q: "Can I cancel or change my plan at any time?",
      a: "Yes! There are no lock-in contracts. You can upgrade, downgrade, or cancel your subscription at any time with a single click from your profile settings."
    },
    {
      q: "How does the Groq LPU AI Mentor differ from generic chatbots?",
      a: "CodeForge AI is hermetically restricted to algorithmic guidance. Powered by ultra-fast Groq LPU inference, it evaluates your live code AST and input bounds in under 400ms, providing Socratic nudges rather than giving away solutions."
    },
    {
      q: "Can I expense this subscription through my employer?",
      a: "Absolutely. Many engineers expense CodeForge as professional learning and development. All invoices include tax details and are formatted for standard corporate expense reports."
    },
    {
      q: "Is there an educational discount for students?",
      a: "Yes! Verified students with an active .edu email address receive an additional 30% discount on all annual subscription plans."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 selection:bg-purple-500/30">
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-purple-900/20 via-cyan-900/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>INVEST IN YOUR FAANG PREPARATION</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
          >
            Master DSA with{" "}
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Unfair AI Advantage
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 leading-relaxed"
          >
            Stop wasting hours stuck on edge cases. Unlock unlimited sub-second Groq LPU mentoring, real FAANG questions, and priority execution.
          </motion.p>

          {/* BILLING INTERVAL TOGGLE */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex items-center justify-center gap-4"
          >
            <span className={`text-sm font-medium ${!annual ? "text-white" : "text-slate-400"}`}>
              Monthly billing
            </span>

            <button
              onClick={() => setAnnual(!annual)}
              className="w-14 h-8 rounded-full bg-slate-800 border border-slate-700 p-1 flex items-center transition-colors cursor-pointer focus:outline-none"
            >
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-md transform transition-transform ${
                  annual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span className={`text-sm font-medium flex items-center gap-1.5 ${annual ? "text-white" : "text-slate-400"}`}>
              <span>Annual billing</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 items-stretch">
          {plans.map((plan, idx) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (idx + 1) }}
                className={`relative rounded-2xl flex flex-col p-8 transition-all ${
                  plan.popular
                    ? "bg-[#0f172a]/95 border-2 border-purple-500/80 shadow-[0_0_40px_-5px_rgba(168,85,247,0.3)] scale-[1.02] lg:-translate-y-2 z-10"
                    : "bg-[#0d131f]/80 border border-slate-800/80 hover:border-slate-700 shadow-lg"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    {plan.popular && <Crown className="w-5 h-5 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 min-h-[32px]">
                    {plan.tagline}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      / month {annual && price > 0 && "(billed annually)"}
                    </span>
                  </div>
                </div>

                {/* CTA BUTTON */}
                <div className="mt-6">
                  {plan.ctaLink ? (
                    <Link
                      to={plan.ctaLink}
                      className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${plan.ctaStyle}`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setComingSoonModal({ isOpen: true, planName: plan.name })}
                      className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${plan.ctaStyle}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-slate-800/80 my-7" />

                {/* FEATURES LIST */}
                <div className="flex-1 space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    What's included:
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}

                    {plan.missing.map((miss, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-2.5 text-xs text-slate-500 line-through opacity-60">
                        <X className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                        <span>{miss}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* COMPARISON TABLE */}
        <div className="mt-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Feature-by-Feature Matrix
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Compare capabilities side-by-side to choose the best plan for your timeline.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0d131f]/60 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#080d14]/80 text-slate-300 font-mono">
                  <th className="p-4 sm:p-5 font-semibold">Feature</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-400">Community ($0)</th>
                  <th className="p-4 sm:p-5 font-semibold text-purple-300 bg-purple-950/20">Plus ($12/mo)</th>
                  <th className="p-4 sm:p-5 font-semibold text-amber-300">Booster ($29/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparisonRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">{row.name}</td>
                    <td className="p-4 sm:p-5 text-slate-400">{row.free}</td>
                    <td className="p-4 sm:p-5 font-semibold text-purple-200 bg-purple-950/10">{row.plus}</td>
                    <td className="p-4 sm:p-5 text-slate-200">{row.booster}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="mt-28 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything you need to know about plans, billing, and the AI mentor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="p-6 rounded-xl bg-[#0d131f]/80 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-2.5 shadow-sm"
              >
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="mt-24 rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-cyan-900/30 border border-purple-500/30 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Accelerate Your DSA Mastery?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Join thousands of engineers practicing with sub-second Groq AI feedback and targeted company patterns.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-4">
              <Link
                to="/problems"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-950/60 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Start Practicing for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* COMING SOON MODAL */}
      <AnimatePresence>
        {comingSoonModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setComingSoonModal({ isOpen: false, planName: "" })}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* MODAL CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-[#0f172a] border border-purple-500/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_-10px_rgba(168,85,247,0.4)] z-10 overflow-hidden"
            >
              {/* ACCENT GLOW BEHIND MODAL */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setComingSoonModal({ isOpen: false, planName: "" })}
                className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4">
                {/* ICON */}
                <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 border border-purple-500/40 text-purple-400 shadow-inner">
                  <Rocket className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>

                {/* BADGE */}
                <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                  Payment Gateway Coming Soon
                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {comingSoonModal.planName}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  We are currently integrating automated payment gateways (Stripe & Razorpay) for zero-friction subscriptions.
                </p>

                {/* UNLOCKED BETA PERKS CALLOUT */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-left space-y-2">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Public Beta Advantage:</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li><span className="text-white font-medium">All 103+ DSA Challenges</span> are completely unlocked for everyone.</li>
                    <li><span className="text-white font-medium">Groq LPU AI Mentor</span> is active with sub-400ms Socratic hints.</li>
                    <li><span className="text-white font-medium">Multi-language Judge0 Sandbox</span> running with zero cost.</li>
                  </ul>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setComingSoonModal({ isOpen: false, planName: "" });
                      navigate("/problems");
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-950/60 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Explore 103+ Challenges</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setComingSoonModal({ isOpen: false, planName: "" })}
                    className="py-3 px-5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumPage;
