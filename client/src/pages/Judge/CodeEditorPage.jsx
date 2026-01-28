import { useState } from "react"
import Editor from "@monaco-editor/react"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Code2, Play, Send } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { apiClient } from "../../utils/clientAxios"
import ProblemDescription from "./ProblemDescription"

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

const decodeBase64 = (str) => {
  try {
    return atob(str);
  } catch {
    return str;
  }
};

const problems = {
  "01": {
    id: "01",
    title: "Chào mừng đến với JavaScript",
    difficulty: "Dễ",
    description: "Hãy viết chương trình in ra dòng chữ 'Hello World' trên màn hình console.",
    input: ["Không có đầu vào"],
    example: "Output: Hello World",
    initialCode: "console.log(\"Hello World\");"
  },
  "02": {
    id: "02",
    title: "Cộng ba số",
    difficulty: "Dễ",
    description: "Viết hàm solve(a, b, c) để trả về tổng của 3 số nguyên.",
    input: ["3 số nguyên a b c"],
    example: "Input: 10 20 30\nOutput: 60",
    initialCode: "function solve(a, b, c) {\n    // Viết code tại đây\n    return a + b +c;\n}",
  },
  "03": {
    id: "03",
    title: "Chia hai số",
    difficulty: "Dễ",
    description: "Viết hàm solve(a, b) để trả về thương của a chia cho b.\n Nếu là số nguyên thì trả về số đó còn Nếu là số thập phân thì lấy 2 số sau dấu phẩy. Không hợp lệ in Not Valid",
    input: ["2 số nguyên a b"],
    example: "Input: 10 5\nOutput: 2",
    initialCode:
      `function solve(a, b) {
    // Viết code tại đây\n
    if (b === 0) return "Not Valid";
    const res = a / b;
    
    if (Number.isInteger(res)) {
        return res;
    }
    
    return res.toFixed(2);
}`
  },
  "04": {
    id: "04",
    title: "Đảo ngược từ trong câu",
    difficulty: "Dễ",
    description: "Viết hàm solve(str) để đảo ngược thứ tự các từ trong một câu. Lưu ý: Loại bỏ các khoảng trắng thừa ở đầu, cuối và giữa các từ.",
    input: ["Một chuỗi ký tự str"],
    example: "Input: 'Hello World' -> Output: 'World Hello'",
    initialCode:
      `function solve(str) {
    // Viết code tại đây
    // Gợi ý: dùng split(' '), filter, reverse và join(' ')
    return str.trim().split(/\\s+/).reverse().join(' ');
}`
  },
  "05": {
    id: "05",
    title: "Số lớn thứ hai trong mảng",
    difficulty: "Trung bình",
    description: `Viết hàm solve(arr) nhận vào một mảng các số nguyên. 
    Nhiệm vụ của bạn là tìm và trả về số lớn thứ hai trong mảng đó.
    
    Yêu cầu:
    - Nếu mảng có các số trùng nhau, chỉ tính là một giá trị.
    - Nếu không tìm thấy số lớn thứ hai (mảng có ít hơn 2 giá trị khác nhau), trả về chuỗi "Not Found".`,

    input: ["Một mảng số nguyên arr (ví dụ: [10, 5, 10, 8])"],
    example: "Input: [10, 5, 10, 8] -> Output: 8",

    initialCode: `/**
 * @param {number[]} arr
 * @return {number|string}
 */
function solve(arr) {
    // 1. Loại bỏ các số trùng nhau bằng Set
    const uniqueNums = [...new Set(arr)];
    
    // 2. Kiểm tra nếu có ít hơn 2 số khác nhau
    if (uniqueNums.length < 2) {
        return "Not Found";
    }
    
    // 3. Sắp xếp giảm dần và lấy phần tử thứ 2
    uniqueNums.sort((a, b) => b - a);
    return uniqueNums[1];
}`
  }
};

const problemData = problems["05"];

export default function CodeEditorPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState(problemData.initialCode || defaultCode.javascript)
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [status, setStatus] = useState("Chưa chạy")
  const [summary, setSummary] = useState({ passed: 0, total: 0 })
  const [testResults, setTestResults] = useState([])

  const handleSubmit = async () => {
    setSubmitting(true);
    const response = await apiClient.post("/judge/submissions/submit", {
      problemId: problemData.id,
      code,
      language_id: 63,
    });

    const testcases = response.testcases;

    const formattedResults = testcases.map((tc) => ({
      status_id: tc.status.id,
      status_description: tc.status.description,
      time: tc.time,
      memory: tc.memory,
      stdout: tc.stdout ? decodeBase64(tc.stdout) : null,
      stderr: tc.stderr ? decodeBase64(tc.stderr) : null,
      compile_output: tc.compile_output
        ? decodeBase64(tc.compile_output)
        : null,
    }));

    const passed = formattedResults.filter(
      (r) => r.status_id === 3
    ).length;

    setStatus("Đã chấm");
    setSummary({
      passed,
      total: formattedResults.length,
    });
    setTestResults(formattedResults);
    setSubmitting(false);
  };

  const handleRunCode = async () => {
    setRunning(true);
    const response = await apiClient.post("/judge/submissions/run", {
      problemId: problemData.id,
      code: code,
      language_id: 63
    });
    setResult(response);

    setRunning(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col lg:grid lg:grid-cols-12 mt-[70px] mb-5">
      {/* LEFT - Problem */}
      <div className="w-full lg:col-span-4 bg-white overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200 max-h-[50vh] lg:max-h-none">
        <Card className="rounded-none border-none bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
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
            <ProblemDescription problem={problemData} />

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
            <div className="space-y-2 max-h-60 overflow-auto rounded-md border border-slate-200 p-2">
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
                <pre className="text-slate-400 italic text-xs">
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
  )
}
