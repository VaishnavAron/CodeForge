import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  BookOpen, 
  Code2, 
  History, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  Tag, 
  Terminal,
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  Zap,
  Crown,
  Lock,
  ArrowRight
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import ReactMarkdown from "react-markdown";

const ProblemDescription = ({
  problem,
  activeTab,
  setActiveTab,
  submissionsList = [],
  fetchingSubmissions = false,
  userCode = "",
  selectedLanguage = "javascript",
}) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  // AI MENTOR STATES & USAGE LIMIT (1 Free Query per Problem)
  const storageKey = problem?._id ? `codeforge_ai_count_${problem._id}` : null;
  const [promptCount, setPromptCount] = useState(0);

  useEffect(() => {
    if (storageKey) {
      const stored = parseInt(localStorage.getItem(storageKey) || "0", 10);
      setPromptCount(stored);
    }
  }, [storageKey]);

  const [aiChat, setAiChat] = useState([
    {
      role: "assistant",
      text: `Hello! I am your Socratic AI Mentor powered by Groq LPU inference. I have full context of "${problem?.title || "this problem"}" and your editor code. How can I guide you without spoiling the solution?`
    }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // AUTO-SCROLL TO LATEST MESSAGE IN AI TAB
  useEffect(() => {
    if (activeTab === "ai") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiChat, activeTab]);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getDifficultyBadge = (diff) => {
    const d = (diff || "easy").toLowerCase();
    if (d === "easy") {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    if (d === "medium") {
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
    return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  };

  const handleSendAiPrompt = async (promptToSend) => {
    const text = promptToSend || aiInput;
    if (!text.trim() || aiLoading) return;

    // Check freemium limit (1 free prompt)
    if (promptCount >= 1) {
      return;
    }

    const userMessage = { role: "user", text };
    setAiChat((prev) => [...prev, userMessage]);
    setAiInput("");
    setAiLoading(true);

    try {
      const response = await axiosClient.post(`/problem/ai-hint/${problem._id}`, {
        prompt: text,
        userCode,
        language: selectedLanguage
      });

      const aiResponseText = response.data?.hint || "Here is a hint based on your current approach...";
      setAiChat((prev) => [...prev, { role: "assistant", text: aiResponseText }]);

      const newCount = promptCount + 1;
      setPromptCount(newCount);
      if (storageKey) {
        localStorage.setItem(storageKey, newCount.toString());
      }
    } catch (err) {
      console.error("AI Mentor Error:", err);
      const errMessage = err.response?.data?.message || "Failed to reach AI Mentor. Please check your connection.";
      setAiChat((prev) => [...prev, { role: "assistant", text: `⚠️ ${errMessage}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f17] text-gray-200 border-r border-slate-800/80 select-text overflow-hidden">
      {/* TAB HEADER */}
      <div className="h-12 border-b border-slate-800/80 flex items-center px-2 flex-shrink-0 bg-[#0d131f]/70 backdrop-blur-md overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("description")}
          className={`flex items-center gap-1.5 px-3.5 h-full text-xs font-medium transition-colors border-b-2 flex-shrink-0 ${
            activeTab === "description"
              ? "text-cyan-400 border-cyan-400 bg-cyan-500/5"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Description
        </button>

        <button
          onClick={() => setActiveTab("editorial")}
          className={`flex items-center gap-1.5 px-3.5 h-full text-xs font-medium transition-colors border-b-2 flex-shrink-0 ${
            activeTab === "editorial"
              ? "text-cyan-400 border-cyan-400 bg-cyan-500/5"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Editorial
        </button>

        <button
          onClick={() => setActiveTab("solutions")}
          className={`flex items-center gap-1.5 px-3.5 h-full text-xs font-medium transition-colors border-b-2 flex-shrink-0 ${
            activeTab === "solutions"
              ? "text-cyan-400 border-cyan-400 bg-cyan-500/5"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          Solutions
        </button>

        <button
          onClick={() => setActiveTab("submissions")}
          className={`flex items-center gap-1.5 px-3.5 h-full text-xs font-medium transition-colors border-b-2 flex-shrink-0 ${
            activeTab === "submissions"
              ? "text-cyan-400 border-cyan-400 bg-cyan-500/5"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Submissions
          {submissionsList.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300 font-mono">
              {submissionsList.length}
            </span>
          )}
        </button>

        {/* 5. AI SOCRATIC MENTOR TAB */}
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-1.5 px-3.5 h-full text-xs font-semibold transition-all border-b-2 flex-shrink-0 ${
            activeTab === "ai"
              ? "text-purple-300 border-purple-400 bg-purple-500/10 shadow-sm"
              : "text-purple-400/80 border-transparent hover:text-purple-200 hover:bg-purple-500/5"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>AI Mentor</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
            Groq LPU
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DEDICATED FULL-HEIGHT AI MENTOR CHATPANEL */}
      {/* ========================================================================= */}
      {activeTab === "ai" ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#0b0f17]">
          {/* Top Banner & Quick Prompt Chips */}
          <div className="p-4 border-b border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-md flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Socratic Code Mentor</span>
                    <span className="text-[10px] text-purple-400 font-mono font-normal">
                      • Hermetically Guarded
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Live context on your editor code & bounds. Guides intuition without spoiling solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <Zap className="w-3 h-3" />
                  <span>Groq LPU Sub-second</span>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-md border ${
                  promptCount >= 1 
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/30" 
                    : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                }`}>
                  <span>{promptCount >= 1 ? "0/1 Free Prompt" : "1/1 Free Prompt"}</span>
                </div>
              </div>
            </div>

            {/* LARGER QUICK PROMPT CHIPS */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              <button
                onClick={() => handleSendAiPrompt("Can you review my current editor code and point out logical or syntax errors?")}
                disabled={aiLoading || promptCount >= 1}
                className="text-xs font-semibold bg-slate-900/90 hover:bg-purple-950/40 text-slate-200 border border-slate-800 hover:border-purple-500/50 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Analyze my code bugs</span>
              </button>

              <button
                onClick={() => handleSendAiPrompt("What is the optimal time and space complexity for this problem, and why?")}
                disabled={aiLoading || promptCount >= 1}
                className="text-xs font-semibold bg-slate-900/90 hover:bg-cyan-950/40 text-slate-200 border border-slate-800 hover:border-cyan-500/50 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Explain optimal complexity</span>
              </button>

              <button
                onClick={() => handleSendAiPrompt("Give me a small conceptual hint for the next step without revealing the full answer.")}
                disabled={aiLoading || promptCount >= 1}
                className="text-xs font-semibold bg-slate-900/90 hover:bg-amber-950/40 text-slate-200 border border-slate-800 hover:border-amber-500/50 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Give conceptual hint</span>
              </button>
            </div>
          </div>

          {/* MIDDLE: SCROLLABLE CHAT FEED */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">
            {aiChat.map((msg, i) => {
              const isAi = msg.role === "assistant";
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 text-xs ${
                    isAi ? "bg-[#0e1626] border border-purple-900/30" : "bg-[#080d14] border border-slate-800"
                  } p-4 rounded-xl shadow-sm`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isAi
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-slate-500 mb-1">
                      {isAi ? "CodeForge AI Mentor" : "You"}
                    </div>
                    <div className="text-slate-200 text-xs leading-relaxed font-sans">
                      <ReactMarkdown
                        components={{
                          h3: ({ node, ...props }) => (
                            <h3 className="text-xs font-bold text-cyan-300 mt-2.5 mb-1 flex items-center gap-1 border-b border-slate-800/80 pb-0.5 tracking-wide font-mono" {...props} />
                          ),
                          h4: ({ node, ...props }) => (
                            <h4 className="text-xs font-semibold text-purple-300 mt-2 mb-1" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="my-1 text-slate-300 leading-relaxed" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc ml-4 space-y-1 my-1.5 text-slate-300" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal ml-4 space-y-1 my-1.5 text-slate-300" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="leading-relaxed" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="text-white font-semibold" {...props} />
                          ),
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code className="text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-1 py-0.2 rounded text-[11px] font-mono" {...props} />
                            ) : (
                              <code className="text-slate-200 font-mono text-[11px]" {...props} />
                            ),
                          pre: ({ node, ...props }) => (
                            <pre className="bg-[#05080f] border border-slate-800 p-2.5 rounded-xl overflow-x-auto my-2 text-[11px] font-mono text-slate-200 custom-scrollbar" {...props} />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-2 rounded-lg border border-slate-800 shadow-sm">
                              <table className="w-full text-left text-[11px] border-collapse" {...props} />
                            </div>
                          ),
                          th: ({ node, ...props }) => (
                            <th className="bg-[#0e1626] p-2 border-b border-slate-800 text-cyan-300 font-semibold font-mono" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="p-2 border-b border-slate-800/60 text-slate-300" {...props} />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}

            {aiLoading && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#0e1626] border border-purple-900/30 text-xs text-purple-300 font-mono">
                <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span>Groq LPU evaluating your code & problem bounds...</span>
              </div>
            )}

            {/* FREEMIUM 1-FREE HINT LIMIT UPGRADE CARD */}
            {promptCount >= 1 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-[#080d14] border border-purple-500/40 shadow-xl shadow-purple-950/30">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                    <Crown className="w-5 h-5 text-amber-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        Free Diagnostic Limit Reached (1/1 Used)
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                        Free Tier
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      You've used your 1 complimentary AI diagnostic for <strong className="text-white">"{problem.title}"</strong>. Upgrade to <strong className="text-purple-300">CodeForge Plus</strong> for unlimited sub-second Groq LPU mentoring, memory optimizations, and bug breakdowns across all 103+ DSA problems.
                    </p>
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <Link
                        to="/premium"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Unlock Unlimited AI Mentor — $12/mo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/premium"
                        className="text-xs text-slate-400 hover:text-slate-200 underline font-mono"
                      >
                        View all tiers & features
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* BOTTOM: PINNED FIXED INPUT BAR (BIGGER & FULLY READABLE) */}
          <div className="p-4 bg-[#0d131f] border-t border-slate-800 flex-shrink-0">
            {promptCount >= 1 ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#05080f] border border-purple-900/40 p-3 rounded-xl">
                <div className="flex items-center gap-2.5 px-1 text-slate-300 text-xs">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>1/1 Free prompt used. Upgrade to <strong className="text-purple-300 font-semibold">CodeForge Plus</strong> for unlimited AI chats.</span>
                </div>
                <Link
                  to="/premium"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-950/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Upgrade to Plus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiPrompt();
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder={`Ask a question about ${problem.title} or your code (1 free query)...`}
                  disabled={aiLoading}
                  className="flex-1 bg-[#05080f] border border-slate-800 focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />

                <button
                  type="submit"
                  disabled={aiLoading || !aiInput.trim()}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition-all shadow-md shadow-purple-950/40 cursor-pointer flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Ask AI</span>
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: STANDARD SCROLLABLE DOCUMENT TABS */
        /* ========================================================================= */
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* 1. DESCRIPTION TAB */}
          {activeTab === "description" && (
            <div className="space-y-6 max-w-3xl">
              {/* Title & Metadata */}
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {problem.title}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyBadge(problem.difficulty)}`}>
                    {problem.difficulty || "Medium"}
                  </span>
                  {problem.tags && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Tag className="w-3 h-3" />
                      {problem.tags}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono pt-1">
                  <span>Judge0 Sandbox CE</span>
                  <span>•</span>
                  <span>Automated Test Grading</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/30 p-4 rounded-xl border border-slate-800/60">
                {problem.description}
              </div>

              {/* Examples */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Example Test Cases
                </h2>

                <div className="space-y-4">
                  {problem.visibleTestCases?.map((testCase, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0e1626] border border-slate-800/90 rounded-xl p-4 relative group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-300">
                          Example {idx + 1}
                        </span>
                        <button
                          onClick={() => copyToClipboard(`Input: ${testCase.input}\nOutput: ${testCase.output}`, idx)}
                          className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 transition-colors"
                          title="Copy Example"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="text-[11px]">Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex items-start gap-2 bg-[#080d14] p-2.5 rounded-lg border border-slate-800/50">
                          <span className="text-cyan-400 select-none font-semibold">Input:</span>
                          <span className="text-slate-200">{testCase.input}</span>
                        </div>
                        <div className="flex items-start gap-2 bg-[#080d14] p-2.5 rounded-lg border border-slate-800/50">
                          <span className="text-emerald-400 select-none font-semibold">Output:</span>
                          <span className="text-slate-200">{testCase.output}</span>
                        </div>
                        {testCase.explanation && (
                          <div className="text-slate-400 text-[11px] font-sans pt-1">
                            <strong className="text-slate-300">Explanation:</strong> {testCase.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Constraints & Edge Conditions
                </h2>
                <ul className="list-disc ml-5 text-xs text-slate-400 space-y-1.5 font-mono">
                  <li>Strict time limit: 2.0s per test suite in Judge0 CE sandbox.</li>
                  <li>Memory footprint limit: 128,000 KB memory cap.</li>
                  <li>Handle standard boundary inputs (empty arrays, negative integers, overflow constraints).</li>
                </ul>
              </div>
            </div>
          )}

          {/* 2. EDITORIAL TAB */}
          {activeTab === "editorial" && (
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Algorithm Editorial & Walkthrough
              </h1>
              <div className="bg-[#0e1626] border border-slate-800/90 rounded-xl p-5 text-xs text-slate-300 leading-relaxed space-y-4">
                <p>
                  This problem challenges you to design an optimal algorithmic approach.
                  Consider the standard two-pointer, hash table lookup, or dynamic programming techniques depending on the problem classification.
                </p>
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-lg text-cyan-300">
                  💡 <strong>Approach Insight:</strong> Avoid naive O(N^2) brute force loops. Pre-processing inputs using an indexed map reduces search queries from O(N) down to O(1) amortized time complexity.
                </div>
                <p className="text-slate-400">
                  Official detailed multi-language breakdowns and visual walkthrough diagrams will unlock once you complete at least one verified submission.
                </p>
              </div>
            </div>
          )}

          {/* 3. SOLUTIONS TAB */}
          {activeTab === "solutions" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  Verified Reference Solutions
                </h1>
                <span className="text-xs text-slate-500 font-mono">
                  {problem.referenceSolution?.length || 0} implementations
                </span>
              </div>

              {problem.referenceSolution?.length > 0 ? (
                <div className="space-y-5">
                  {problem.referenceSolution.map((solution, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-800 rounded-xl overflow-hidden bg-[#080d14]"
                    >
                      <div className="px-4 py-2.5 bg-[#0e1626] border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                          {solution.language}
                        </span>
                        <button
                          onClick={() => copyToClipboard(solution.completeCode, `sol-${idx}`)}
                          className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                        >
                          {copiedIndex === `sol-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copy Solution</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-xs text-slate-200 font-mono leading-5 custom-scrollbar">
                        <code>{solution.completeCode}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#0e1626] border border-slate-800 rounded-xl text-slate-400 text-xs">
                  No reference solution published yet for this challenge.
                </div>
              )}
            </div>
          )}

          {/* 4. SUBMISSIONS TAB */}
          {activeTab === "submissions" && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  Submission History
                </h1>
                <span className="text-xs text-slate-500 font-mono">
                  Total Runs: {submissionsList.length}
                </span>
              </div>

              {fetchingSubmissions ? (
                <div className="py-16 text-center text-slate-400">
                  <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-mono">Fetching your past submissions...</p>
                </div>
              ) : submissionsList.length === 0 ? (
                <div className="py-12 text-center bg-[#0e1626] border border-slate-800 rounded-xl p-8 space-y-2">
                  <p className="text-sm font-semibold text-slate-300">No submissions found</p>
                  <p className="text-xs text-slate-500">
                    Run your code against hidden test cases using the Submit button to record your first attempt.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissionsList.map((sub, idx) => {
                    const isAccepted = sub.status === "accepted";
                    return (
                      <div
                        key={sub._id || idx}
                        className="p-4 rounded-xl bg-[#0e1626] border border-slate-800 hover:border-slate-700 transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          {isAccepted ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accepted</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                              <XCircle className="w-3.5 h-3.5" />
                              <span className="capitalize">{sub.status || "Wrong Answer"}</span>
                            </div>
                          )}

                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] capitalize">
                            {sub.language}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                          <span>
                            Passed:{" "}
                            <strong className="text-slate-200">
                              {sub.testCasesPassed ?? 0}/{sub.testCasesTotal ?? 0}
                            </strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {sub.runtime ? `${sub.runtime}s` : "0s"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5 text-slate-500" />
                            {sub.memory ? `${sub.memory} KB` : "0 KB"}
                          </span>
                          <span>•</span>
                          <span className="text-slate-500">
                            {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemDescription;
