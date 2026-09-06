import React from "react";
import { 
  Terminal, 
  Play, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Plus, 
  SplitSquareVertical, 
  FileCode 
} from "lucide-react";

const ConsoleDrawer = ({
  consoleHeight,
  startResize,
  problem,
  selectedCaseIdx = 0,
  setSelectedCaseIdx,
  useCustomInput = false,
  setUseCustomInput,
  customInput = "",
  setCustomInput,
  runResult,
  submitResult,
  activeConsoleTab = "testcases",
  setActiveConsoleTab,
  loading = false,
}) => {
  return (
    <div
      style={{ height: `${consoleHeight}px` }}
      className="flex flex-col flex-shrink-0 bg-[#090d14] border-t border-slate-800/90 text-gray-200 select-text"
    >
      {/* DRAG HANDLE */}
      <div
        onMouseDown={startResize}
        className="h-2 w-full cursor-row-resize bg-slate-900 hover:bg-cyan-500/40 border-b border-slate-800 transition-colors flex items-center justify-center group"
        title="Drag to resize console drawer"
      >
        <div className="w-10 h-0.5 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
      </div>

      {/* CONSOLE NAVIGATION BAR */}
      <div className="h-10 border-b border-slate-800/80 flex items-center justify-between px-4 bg-[#0d131f]/70 flex-shrink-0">
        <div className="flex items-center gap-2 h-full">
          <button
            onClick={() => setActiveConsoleTab("testcases")}
            className={`flex items-center gap-1.5 px-3 h-full text-xs font-medium border-b-2 transition-colors ${
              activeConsoleTab === "testcases"
                ? "text-cyan-400 border-cyan-400 bg-cyan-500/5"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Testcase
          </button>

          <button
            onClick={() => setActiveConsoleTab("output")}
            className={`flex items-center gap-1.5 px-3 h-full text-xs font-medium border-b-2 transition-colors ${
              activeConsoleTab === "output"
                ? "text-cyan-400 border-cyan-400 bg-cyan-500/5"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            Run Result
            {runResult && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            )}
          </button>

          <button
            onClick={() => setActiveConsoleTab("submission")}
            className={`flex items-center gap-1.5 px-3 h-full text-xs font-medium border-b-2 transition-colors ${
              activeConsoleTab === "submission"
                ? "text-cyan-400 border-cyan-400 bg-cyan-500/5"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            Submission Result
            {submitResult && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  submitResult.accepted ? "bg-emerald-400" : "bg-rose-500"
                }`}
              />
            )}
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Evaluating in sandbox...</span>
          </div>
        )}
      </div>

      {/* CONSOLE DRAWER BODY */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {/* ========================================================= */}
        {/* TAB 1: TESTCASES */}
        {/* ========================================================= */}
        {activeConsoleTab === "testcases" && (
          <div className="space-y-4">
            {/* CASES SELECTOR BUTTONS */}
            <div className="flex items-center gap-2 flex-wrap">
              {problem.visibleTestCases?.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUseCustomInput(false);
                    setSelectedCaseIdx(idx);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    !useCustomInput && selectedCaseIdx === idx
                      ? "bg-slate-700 text-white border border-slate-600 shadow-sm"
                      : "bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  Case {idx + 1}
                </button>
              ))}

              {/* CUSTOM TESTCASE BUTTON */}
              <button
                onClick={() => setUseCustomInput(true)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  useCustomInput
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                    : "bg-slate-900/90 text-slate-400 hover:text-cyan-400 border border-slate-800"
                }`}
              >
                <Plus className="w-3 h-3" />
                Custom Testcase
              </button>
            </div>

            {/* TESTCASE CONTENT */}
            {useCustomInput ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">Standard Input (stdin):</span>
                  <span className="text-[11px] text-cyan-400/80">
                    Will be fed directly into your program via standard input
                  </span>
                </div>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom inputs here (e.g. 5 10)..."
                  rows={4}
                  className="w-full bg-[#05080f] border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 resize-none"
                />
              </div>
            ) : (
              problem.visibleTestCases &&
              problem.visibleTestCases[selectedCaseIdx] && (
                <div className="space-y-3 font-mono text-xs max-w-2xl">
                  <div>
                    <div className="text-[11px] text-slate-400 mb-1">Input:</div>
                    <div className="bg-[#05080f] border border-slate-800/80 p-2.5 rounded-lg text-slate-200">
                      {problem.visibleTestCases[selectedCaseIdx].input}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 mb-1">Expected Output:</div>
                    <div className="bg-[#05080f] border border-slate-800/80 p-2.5 rounded-lg text-emerald-400/90">
                      {problem.visibleTestCases[selectedCaseIdx].output}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: RUN RESULT */}
        {/* ========================================================= */}
        {activeConsoleTab === "output" && (
          <div className="space-y-3">
            {!runResult ? (
              <div className="py-8 text-center text-slate-500 text-xs font-mono">
                Click &quot;Run&quot; to execute your code in the sandbox against sample cases.
              </div>
            ) : Array.isArray(runResult) ? (
              <div className="space-y-3">
                {runResult.map((res, i) => {
                  const isPass = res.status?.id === 3;
                  return (
                    <div
                      key={i}
                      className="bg-[#05080f] border border-slate-800 rounded-xl p-3 space-y-2 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300">
                          Case {i + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                              isPass
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {res.status?.description || "Completed"}
                          </span>
                          {res.time && (
                            <span className="text-[11px] text-slate-400">
                              {res.time}s
                            </span>
                          )}
                        </div>
                      </div>

                      {res.stdout && (
                        <div>
                          <div className="text-[10px] text-slate-400">Your Output:</div>
                          <pre className="text-slate-200 bg-black/40 p-2 rounded border border-slate-800/60 overflow-x-auto">
                            {res.stdout}
                          </pre>
                        </div>
                      )}

                      {res.stderr && (
                        <div>
                          <div className="text-[10px] text-rose-400">Standard Error:</div>
                          <pre className="text-rose-300 bg-rose-950/20 p-2 rounded border border-rose-800/40 overflow-x-auto">
                            {res.stderr}
                          </pre>
                        </div>
                      )}

                      {res.compile_output && (
                        <div>
                          <div className="text-[10px] text-amber-400">Compiler Output:</div>
                          <pre className="text-amber-300 bg-amber-950/20 p-2 rounded border border-amber-800/40 overflow-x-auto">
                            {res.compile_output}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#05080f] border border-slate-800 rounded-xl p-4 text-xs font-mono">
                <pre className="whitespace-pre-wrap text-slate-300">
                  {runResult.error || runResult.output || JSON.stringify(runResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SUBMISSION RESULT & DIFF VIEWER */}
        {/* ========================================================= */}
        {activeConsoleTab === "submission" && (
          <div>
            {!submitResult ? (
              <div className="py-8 text-center text-slate-500 text-xs font-mono">
                Click &quot;Submit&quot; to test your solution across the entire hidden grading suite.
              </div>
            ) : submitResult.accepted ? (
              /* ACCEPTED CELEBRATION */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-400">Accepted</h3>
                      <p className="text-xs text-slate-300 font-mono">
                        All {submitResult.passedTestcases} / {submitResult.testCasesTotal} test cases passed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="bg-[#080d14] px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{submitResult.runtime || 0}s</span>
                    </div>
                    <div className="bg-[#080d14] px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{submitResult.memory || 0} KB</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* WRONG ANSWER / RUNTIME ERROR WITH DIFF VIEWER */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                      <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-rose-400">
                        {submitResult.errorMessage ? "Runtime / Compilation Error" : "Wrong Answer"}
                      </h3>
                      <p className="text-xs text-slate-300 font-mono">
                        Passed {submitResult.passedTestcases || 0} of {submitResult.testCasesTotal || 0} test cases
                      </p>
                    </div>
                  </div>

                  {submitResult.errorMessage && (
                    <span className="text-xs font-mono text-rose-400 bg-rose-950/30 px-2.5 py-1 rounded border border-rose-800/40">
                      Execution Halt
                    </span>
                  )}
                </div>

                {/* ERROR MESSAGE IF PRESENT */}
                {submitResult.errorMessage && (
                  <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-3">
                    <div className="text-[11px] text-rose-400 font-mono font-semibold mb-1">
                      Diagnostics:
                    </div>
                    <pre className="text-xs text-rose-300 font-mono whitespace-pre-wrap">
                      {submitResult.errorMessage}
                    </pre>
                  </div>
                )}

                {/* DIFF DETAILS VIEWER */}
                {submitResult.diffDetails && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <SplitSquareVertical className="w-4 h-4 text-cyan-400" />
                      <span>Failed Test Case Diff:</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                      {/* INPUT */}
                      <div className="bg-[#05080f] border border-slate-800 rounded-xl p-3 space-y-1">
                        <span className="text-[11px] text-cyan-400 font-semibold">Test Input:</span>
                        <pre className="text-slate-200 whitespace-pre-wrap">
                          {submitResult.diffDetails.input || "(Empty Input)"}
                        </pre>
                      </div>

                      {/* EXPECTED OUTPUT */}
                      <div className="bg-emerald-950/10 border border-emerald-800/30 rounded-xl p-3 space-y-1">
                        <span className="text-[11px] text-emerald-400 font-semibold">Expected Output:</span>
                        <pre className="text-emerald-300 whitespace-pre-wrap">
                          {submitResult.diffDetails.expected || "(None)"}
                        </pre>
                      </div>

                      {/* ACTUAL OUTPUT */}
                      <div className="bg-rose-950/10 border border-rose-800/30 rounded-xl p-3 space-y-1">
                        <span className="text-[11px] text-rose-400 font-semibold">Your Output:</span>
                        <pre className="text-rose-300 whitespace-pre-wrap">
                          {submitResult.diffDetails.actual || "(No output produced)"}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsoleDrawer;
