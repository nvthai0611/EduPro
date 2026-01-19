import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const problems = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tests: 3,
    solved: false,
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    tests: 5,
    solved: true,
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tests: 10,
    solved: false,
  },
]

const difficultyColor = {
  Easy: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Hard: "bg-red-100 text-red-700 border-red-200",
}

export default function ProblemListPage() {
  const navigate = useNavigate();
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredProblems = problems.filter((p) => {
    const matchDifficulty =
      difficultyFilter === "All" || p.difficulty === difficultyFilter

    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Solved" && p.solved) ||
      (statusFilter === "Unsolved" && !p.solved)

    return matchDifficulty && matchStatus
  })

  return (
    <div className="min-h-screen px-4 py-6 mt-[100px]">
      <div className="mx-auto max-w-6xl space-y-6">

        <div className="relative text-center">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2
               inline-grid grid-flow-col auto-cols-max items-center gap-2
               text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>

          {/* Title */}
          <h1 className="text-3xl font-bold">
            Danh sách bài
          </h1>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Difficulty filter */}
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

          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            {["All", "Solved", "Unsolved"].map((status) => (
              <Badge
                key={status}
                variant="outline"
                onClick={() => setStatusFilter(status)}
                className={`cursor-pointer px-3 py-1 ${statusFilter === status
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "hover:bg-slate-100"
                  }`}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>

        {/* Header (ẩn trên mobile) */}
        <div className="hidden md:grid grid-cols-12 px-4 text-xs font-semibold text-slate-500">
          <div className="col-span-6">Tên bài</div>
          <div className="col-span-2">Độ khó</div>
          <div className="col-span-2">Test cases</div>
          <div className="col-span-2 text-right">Trạng thái</div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filteredProblems.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              Không có bài phù hợp với bộ lọc
            </div>
          )}

          {filteredProblems.map((p, index) => (
            <Link key={p.id} to={`/problems/${p.id}`} className="block">
              <Card className="hover:shadow-sm hover:border-blue-300 transition">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">

                    {/* Title */}
                    <div className="md:col-span-6">
                      <div className="font-medium">
                        {index + 1}. {p.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 md:hidden">
                        {p.tests} test cases
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="md:col-span-2">
                      <Badge
                        variant="outline"
                        className={difficultyColor[p.difficulty]}
                      >
                        {p.difficulty}
                      </Badge>
                    </div>

                    {/* Tests */}
                    <div className="md:col-span-2 text-sm text-slate-600 hidden md:block">
                      {p.tests} tests
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2 text-right">
                      {p.solved ? (
                        <span className="text-emerald-600 font-medium">
                          Solved
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Unsolved
                        </span>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}