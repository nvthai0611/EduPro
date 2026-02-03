import { ChevronLeft, Info, Code2, ScrollText } from "lucide-react";

const ProblemDescription = ({ problem }) => {

  const { title, difficulty, description, inputFormat, outputFormat, constraints, testCases } = problem;

  const sampleTestCases = testCases?.filter((tc) => tc.isSample === true) || [];

  return (
    <aside className="w-full h-full bg-white overflow-y-auto flex flex-col [scrollbar-width:thin]">
      {/* Header Duyệt bài */}
      <div className="flex flex-wrap gap-2 items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-all group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Danh sách bài tập
        </button>
      </div>

      <div className="p-8 h-screen overflow-y-auto scrollbar-hide">
        {/* Tiêu đề & Độ khó */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${difficulty === 'Easy' ? 'bg-green-50 border-green-500 text-green-700' :
              difficulty === 'Medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                'bg-red-50 border-red-500 text-red-700'
              }`}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Nội dung mô tả */}
        <div className="prose prose-slate max-w-none">
          <div className="text-gray-700 leading-relaxed mb-8">
            <div dangerouslySetInnerHTML={{ __html: description }} className="ql-editor !p-0" />
          </div>

          {/* Ràng buộc (Constraints) */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3 text-gray-900">
              <Info className="w-4 h-4 text-blue-500" />
              <h4 className="m-0 text-sm font-bold uppercase tracking-wide">Ràng buộc</h4>
            </div>
            <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
              <code className="text-sm text-gray-600 font-mono whitespace-pre-wrap">{constraints}</code>
            </div>
          </section>

          {/* Định dạng Input/Output */}
          <div className="flex gap-8 flex-col">
            <section>
              <div className="flex items-center gap-2 mb-3 text-gray-900">
                <ScrollText className="w-4 h-4 text-emerald-500" />
                <h4 className="m-0 text-sm font-bold uppercase tracking-wide">Đầu vào</h4>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600 font-mono italic">
                {inputFormat}
              </div>
            </section>
            <section>
              <div className="flex items-center gap-2 mb-3 text-gray-900">
                <Code2 className="w-4 h-4 text-purple-500" />
                <h4 className="m-0 text-sm font-bold uppercase tracking-wide">Đầu ra</h4>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600 font-mono italic">
                {outputFormat}
              </div>
            </section>
          </div>

          {/* Sample Testcases */}
          {sampleTestCases.length > 0 && (
            <section className="mt-10">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Ví dụ mẫu</h4>
              {sampleTestCases.map((tc, index) => (
                <div key={index} className="mb-6 overflow-hidden border border-gray-200 rounded-xl">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Ví dụ {index + 1}</span>
                  </div>
                  <div>
                    <div className="p-4 pb-0 border-r border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Input</p>
                      <pre className="font-mono text-sm text-gray-800 p-2 rounded leading-snug
               whitespace-pre-wrap break-words">
                        {tc.input.slice(1, -1) ? tc.input.slice(1, -1) : "No Input"}
                      </pre>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Output</p>
                      <pre className="font-mono text-sm text-blue-700 p-2 rounded leading-snug
               whitespace-pre-wrap break-words">
                        {tc.expectedOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ProblemDescription;
