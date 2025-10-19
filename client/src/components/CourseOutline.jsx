import { Play, Clock, Users, Award, BookOpen, Code, Database, Globe } from "lucide-react"

// eslint-disable-next-line react/prop-types
const CourseOutline = ({ onContinue }) => {
  const courseModules = [
    {
      id: 1,
      title: "Nhập môn lập trình web",
      lessons: 11,
      duration: "01:25:52",
      icon: <Globe className="w-6 h-6" />,
      description: "Tìm hiểu cơ bản về web development và cài đặt môi trường",
    },
    {
      id: 2,
      title: "Ngôn ngữ đánh dấu HTML",
      lessons: 14,
      duration: "02:30:15",
      icon: <Code className="w-6 h-6" />,
      description: "Học HTML từ cơ bản đến nâng cao",
    },
    {
      id: 3,
      title: "Nhập môn CSS",
      lessons: 10,
      duration: "01:45:30",
      icon: <BookOpen className="w-6 h-6" />,
      description: "Styling và layout với CSS",
    },
    {
      id: 4,
      title: "JavaScript cơ bản",
      lessons: 15,
      duration: "03:20:45",
      icon: <Code className="w-6 h-6" />,
      description: "Lập trình JavaScript từ cơ bản",
    },
    {
      id: 5,
      title: "Node.js Backend",
      lessons: 20,
      duration: "04:15:30",
      icon: <Database className="w-6 h-6" />,
      description: "Xây dựng backend với Node.js",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
              F8
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-white">
                Fullstack NodeJS
              </h1>
              <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mt-2">
                PRO
              </span>
            </div>
          </div>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Khóa học Fullstack NodeJS từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hoàn chỉnh với Node.js,
            React và các công nghệ hiện đại.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-slate-300">
              <BookOpen className="w-5 h-5 text-orange-400" />
              <span>70+ Bài học</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-5 h-5 text-orange-400" />
              <span>15+ Giờ học</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-5 h-5 text-orange-400" />
              <span>1000+ Học viên</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Award className="w-5 h-5 text-orange-400" />
              <span>Chứng chỉ</span>
            </div>
          </div>
        </div>

        {/* Course Modules */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courseModules.map((module) => (
            <div
              key={module.id}
              className="glass-effect rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  {module.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors">
                    {module.id}. {module.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                    <span>{module.lessons} bài học</span>
                    <span>•</span>
                    <span>{module.duration}</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{module.description}</p>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
          >
            <Play className="w-6 h-6" />
            Bắt đầu học ngay
          </button>
          <p className="text-slate-400 text-sm mt-4">Nhấn để bắt đầu bài học đầu tiên</p>
        </div>
      </div>
    </div>
  )
}

export default CourseOutline
