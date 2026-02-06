import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, Clock, Database, Code2, ArrowLeft, ChevronRight } from "lucide-react";
import { saveSubmission } from "../../services/user/judgeService";
import { useEffect, useRef } from "react";

const frame = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

const SubmissionReport = ({ result, problemData, sourceCode, user, onBackToEditor }) => {
  const savedRef = useRef(false); // tránh gọi API nhiều lần

  useEffect(() => {
    if (!result?.success) return;
    if (savedRef.current) return;

    const payload = {
      userId: user.userId,
      problemId: problemData._id,
      languageId: 63,
      sourceCode,
      status: "Accepted",
      results: result.testcases,
    };

    saveSubmission(payload)
      .then(() => frame())
      .catch(console.error);

    savedRef.current = true;
  }, [result, problemData, sourceCode, user]);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12 font-sans mt-[60px]">
      <div className="max-w-7xl mx-auto">

        {/* Thanh điều hướng nhanh */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToEditor}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </button>
        </div>

        {/* Thẻ tóm tắt kết quả (Summary Card) */}
        <div className={`relative overflow-hidden rounded-[2rem] p-8 mb-8 border-none shadow-2xl text-white ${result.success ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-rose-500 to-orange-600"
          }`}>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-emerald-100 text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-80">Kết quả nộp bài</p>
              <h1 className="text-4xl font-black mb-2 tracking-tight">
                {result.success ? "ACCEPTED" : "WRONG ANSWER"}
              </h1>
              <p className="text-white/80 font-medium flex items-center gap-2">
                <Code2 className="w-4 h-4" /> {problemData.title}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl min-w-[120px] text-center border border-white/10">
                <p className="text-[10px] font-bold text-white/60 uppercase mb-1">Tỉ lệ đạt</p>
                <p className="text-2xl font-black">{result.testcases.filter(t => t.status.id === 3).length}/{result.testcases.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl min-w-[120px] text-center border border-white/10">
                <p className="text-[10px] font-bold text-white/60 uppercase mb-1">Thời gian tối đa</p>
                <p className="text-2xl font-black">{Math.max(...result.testcases.map(t => t.time || 0))}s</p>
              </div>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Bảng chi tiết Testcases */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Báo cáo chi tiết từng bộ test</h2>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-black">STT</th>
                <th className="px-6 py-4 font-black">Trạng thái</th>
                <th className="px-6 py-4 font-black text-center"><Clock className="w-3.5 h-3.5 mx-auto" /></th>
                <th className="px-6 py-4 font-black text-center"><Database className="w-3.5 h-3.5 mx-auto" /></th>
                <th className="px-6 py-4 font-black text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {result.testcases.map((tc, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-400 font-bold">#{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tc.status.id === 3 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )}
                      <span className={`font-bold ${tc.status.id === 3 ? "text-emerald-600" : "text-rose-600"}`}>
                        {tc.status.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-slate-600">{tc.time || 0}s</td>
                  <td className="px-6 py-4 text-center font-mono text-slate-600">{tc.memory || 0} KB</td>
                  <td className="px-6 py-4 text-right">
                    {tc.status.id !== 3 && (
                      <button
                        onClick={() => {
                          if (tc.status.id === 4) {
                            window.alert(`Input\n ${problemData.testCases[idx].input.replace(/^\[|\]$/g, '')}\n\nExpected Output\n ${problemData.testCases[idx].expectedOutput}\n\nYour Output\n ${atob(tc.stdout || "")}`);
                          } else {
                            window.alert(`Error : ${tc.status.description}`);
                          }

                        }}
                        className="text-[11px] font-bold text-blue-600 hover:underline">
                        Xem Log
                      </button>
                    )}
                    {tc.status.id === 3 && <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section: Phân tích sâu (Nếu lỗi) */}
        {!result.success && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden">
              <h4 className="text-slate-900 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Lỗi thực thi cuối cùng
              </h4>

              <div className="relative group">
                <pre className="text-red-600 bg-red-50/50 p-4 rounded-2xl font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-red-100/50 max-h-60 overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {atob(result.testcases.find(t => t.status.id !== 3)?.stdout || "") || "Không có dữ liệu đầu ra lỗi."}
                </pre>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h4 className="text-slate-800 text-xs font-bold uppercase tracking-widest mb-4">Gợi ý khắc phục</h4>
              <ul className="space-y-3">
                {[
                  "Kiểm tra lại điều kiện biên.",
                  "Đảm bảo định dạng đầu ra khớp hoàn toàn với yêu cầu.",
                  "Tối ưu hóa vòng lặp nếu gặp lỗi Time Limit Exceeded."
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <span className="text-blue-500 font-bold">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionReport;
