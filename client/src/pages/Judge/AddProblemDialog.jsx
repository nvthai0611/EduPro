import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import ReactQuill from "react-quill"
import { createProblem, updateProblem } from "../../services/admin/judgeService"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
}

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "link",
]

const emptyForm = {
  title: "",
  description: "",
  difficulty: "Easy",

  constraints: "",
  inputFormat: "",
  outputFormat: "",

  timeLimit: 1,
  memoryLimit: 128000,

  isPublished: true,
  testCases: [],
}

export function AddProblemDialog({ initialData, trigger }) {
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState(initialData ?? emptyForm)

  useEffect(() => {
    if (initialData) {
      const dataForEditing = structuredClone(initialData);
      dataForEditing.testCases = dataForEditing.testCases.map(tc => ({
        ...tc,
        input: tc.input.replace(/^\[|\]$/g, '')
      }));

      setForm(dataForEditing);
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const queryClient = useQueryClient()

  const createProblemMutation = useMutation({
    mutationFn: createProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] })

      setOpen(false)
    },
    onError: (err) => {
      console.error("Create problem failed", err)
    },
  })

  const updateProblemMutation = useMutation({
    mutationFn: ({ id, data }) => updateProblem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] })
      setOpen(false)
    },
  })


  /* ================= TEST CASE HANDLERS ================= */

  const addTestCase = () => {
    setForm({
      ...form,
      testCases: [
        ...form.testCases,
        { input: "", expectedOutput: "", isSample: false },
      ],
    })
  }

  const updateTestCase = (index, field, value) => {
    const updated = [...form.testCases]
    updated[index][field] = value
    setForm({ ...form, testCases: updated })
  }

  const removeTestCase = (index) => {
    setForm({
      ...form,
      testCases: form.testCases.filter((_, i) => i !== index),
    })
  }

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    const payload = {
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      constraints: form.constraints,
      inputFormat: form.inputFormat,
      outputFormat: form.outputFormat,
      timeLimit: form.timeLimit,
      memoryLimit: form.memoryLimit,
      isPublished: form.isPublished,
      testCases: form.testCases.map((tc) => ({
        ...tc,
        input: `[${tc.input}]`
      }))
    }

    if (initialData?._id) {
      updateProblemMutation.mutate({
        id: initialData._id,
        data: payload,
      })
    } else {
      createProblemMutation.mutate(payload)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <style>
        {`.no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}
      </style>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Problem</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Problem" : "Add New Problem"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* ================= BASIC INFO ================= */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                placeholder="Tiêu đề bài toán"
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-1 col-span-2">
              <Label>Description *</Label>

              <div className="rounded-md border bg-white">
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={(value) =>
                    setForm({ ...form, description: value })
                  }
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Mô tả chi tiết về bài toán."
                />
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-1">
              <Label>Difficulty</Label>
              <div className="flex w-full gap-3">
                {["Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setForm({ ...form, difficulty: level })
                    }
                    className={`flex-1 px-4 py-2 rounded-md border text-sm font-semibold
                      transition
                      ${form.difficulty === level
                        ? level === "Easy"
                          ? "bg-green-50 border-green-500 text-green-700"
                          : level === "Medium"
                            ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                            : "bg-red-50 border-red-500 text-red-700"
                        : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {/* Time limit */}
              <div className="space-y-1">
                <Label>
                  Time limit <span className="text-xs text-muted-foreground">(seconds)</span>
                </Label>
                <Input
                  type="number"
                  min={0.1}
                  step={0.1}
                  className="w-full"
                  value={form.timeLimit}
                  onChange={(e) =>
                    setForm({ ...form, timeLimit: Number(e.target.value) })
                  }
                />
              </div>

              {/* Memory limit */}
              <div className="space-y-1">
                <Label>
                  Memory limit <span className="text-xs text-muted-foreground">(KB)</span>
                </Label>
                <Input
                  type="number"
                  min={1024}
                  className="w-full"
                  value={form.memoryLimit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      memoryLimit: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

          </div>

          {/* ================= FORMATS ================= */}

          <div className="space-y-4">
            <div>
              <Label>Constraints</Label>
              <Textarea
                className="
                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-primary
                  focus-visible:ring-offset-0
                "
                placeholder={`Ràng buộc bài toán`}
                rows={3}
                value={form.constraints}
                onChange={(e) =>
                  setForm({ ...form, constraints: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Input Format</Label>
              <Textarea
                className="
                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-primary
                  focus-visible:ring-offset-0
                "
                rows={2}
                placeholder={`Định dạng đầu vào của bài toán.`}
                value={form.inputFormat}
                onChange={(e) =>
                  setForm({ ...form, inputFormat: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Output Format</Label>
              <Textarea
                className="
                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-primary
                  focus-visible:ring-offset-0
                "
                rows={2}
                placeholder={`Định dạng đầu ra của bài toán.`}
                value={form.outputFormat}
                onChange={(e) =>
                  setForm({ ...form, outputFormat: e.target.value })
                }
              />
            </div>
          </div>

          {/* ================= TEST CASES ================= */}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">
                Test Cases
              </h3>
              <Button size="sm" onClick={addTestCase}>
                + Add testcase
              </Button>
            </div>

            {form.testCases.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No testcases added yet
              </p>
            )}

            {form.testCases.map((tc, i) => (
              <div
                key={i}
                className="border rounded-md p-3 space-y-2 bg-slate-50"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Testcase #{i + 1}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeTestCase(i)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                <Textarea
                  className="
                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-primary
                  focus-visible:ring-offset-0
                "
                  rows={2}
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) =>
                    updateTestCase(i, "input", e.target.value)
                  }
                />

                <Textarea
                  className="
                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-primary
                  focus-visible:ring-offset-0
                "
                  rows={2}
                  placeholder="Expected Output"
                  value={tc.expectedOutput}
                  onChange={(e) =>
                    updateTestCase(
                      i,
                      "expectedOutput",
                      e.target.value
                    )
                  }
                />

                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={tc.isSample}
                    onCheckedChange={(v) =>
                      updateTestCase(i, "isSample", !!v)
                    }
                  />
                  Sample testcase (visible to user)
                </label>
              </div>
            ))}
          </div>

          {/* ================= PUBLISH ================= */}

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={form.isPublished}
              onCheckedChange={(v) =>
                setForm({ ...form, isPublished: !!v })
              }
            />
            Publish immediately
          </label>

          {/* ================= ACTIONS ================= */}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {initialData ? "Update Problem" : "Create Problem"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
