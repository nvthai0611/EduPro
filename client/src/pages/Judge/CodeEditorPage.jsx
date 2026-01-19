import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Code2, Send } from "lucide-react"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate();
  const [code, setCode] = useState(defaultCode.javascript)

  /* 🧪 MOCK DATA – sau này nối Judge0 */
  const [status, setStatus] = useState("Chưa chạy")
  const [summary, setSummary] = useState({ passed: 0, total: 0 })
  const [testResults, setTestResults] = useState([])

  useEffect(() => {
    document.documentElement.classList.remove("dark")
  }, [])

  const handleSubmit = () => {
    console.log(code);

    // mock kết quả
    setStatus("Đã chấm")
    setSummary({ passed: 2, total: 3 })
    setTestResults([
      { status_id: 3, time: "0.01", memory: "1024" },
      { status_id: 3, time: "0.02", memory: "1100" },
      {
        status_id: 4,
        time: "0.01",
        memory: "900",
        stdout: "Sai output",
      },
    ])
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col lg:grid lg:grid-cols-12 mt-[70px] mb-5">
      {/* LEFT - Problem */}
      <div className="w-full lg:col-span-4 bg-white overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200 max-h-[50vh] lg:max-h-none">
        <Card className="rounded-none border-none bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Two Sum</CardTitle>
              <div>
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </Button>
              </div>
            </div>

          </CardHeader>

          <CardContent className="space-y-6 text-sm leading-relaxed">
            {/* Problem */}
            <div className="space-y-4">
              <p>
                Given an array of integers <b>nums</b> and an integer{" "}
                <b>target</b>, return indices of the two numbers such that they
                add up to target.
              </p>

              <div>
                <b>Example:</b>
                <pre className="bg-slate-100 p-2 rounded mt-2 text-xs">
                  nums = [2,7,11,15]
                  target = 9

                  Output: [0,1]
                </pre>
              </div>

              <div>
                <b>Constraints:</b>
                <ul className="list-disc ml-5">
                  <li>2 ≤ nums.length ≤ 10⁴</li>
                  <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                </ul>
              </div>
            </div>

            {/* RESULTS AREA */}
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-semibold text-base">Kết quả chạy</h3>

              <div>
                Trạng thái hiện tại:{" "}
                <Badge variant="outline">{status}</Badge>
              </div>

              {summary.total > 0 && (
                <div className="p-3 rounded border bg-slate-50">
                  <p className="font-medium">
                    {summary.passed === summary.total ? (
                      <span className="text-green-600">✅ Thành công!</span>
                    ) : (
                      <span className="text-red-600">❌ Thất bại.</span>
                    )}{" "}
                    Đạt {summary.passed}/{summary.total} test cases.
                  </p>
                </div>
              )}

              {testResults.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border text-xs">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="border px-2 py-1">Testcase</th>
                        <th className="border px-2 py-1">Trạng thái</th>
                        <th className="border px-2 py-1">Time (s)</th>
                        <th className="border px-2 py-1">Memory (KB)</th>
                        <th className="border px-2 py-1">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults.map((r, i) => (
                        <tr key={i} className="text-center">
                          <td className="border px-2 py-1">{i + 1}</td>
                          <td className="border px-2 py-1">
                            {r.status_id === 3 ? (
                              <span className="text-green-600">Passed</span>
                            ) : (
                              <span className="text-red-600">Failed</span>
                            )}
                          </td>
                          <td className="border px-2 py-1">
                            {r.time || "N/A"}
                          </td>
                          <td className="border px-2 py-1">
                            {r.memory || "N/A"}
                          </td>
                          <td className="border px-2 py-1 text-left">
                            {r.stdout ||
                              r.stderr ||
                              r.compile_output ||
                              "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col lg:col-span-8 min-h-[50vh] lg:min-h-screen">
        {/* TOP BAR */}
        <div className="flex flex-wrap gap-2 items-center justify-between px-4 py-2 border-b border-slate-200 bg-white">

          {/* <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Language:</span>
            <Badge variant="outline">JavaScript</Badge>
          </div> */}

          <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-1.5 text-sm">
            <Code2 className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-slate-700">JavaScript</span>
          </div>

          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>

        {/* EDITOR */}
        <div className="flex-1 min-h-[400px]">
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
      </div>
    </div>
  )
}
