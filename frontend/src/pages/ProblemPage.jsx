import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import ProblemDescription from "../components/workspace/ProblemDescription";
import EditorHeader from "../components/workspace/EditorHeader";
import ConsoleDrawer from "../components/workspace/ConsoleDrawer";
import WorkspaceActions from "../components/workspace/WorkspaceActions";
import { useToast } from "../context/ToastContext";
import { FileText, Code2 } from "lucide-react";

const ProblemPage = () => {
  const { problemId } = useParams();
  const toast = useToast();
  const [mobilePanel, setMobilePanel] = useState("description"); // "description" | "editor"

  // PROBLEM DATA & LANGUAGE STATES
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // EXECUTION RESULTS & LOGS
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [fetchingSubmissions, setFetchingSubmissions] = useState(false);

  // NAVIGATION TABS
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeConsoleTab, setActiveConsoleTab] = useState("testcases");

  // TESTCASES & CUSTOM INPUT
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");

  // CONSOLE DRAWER SIZING & TOGGLE
  const [consoleHeight, setConsoleHeight] = useState(250);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const editorRef = useRef(null);

  // DRAFT STORAGE HELPER
  const getDraftKey = useCallback(
    (lang) => `codeforge_draft_${problemId}_${lang}`,
    [problemId]
  );

  // FETCH PROBLEM
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(data);

        // Load saved draft or default initialCode
        const savedDraft = localStorage.getItem(getDraftKey("javascript"));
        if (savedDraft) {
          setCode(savedDraft);
          setIsDraftSaved(true);
        } else {
          const jsCode = data.startCode?.find((item) => item.language === "javascript");
          setCode(jsCode?.initialCode || "");
          setIsDraftSaved(false);
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, [problemId, getDraftKey]);

  // FETCH SUBMISSIONS WHEN SUBMISSIONS TAB IS ACTIVE
  const fetchSubmissions = useCallback(async () => {
    try {
      setFetchingSubmissions(true);
      const { data } = await axiosClient.get(`/problem/sumittedProblem/${problemId}`);
      setSubmissionsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setFetchingSubmissions(false);
    }
  }, [problemId]);

  useEffect(() => {
    if (activeLeftTab === "submissions") {
      fetchSubmissions();
    }
  }, [activeLeftTab, fetchSubmissions]);

  // EDITOR MOUNT
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // CODE CHANGE WITH LOCAL DRAFT PERSISTENCE
  const handleCodeChange = (newCode) => {
    const val = newCode || "";
    setCode(val);
    localStorage.setItem(getDraftKey(selectedLanguage), val);
    setIsDraftSaved(true);
  };

  // LANGUAGE CHANGE WITH DRAFT RECALL
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);

    const savedDraft = localStorage.getItem(getDraftKey(language));
    if (savedDraft) {
      setCode(savedDraft);
      setIsDraftSaved(true);
    } else {
      const selectedCode = problem?.startCode?.find((item) => item.language === language);
      setCode(selectedCode?.initialCode || "");
      setIsDraftSaved(false);
    }
  };

  // RESET STARTER TEMPLATE
  const handleResetCode = () => {
    if (window.confirm("Reset code back to original starter template? Local changes will be cleared.")) {
      localStorage.removeItem(getDraftKey(selectedLanguage));
      const starter = problem?.startCode?.find((item) => item.language === selectedLanguage);
      setCode(starter?.initialCode || "");
      setIsDraftSaved(false);
    }
  };

  // MONACO LANGUAGE MAPPING
  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "c++":
        return "cpp";
      default:
        return "javascript";
    }
  };

  // RUN CODE (WITH CUSTOM INPUT SUPPORT)
  const handleRun = async () => {
    if (loading) return;
    setLoading(true);
    setRunResult(null);
    setIsConsoleOpen(true);
    setActiveConsoleTab("output");

    try {
      const payload = {
        code,
        language: selectedLanguage,
      };

      if (useCustomInput && customInput.trim() !== "") {
        payload.customInput = customInput;
      }

      const response = await axiosClient.post(`/submission/run/${problemId}`, payload);
      setRunResult(response.data);

      if (response.data?.error) {
        toast.error(response.data.error, "Runner Alert");
      } else if (Array.isArray(response.data)) {
        const hasErr = response.data.some((r) => r.status && r.status.id > 3);
        if (hasErr) {
          toast.warning("Code executed with errors or non-zero exit status.", "Execution Warning");
        } else {
          toast.success("Code executed successfully on test cases!", "Execution Finished");
        }
      }
    } catch (error) {
      console.error("Error running code:", error);
      const errMsg = error.response?.data?.message || error.response?.data || "Execution error in Sandbox";
      setRunResult({
        success: false,
        error: errMsg,
      });
      toast.error(errMsg, "Sandbox Error");
    } finally {
      setLoading(false);
    }
  };

  // SUBMIT CODE (WITH GRADING & DIFF DETAILS)
  const handleSubmitCode = async () => {
    if (loading) return;
    setLoading(true);
    setSubmitResult(null);
    setIsConsoleOpen(true);
    setActiveConsoleTab("submission");

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage,
      });

      setSubmitResult(response.data);
      if (response.data?.accepted) {
        toast.success(`Solution Accepted! Passed ${response.data.passedTestcases}/${response.data.testCasesTotal} testcases in ${response.data.runtime}s.`, "Accepted 🎉");
      } else if (response.data?.errorMessage && response.data.errorMessage.includes("Sandbox Runner Alert")) {
        toast.warning(response.data.errorMessage, "Sandbox Alert");
      } else {
        toast.error(`Passed ${response.data?.passedTestcases || 0}/${response.data?.testCasesTotal || 0} test cases. Check console for details.`, "Wrong Answer / Error");
      }
      // Refresh submissions list if user visits history tab
      fetchSubmissions();
    } catch (error) {
      console.error("Error submitting code:", error);
      const errMsg = error.response?.data?.message || error.response?.data || "Submission failed";
      setSubmitResult({
        accepted: false,
        errorMessage: errMsg,
      });
      toast.error(errMsg, "Submission Failed");
    } finally {
      setLoading(false);
    }
  };

  // KEYBOARD SHORTCUTS (Ctrl+Enter to run, Ctrl+Shift+Enter to submit)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmitCode();
        } else {
          handleRun();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, selectedLanguage, useCustomInput, customInput, loading]);

  // RESIZE CONSOLE
  const handleMouseMove = (e) => {
    const newHeight = window.innerHeight - e.clientY - 56; // 56px action bar
    if (newHeight >= 120 && newHeight <= 550) {
      setConsoleHeight(newHeight);
    }
  };

  const stopResize = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
  };

  const startResize = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  // LOADING SKELETON
  if (!problem) {
    return (
      <div className="h-[calc(100vh-64px)] bg-[#0b0f17] text-white flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading sandbox environment...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#0b0f17] text-white flex flex-col overflow-hidden">
      {/* MOBILE WORKSPACE VIEW TOGGLE (Visible only on mobile / tablet screens) */}
      <div className="md:hidden flex items-center bg-[#090e17] border-b border-slate-800/80 px-3 py-2 gap-2 flex-shrink-0">
        <button
          onClick={() => setMobilePanel("description")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            mobilePanel === "description"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-transparent"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Problem & AI</span>
        </button>

        <button
          onClick={() => setMobilePanel("editor")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            mobilePanel === "editor"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-transparent"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code Editor & Run</span>
        </button>
      </div>

      {/* MAIN SPLIT VIEW */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        {/* LEFT PANEL: PROBLEM STATEMENT & SUBMISSIONS (45% on desktop, 100% on mobile) */}
        <div className={`w-full md:w-[45%] h-full flex flex-col min-h-0 ${
          mobilePanel === "description" ? "flex" : "hidden md:flex"
        }`}>
          <ProblemDescription
            problem={problem}
            activeTab={activeLeftTab}
            setActiveTab={setActiveLeftTab}
            submissionsList={submissionsList}
            fetchingSubmissions={fetchingSubmissions}
            userCode={code}
            selectedLanguage={selectedLanguage}
          />
        </div>

        {/* RIGHT PANEL: CODE EDITOR & CONSOLE DRAWER (55% on desktop, 100% on mobile) */}
        <div className={`w-full md:w-[55%] h-full flex flex-col min-h-0 bg-[#0b0f17] ${
          mobilePanel === "editor" ? "flex" : "hidden md:flex"
        }`}>
          {/* EDITOR HEADER */}
          <EditorHeader
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            onResetCode={handleResetCode}
            isDraftSaved={isDraftSaved}
            isExecuting={loading}
          />

          {/* MONACO CODE EDITOR */}
          <div className="flex-1 min-h-0 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                lineNumbers: "on",
                folding: true,
                glyphMargin: false,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: "all",
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: "line",
                cursorBlinking: "smooth",
                smoothScrolling: true,
                mouseWheelZoom: true,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* RESIZABLE CONSOLE DRAWER */}
          {isConsoleOpen && (
            <ConsoleDrawer
              consoleHeight={consoleHeight}
              startResize={startResize}
              problem={problem}
              selectedCaseIdx={selectedCaseIdx}
              setSelectedCaseIdx={setSelectedCaseIdx}
              useCustomInput={useCustomInput}
              setUseCustomInput={setUseCustomInput}
              customInput={customInput}
              setCustomInput={setCustomInput}
              runResult={runResult}
              submitResult={submitResult}
              activeConsoleTab={activeConsoleTab}
              setActiveConsoleTab={setActiveConsoleTab}
              loading={loading}
            />
          )}

          {/* WORKSPACE ACTIONS BAR */}
          <WorkspaceActions
            onRun={handleRun}
            onSubmit={handleSubmitCode}
            loading={loading}
            toggleConsole={() => setIsConsoleOpen((prev) => !prev)}
            isConsoleOpen={isConsoleOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
