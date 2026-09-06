import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  CheckCircle2, 
  Code2, 
  ArrowRight, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import axiosClient from "../utils/axiosClient";

const PAGE_SIZE = 15;

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  // SYNC WITH URL SEARCH PARAMS
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    const diffParam = searchParams.get("difficulty");
    
    setFilters((prev) => ({
      ...prev,
      tag: tagParam || "all",
      difficulty: diffParam || "all",
    }));
    setCurrentPage(1);
  }, [searchParams]);

  // FETCH ALL PROBLEMS & USER SOLVED
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  // FILTER LOGIC
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
      const difficultyMatch =
        filters.difficulty === "all" || problem.difficulty?.toLowerCase() === filters.difficulty.toLowerCase();
      
      const pTag = (problem.tags || "").toLowerCase();
      const fTag = filters.tag.toLowerCase();
      const tagMatch =
        fTag === "all" ||
        pTag === fTag ||
        (fTag === "array" && (pTag === "array" || pTag === "two-pointer")) ||
        (fTag === "graph" && (pTag === "graph" || pTag === "trees" || pTag === "tree")) ||
        (fTag === "dp" && (pTag === "dp" || pTag === "dynamic programming")) ||
        (fTag === "concurrency" && pTag === "concurrency");

      const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
      const statusMatch =
        filters.status === "all" || (filters.status === "solved" && isSolved);

      return matchesSearch && difficultyMatch && tagMatch && statusMatch;
    });
  }, [problems, searchQuery, filters, solvedProblems]);

  // PAGINATION COMPUTATION
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / PAGE_SIZE));
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProblems.slice(start, start + PAGE_SIZE);
  }, [filteredProblems, currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);

    // Sync back to URL
    const newParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({ difficulty: "all", tag: "all", status: "all" });
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = filters.difficulty !== "all" || filters.tag !== "all" || filters.status !== "all" || searchQuery !== "";

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white selection:bg-cyan-500/30 selection:text-cyan-200 relative pb-20">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid mask-radial-faded pointer-events-none opacity-30" />

      <div className="relative max-w-6xl mx-auto px-6 pt-8 z-10">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-300 text-xs font-medium mb-3">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>Production Practice Arena</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Explore Algorithmic Challenges
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Select an algorithm challenge, compile your code against Judge0 CE, and benchmark performance.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-md font-mono">
            <span>Total: <strong className="text-white">{problems.length}</strong></span>
            <span>•</span>
            <span>Filtered: <strong className="text-cyan-400">{filteredProblems.length}</strong></span>
            <span>•</span>
            <span>Solved: <strong className="text-emerald-400">{solvedProblems.length}</strong></span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search challenges by title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#05080f] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Difficulty Tabs */}
            <div className="flex items-center bg-[#05080f] border border-slate-800 p-1 rounded-xl text-xs font-medium">
              {["all", "easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleFilterChange("difficulty", diff)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    filters.difficulty === diff
                      ? "bg-slate-700 text-white font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Category/Tags Dropdown */}
            <select
              value={filters.tag}
              onChange={(e) => handleFilterChange("tag", e.target.value)}
              className="bg-[#05080f] border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">All Topics (100+ Challenges)</option>
              <option value="array">Foundations (Array & Two Pointers)</option>
              <option value="graph">Intermediate (Trees & Graphs)</option>
              <option value="dp">Advanced (Dynamic Programming)</option>
              <option value="concurrency">System & Concurrency</option>
              <option value="linkedList">Linked List</option>
            </select>

            {/* Status Filter */}
            {user && (
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="bg-[#05080f] border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="solved">Solved Only</option>
              </select>
            )}

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                title="Clear active filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="py-24 text-center text-slate-400">
            <span className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-mono">Loading challenges from MongoDB Atlas...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 space-y-3">
            <Code2 className="w-10 h-10 mx-auto text-slate-600" />
            <h3 className="text-base font-semibold text-slate-300">No challenges matched your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords or switching back to &quot;All Topics&quot;.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedProblems.map((problem) => {
              const isSolved = solvedProblems.some((sp) => sp._id === problem._id);

              return (
                <div key={problem._id}>
                  <NavLink
                    to={`/problem/${problem._id}`}
                    className="group block p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all backdrop-blur-sm shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      
                      {/* Left: Problem Title and Tags */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 transition-colors ${
                          isSolved
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-[#05080f] border-slate-800 text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-500/40"
                        }`}>
                          {isSolved ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Code2 className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {problem.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 font-mono">
                            <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold uppercase ${getDifficultyStyle(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#05080f] text-slate-400 border border-slate-800 capitalize">
                              {problem.tags}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action: Solve Button */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors flex-shrink-0">
                        <span className="hidden sm:inline font-mono">Open IDE</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </NavLink>
                </div>
              );
            })}

            {/* PAGINATION BAR */}
            {totalPages > 1 && (
              <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 mt-6 text-xs text-slate-400 font-mono">
                <div>
                  Showing <strong className="text-white">{(currentPage - 1) * PAGE_SIZE + 1}</strong> to{" "}
                  <strong className="text-white">
                    {Math.min(currentPage * PAGE_SIZE, filteredProblems.length)}
                  </strong>{" "}
                  of <strong className="text-cyan-400">{filteredProblems.length}</strong> challenges
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                      let pageNum = idx + 1;
                      if (totalPages > 5 && currentPage > 3) {
                        pageNum = Math.min(totalPages - 4 + idx, currentPage - 2 + idx);
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                              : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
