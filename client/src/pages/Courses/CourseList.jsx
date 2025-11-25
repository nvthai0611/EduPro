import React from 'react';
import { Users, PlayCircle, Clock } from 'lucide-react';

export default function FreeCourses() {
  const courses = [
    {
      id: 1,
      title: "Kiến Thức Nhập Môn IT",
      subtitle: "Kiến thức nhập môn{}",
      gradient: "from-pink-500 via-purple-500 to-purple-700",
      students: "137.665",
      lessons: "9",
      duration: "3h12p"
    },
    {
      id: 2,
      title: "Lập trình C++ cơ bản, nâng cao",
      subtitle: "Từ cơ bản\nđến nâng cao",
      gradient: "from-cyan-400 to-cyan-600",
      students: "38.186",
      lessons: "55",
      duration: "10h18p"
    },
    {
      id: 3,
      title: "HTML CSS từ Zero đến Hero",
      subtitle: "HTML, CSS\ntừ zero đến hero",
      gradient: "from-cyan-500 to-blue-600",
      students: "216.556",
      lessons: "117",
      duration: "29h5p"
    },
    {
      id: 4,
      title: "Responsive Với Grid System",
      subtitle: "Responsive\n@web design",
      gradient: "from-purple-600 to-purple-900",
      students: "48.158",
      lessons: "34",
      duration: "6h31p"
    },
    {
      id: 5,
      title: "Lập Trình JavaScript Cơ Bản",
      subtitle: "JavaScript\n{.Cơ bản}",
      gradient: "from-yellow-400 via-orange-400 to-orange-500",
      students: "137.665",
      lessons: "9",
      duration: "24h15p"
    },
    {
      id: 6,
      title: "Lập Trình JavaScript Nâng Cao",
      subtitle: "JavaScript\n{.Nâng cao}",
      gradient: "from-red-500 to-orange-600",
      students: "41.927",
      lessons: "19",
      duration: "8h41p"
    },
    {
      id: 7,
      title: "Làm việc với Terminal & Ubuntu",
      subtitle: "WSL Ubuntu\nWindows Terminal",
      gradient: "from-pink-600 via-rose-500 to-orange-500",
      students: "21.542",
      lessons: "28",
      duration: "4h59p"
    },
    {
      id: 8,
      title: "Xây Dựng Website với ReactJS",
      subtitle: "React JS\nLearn once, write anywhere",
      gradient: "from-indigo-900 to-purple-900",
      students: "79.297",
      lessons: "112",
      duration: "27h32p"
    }
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Khóa học miễn phí</h1>
          <a href="#" className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
            Xem lộ trình <span>›</span>
          </a>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              {/* Card Header with Gradient */}
              <div className={`h-48 bg-gradient-to-br ${course.gradient} flex items-center justify-center text-white p-6`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 whitespace-pre-line">{course.subtitle}</h3>
                </div>
                
              </div>
              <a href="http://"> xem chi tiet</a>

              {/* Card Body */}
              <div className="p-5">
                <h4 className="font-semibold text-gray-900 mb-2 text-base">
                  {course.title}
                </h4>
                <p className="text-orange-500 font-medium mb-4">Miễn phí</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" />
                    <span>{course.lessons}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}