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
import React from "react";
import { Link } from "react-router-dom";
// Font Awesome Icons (Giả định đã được import global hoặc dùng thư viện React Icons)
// Trong code mẫu dùng class "fas fa-users", "fas fa-book", "fas fa-clock"

// Dữ liệu mẫu (mở rộng để chứa đủ 12 khóa học theo hình 1)
const courses = [
  {
    slug: "kien-thuc-nhap-mon-it",
    title: "Kiến Thức Nhập Môn IT",
    label: "Kiến Thức Nền Tảng\n(Kiến thức nhập môn)",
    free: true,
    students: 137668,
    lessons: 9,
    time: "3h12p",
    color: "from-red-500 to-red-800",
  },
  {
    slug: "lap-trinh-cpp-co-ban-nang-cao",
    title: "Lập trình C++ cơ bản, nâng cao",
    label: "C++ cơ bản\nđến nâng cao",
    free: true,
    students: 38187,
    lessons: 55,
    time: "10h18p",
    color: "from-cyan-400 to-teal-400",
  },
  {
    slug: "html-css-zero-to-hero",
    title: "HTML CSS từ Zero đến Hero",
    label: "HTML, CSS\ntừ zero đến hero",
    free: true,
    students: 216557,
    lessons: 117,
    time: "29h5p",
    color: "from-blue-500 to-blue-700",
  },
  {
    slug: "responsive-web-design",
    title: "Responsive Với Grid System",
    label: "Responsive\n@web design",
    free: true,
    students: 48159,
    lessons: 6,
    time: "34h31p",
    color: "from-purple-500 to-pink-500",
  },
  {
    slug: "javascript-co-ban",
    title: "Javascript ( Cơ bản)",
    label: "JavaScript\n( Cơ bản)",
    free: true,
    students: 152626,
    lessons: 112,
    time: "24h18p",
    color: "from-yellow-400 to-orange-400",
  },
  {
    slug: "javascript-nang-cao",
    title: "Lập Trình Javascript Nâng Cao",
    label: "JavaScript\n( Nâng cao)",
    free: true,
    students: 41928,
    lessons: 19,
    time: "8h41p",
    color: "from-orange-500 to-red-500",
  },
  {
    slug: "wsl-ubuntu-windows-terminal",
    title: "Làm việc với Terminal & Ubuntu",
    label: "WSL Ubuntu\nWindows Terminal",
    free: true,
    students: 21544,
    lessons: 26,
    time: "4h59p",
    color: "from-green-500 to-emerald-700",
  },
  {
    slug: "xay-dung-website-voi-reactjs",
    title: "Xây Dựng Website với ReactJS",
    label: "React JS\nLearn once, write anywhere",
    free: true,
    students: 79299,
    lessons: 112,
    time: "27h32p",
    color: "from-indigo-900 to-purple-900",
  },
  {
    slug: "node-expressjs",
    title: "Node & ExpressJS",
    label: "Node & ExpressJS",
    free: true,
    students: 45617,
    lessons: 36,
    time: "12h8p",
    color: "from-green-600 to-lime-600",
  },
  {
    slug: "app-dung-cham-tay-len-mat",
    title: "App: \"Đừng Chạm Tay Lên Mặt\"",
    label: "DON'T\nTOUCH\nYOUR\nFACE",
    free: true,
    students: 11250,
    lessons: 13,
    time: "1h34p",
    color: "from-red-600 to-pink-600",
  },
  // Thêm 2 khóa học giả định để đủ 12 ô
  {
    slug: "ai-agent-3d",
    title: "Assistant 3D AI",
    label: "AI Agent\n3D",
    free: true,
    students: 5000,
    lessons: 5,
    time: "1h00p",
    color: "from-sky-400 to-blue-500",
  },
  {
    slug: "linux-co-ban",
    title: "Linux cơ bản",
    label: "Linux\nCơ bản",
    free: true,
    students: 15000,
    lessons: 10,
    time: "2h30p",
    color: "from-gray-700 to-black",
  },
];

// Component Course Card
const CourseCard = ({ course }) => {
    // Tách label thành các dòng
    const labelLines = course.label.split('\n').map((line, index) => (
        <span key={index}>{line}</span>
    ));

    return (
        <Link
            to={`/courses/${course.slug}`}
            className="rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
        >
            <div
                className={`h-40 bg-gradient-to-br ${course.color} flex items-center justify-center text-white text-lg font-semibold p-4 text-center`}
                style={{ lineHeight: '1.2' }} // Điều chỉnh khoảng cách dòng cho text
            >
                <div className="flex flex-col">
                    {labelLines}
                </div>
            </div>

            <div className="p-4">
                <p className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[56px]">{course.title}</p>
                <p className="text-red-500 text-sm mt-1">Miễn phí</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 border-t pt-3">
                    <span className="flex items-center gap-1">
                        {/* Biểu tượng users */}
                        <i className="fas fa-users text-blue-500"></i> {course.students.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        {/* Biểu tượng book */}
                        <i className="fas fa-book text-green-500"></i> {course.lessons}
                    </span>
                    <span className="flex items-center gap-1">
                        {/* Biểu tượng clock */}
                        <i className="fas fa-clock text-orange-500"></i> {course.time}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default function CourseList() {
    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-medium text-gray-600">
                    <span className="text-3xl font-bold text-black mr-2">458.067+</span> người đã học
                </h2>
                <Link to="/xem-them" className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center">
                    Xem thêm <i className="fas fa-arrow-right ml-1 text-xs"></i>
                </Link>
            </div>
            
            <h1 className="text-4xl font-extrabold mb-8">Khóa học miễn phí</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((c, i) => (
                    <CourseCard key={i} course={c} />
                ))}
            </div>
        </div>
    );
}