const ProblemDescription = ({ problem }) => {
  const { title, id, difficulty, description, input, example } = problem;

  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-200 overflow-y-auto flex flex-col shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
            Bài số {id}
          </span>
          <span className="text-gray-400">•</span>
          <span className={`text-xs font-medium ${difficulty === 'Dễ' ? 'text-emerald-500' : 'text-orange-500'}`}>
            {difficulty}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        
        <div className="prose prose-slate prose-sm text-gray-600 leading-relaxed">
          <div className="mb-4">{description}</div>
          
          <h4 className="text-gray-800 font-semibold mt-4">Đầu vào:</h4>
          <ul className="list-disc ml-4 space-y-1">
            {input.map((item, index) => (
              <li key={index}><code className="text-pink-500">{item}</code></li>
            ))}
          </ul>

          <h4 className="text-gray-800 font-semibold mt-4">Ví dụ:</h4>
          <pre className="bg-gray-50 p-3 rounded-lg border border-gray-100 italic whitespace-pre-line">
            {example}
          </pre>
        </div>
      </div>
    </aside>
  );
};

export default ProblemDescription;
