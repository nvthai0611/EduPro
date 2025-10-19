
import { Bookmark, Clock, Play, ChevronLeft, ChevronRight } from "lucide-react"

const MainContent = ({ currentLesson, onNextLesson, onPrevLesson }) => {
  // Video mapping for main modules (1, 2, 3, 4, 5...)
  const videoSessions = {
    1: "1112797263", // Module 1
    2: "1112797264", // Module 2
    3: "1112797265", // Module 3
    4: "1112797266", // Module 4
    5: "1112797267", // Module 5
  }

  const currentVideoId = videoSessions[currentLesson.moduleId] || videoSessions[1]

  return (
    <div className="flex-1 bg-slate-800 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Lesson Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            {currentLesson.moduleId}.{currentLesson.lessonId} {currentLesson.title}
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Bookmark className="w-6 h-6 text-slate-400 hover:text-orange-400" />
            </button>
          </h1>

          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>15:30</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Video</span>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={`https://player.vimeo.com/video/${currentVideoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
              width="100%"
              height="500"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              // eslint-disable-next-line react/prop-types
              title={`Khóa học Fullstack NodeJS - Module ${currentLesson.moduleId}`}
              className="w-full aspect-video"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevLesson}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Bài trước
          </button>

          <button
            onClick={onNextLesson}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl transition-all font-medium"
          >
            Bài tiếp theo
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainContent
