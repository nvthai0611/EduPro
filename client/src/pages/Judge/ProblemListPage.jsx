import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { AddProblemDialog } from "./AddProblemDialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllProblems } from "../../services/user/judgeService"
import { deleteProblem } from "../../services/admin/judgeService"

const difficultyColor = {
  Easy: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Hard: "bg-red-100 text-red-700 border-red-200",
}

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

  /* ---------------- LOADING / ERROR ---------------- */

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

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen px-4 py-6 mt-[100px]">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
          <div className="relative mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
              Problems
            </h1>

            <AddProblemDialog />
          </div>
        </div>

        {/* FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-12 px-4 text-xs font-semibold text-slate-500">
          <div className="col-span-6">Tên bài</div>
          <div className="col-span-2">Độ khó</div>
          <div className="col-span-2">Test cases</div>
        </div>

        {/* LIST */}
        <div className="space-y-2">
          {filteredProblems.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              Không có bài phù hợp với bộ lọc
            </div>
          )}

          {filteredProblems.map((p, index) => (
            <Card key={p._id} className="hover:shadow-sm hover:border-blue-300 transition">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">

                  <div className="md:col-span-6 cursor-pointer" onClick={() => navigate(`/problems/${p.slug}`)}>
                    <div className="font-medium">
                      {index + 1}. {p.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 md:hidden">
                      {p.testCases?.length ?? 0} test cases
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Badge
                      variant="outline"
                      className={difficultyColor[p.difficulty] ?? ""}
                    >
                      {p.difficulty}
                    </Badge>
                  </div>

                  <div className="md:col-span-2 hidden md:block text-sm text-slate-600">
                    {p.testCases?.length ?? 0} tests
                  </div>

                  <div className="md:col-span-2 hidden md:flex items-center gap-2 justify-end">
                    {/* Update */}
                    <AddProblemDialog
                      initialData={p}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.preventDefault()
                        if (window.confirm("Bạn có chắc muốn xóa bài này?")) {
                          deleteProblemMutation.mutate(p._id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>


                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
