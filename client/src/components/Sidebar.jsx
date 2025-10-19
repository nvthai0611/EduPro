
import { useState } from "react"
import { Search, ChevronDown, ChevronRight, Play, CheckCircle, Circle } from "lucide-react"

const Sidebar = ({ courseData, currentLesson, onLessonSelect }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedModules, setExpandedModules] = useState([1]) // First module expanded by default

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const filteredCourseData = courseData
    .map((module) => ({
      ...module,
      lessons: module.lessons.filter((lesson) => lesson.title.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
    .filter((module) => module.lessons.length > 0)

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col" style={{background: 'linear-gradient(135deg, #ffffffff 0%, #d4d4d4ff 50%, #bbc2ccff 100%)'}}>
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bài học"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Course List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCourseData.map((module) => (
          <div key={module.id} className="border-b border-slate-700 last:border-b-0">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
            >
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1">
                  {module.id}. {module.title}
                </h3>
                <div className="text-xs text-slate-400">
                  {module.completedLessons} / {module.lessons.length} | {module.duration}
                </div>
              </div>
              {expandedModules.includes(module.id) ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {expandedModules.includes(module.id) && (
              <div className="bg-slate-950">
                {module.lessons.map((lesson) => {
                  const isCurrentLesson = currentLesson.moduleId === module.id && currentLesson.lessonId === lesson.id
                  const isCompleted = lesson.completed

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onLessonSelect(module.id, lesson.id, lesson.title)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-slate-800 transition-colors text-left border-t border-slate-800 ${
                        isCurrentLesson ? "bg-slate-800 border-l-4 border-l-orange-500" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-1 truncate">
                          {module.id}.{lesson.id} {lesson.title}
                        </div>
                        <div className="text-xs text-slate-400">{lesson.duration}</div>
                      </div>

                      <div className="flex-shrink-0">
                        <Play className="w-3 h-3 text-slate-500" />
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
