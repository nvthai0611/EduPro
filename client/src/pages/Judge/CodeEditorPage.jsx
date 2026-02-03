import { useState } from "react"
import Editor from "@monaco-editor/react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, Play, Send } from "lucide-react"
import { useParams } from "react-router-dom"
import { encryptData } from "../../utils/clientAxios"
import ProblemDescription from "./ProblemDescription"
import { useQuery } from "@tanstack/react-query"
import { getProblemBySlug, runCode, sendSubmission } from "../../services/user/judgeService"
import SubmissionReport from "./SubmissionReport"

const defaultCode = {
  javascript: `console.log("Hello World");`,
}

const handleEditorWillMount = (monaco) => {
  monaco.editor.defineTheme("hackerrank-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6b7280" },
      { token: "keyword", foreground: "2563eb" },
      { token: "string", foreground: "15803d" },
      { token: "number", foreground: "b45309" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#0f172a",
      "editor.selectionBackground": "#e5e7eb",
      "editor.lineHighlightBackground": "#f8fafc",
      "editorCursor.foreground": "#2563eb",
      "editorLineNumber.foreground": "#9ca3af",
      "editorLineNumber.activeForeground": "#111827",
    },
  })
}

export default function CodeEditorPage() {
  const [code, setCode] = useState(defaultCode.javascript)
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState('editor');

  const [testResults, setTestResults] = useState([])

  const { slug } = useParams();

  const {
    data: problemData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["problem", slug],
    queryFn: () => getProblemBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // cache 5 phút
  })

  // Đang loading → show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải bài toán...
      </div>
    );
  }

  // Lỗi hoặc không tìm thấy bài
  if (isError || !problemData) {
    window.location.href = "/problems";
    return null;
  }

  const handleSubmit = async () => {
    setSubmitting(true);

    const finalData = {
      problemId: problemData.id,
      code,
      language_id: 63,
      cpu_time_limit: problemData.timeLimit,
      memory_limit: problemData.memoryLimit,
      testCases: problemData.testCases
    }

    const response = await sendSubmission(encryptData(finalData));

    setTestResults(response);
    setSubmitting(false);
    setView('report');
  };

  const handleRunCode = async () => {
    setRunning(true);
    const finalData = {
      problemId: problemData.id,
      code: code,
      language_id: 63,
      cpu_time_limit: problemData.timeLimit,
      memory_limit: problemData.memoryLimit,
    }

    const response = await runCode(finalData);

    setResult(response);

    setRunning(false);
  };

  return (
    <>
      {problemData && (
        <>
          {view === 'editor' ? (
            <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col lg:grid lg:grid-cols-12 mt-[70px] mb-5">
              {/* LEFT - Problem */}
              <div className="w-full lg:col-span-4 bg-white overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200 max-h-[50vh] lg:max-h-none">
                <Card className="rounded-none border-none bg-white">
                  <CardContent className="p-0 space-y-6 text-sm leading-relaxed">
                    {/* Problem */}
                    <ProblemDescription problem={problemData} />

                  </CardContent>
                </Card>
              </div>

              {/* RIGHT */}
              <div className="w-full flex flex-col lg:col-span-8 min-h-[50vh] bg-white lg:min-h-screen">
                {/* TOP BAR */}
                <div className="flex flex-wrap gap-2 items-center justify-between px-4 py-2 border-b border-slate-200 bg-white">

                  <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-1.5 text-sm">
                    <Code2 className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-slate-700">JavaScript</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleRunCode}
                      disabled={running}
                      className={`${running ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'} text-white px-6 py-2 rounded-xl font-bold text-sm`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {running ? "Đang chạy..." : "Chạy thử"}
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className={`${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-2 rounded-xl font-bold text-sm`}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {submitting ? "Running..." : "Submit"}
                    </Button>

                  </div>
                </div>

                {/* EDITOR */}
                <div className="flex-[3] min-h-[400px]">
                  <Editor
                    height="100%"
                    language="javascript"
                    value={code}
                    theme="hackerrank-light"
                    beforeMount={handleEditorWillMount}
                    onChange={(val) => setCode(val || "")}
                    options={{
                      fontSize: 14,
                      fontFamily: "JetBrains Mono, monospace",
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 12 },
                    }}
                  />
                </div>

                <div className="flex-[2] bg-white border-t border-slate-100 p-4 text-slate-700 font-mono text-sm relative max-h-[300px]">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-semibold text-slate-500">
                      ▶ Console Output
                    </h3>
                  </div>

                  {/* Content */}
                  {result ? (
                    <div className="space-y-2 max-h-60 overflow-auto p-2 rounded-md">
                      {result.stdout && (
                        <pre className="bg-white text-gray rounded-md p-2 whitespace-pre-wrap">
                          {result.stdout}
                        </pre>
                      )}

                      {result.stderr && (
                        <pre className="bg-red-50/60 text-red-600 rounded-md p-2 whitespace-pre-wrap">
                          {result.stderr}
                        </pre>
                      )}

                      {result.compile_output && (
                        <pre className="bg-amber-50/60 text-amber-700 rounded-md p-2 whitespace-pre-wrap">
                          {result.compile_output}
                        </pre>
                      )}

                      {result.message && (
                        <pre className="bg-white text-gray rounded-md p-2 whitespace-pre-wrap">
                          {result.message}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                      {running ? "Đang chạy chương trình..." : "Chưa có output"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <SubmissionReport
                result={testResults}
                problemData={problemData}
                onBackToEditor={() => setView('editor')}
              />
            </>
          )}
        </>
      )}
    </>
  )
}
