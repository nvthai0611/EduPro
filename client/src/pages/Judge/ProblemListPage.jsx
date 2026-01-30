import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Clock, Code2, Edit2, Eye, Plus, Trash2 } from "lucide-react"
import { AddProblemDialog } from "./AddProblemDialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllProblems } from "../../services/user/judgeService"
import { deleteProblem } from "../../services/admin/judgeService"

export default function ProblemListPage() {
  const navigate = useNavigate()
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const queryClient = useQueryClient()

  const {
    data: problems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["problems"],
    queryFn: getAllProblems,
    staleTime: 5 * 60 * 1000, // cache 5 phút
  })

  const deleteProblemMutation = useMutation({
    mutationFn: deleteProblem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] })
    },

    onError: (err) => {
      alert(err.response?.data?.message ?? "Xóa thất bại")
    },
  })


  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchDifficulty =
        difficultyFilter === "All" || p.difficulty === difficultyFilter

      return matchDifficulty
    })
  }, [problems, difficultyFilter])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Đang tải danh sách bài...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Không thể tải danh sách bài
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-white mt-[100px]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Thư viện bài toán</h1>
          </div>
          <p className="text-slate-500 font-medium">Tổng hợp các bài tập để luyện tập và nâng cao kỹ năng lập trình</p>
        </div>

        <AddProblemDialog trigger={
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 gap-2 px-6 py-6 rounded-xl transition-all hover:scale-105 active:scale-95">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Thêm bài toán mới</span>
          </Button>
        } />
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["All", "Easy", "Medium", "Hard"].map((level) => (
            <Badge
              key={level}
              variant="outline"
              onClick={() => setDifficultyFilter(level)}
              className={`cursor-pointer px-3 py-1 ${difficultyFilter === level
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-slate-100"
                }`}
            >
              {level}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats Overview (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: 'Tổng số bài', value: filteredProblems.length, icon: Code2, color: 'text-blue-600' },
          { label: 'Testcases', value: filteredProblems.reduce((acc, p) => acc + (p.testCases?.length || 0), 0), icon: Clock, color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Problems Table/List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-24">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code2 className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Chưa có bài tập nào</h3>
            <p className="text-slate-500 mb-6">Hãy bắt đầu xây dựng bộ đề đầu tiên của bạn.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin bài toán</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Độ khó</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Tài nguyên</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProblems.map((prob) => (
                  <tr key={prob._id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="block group-hover:translate-x-1 transition-transform">
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{prob.title}</h4>
                        <div
                          className="text-sm text-slate-500 mt-1 font-normal opacity-80 max-w-[400px] sm:max-w-[500px]"
                        >
                          <div
                            className="line-clamp-1 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: prob.description }}
                          />
                        </div>

                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${prob.difficulty === 'Easy' ? 'bg-green-50 border-green-500 text-green-700' :
                        prob.difficulty === 'Medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                          'bg-red-50 border-red-500 text-red-700'
                        }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {prob.testCases?.length || 0} Testcases
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono italic">
                          {prob.timeLimit}s / {prob.memoryLimit}KB
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 cursor-pointer text-slate-400 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg"
                          onClick={() => navigate(`/problems/${prob.slug}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <AddProblemDialog
                          initialData={prob}
                          trigger={
                            <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer text-slate-400 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 cursor-pointer text-slate-400 hover:text-rose-600 hover:bg-rose-100/50 rounded-lg"
                          onClick={(e) => {
                            e.preventDefault()
                            if (window.confirm("Bạn có chắc muốn xóa bài này?")) {
                              deleteProblemMutation.mutate(prob._id)
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
