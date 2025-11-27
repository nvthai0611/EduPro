import { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Users, PlayCircle, Clock, Globe, Database, Smartphone, Zap } from 'lucide-react'; 
import { courseData } from '../../../data/courseData'; 


// Dữ liệu các chuyên môn
const professions = [
  {
    name: "Frontend",
    slug: "frontend",
    count: 7,
    icon: Globe,
    color: "text-blue-600 bg-blue-100",
  },
  {
    name: "Backend",
    slug: "backend",
    count: 3,
    icon: Database,
    color: "text-green-600 bg-green-100",
  },
  {
    name: "Mobile",
    slug: "mobile",
    count: 1,
    icon: Smartphone,
    color: "text-purple-600 bg-purple-100",
  },
  {
    name: "DevOps",
    slug: "devops",
    count: 1,
    icon: Zap,
    color: "text-orange-600 bg-orange-100",
  },
];

// Component box chuyên môn
const ProfessionBox = ({ profession }) => {
  const IconComponent = profession.icon;
  return (
    <Link
      // ĐIỂM QUAN TRỌNG: Link trực tiếp đến trang lọc category
      to={`/courses/category/${profession.slug}`}
      className="block p-6 border rounded-2xl shadow-sm hover:shadow-lg transition duration-200 cursor-pointer bg-white"
    >
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 ${profession.color}`}
      >
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold mb-1">{profession.name}</h3>
      <p className="text-sm text-gray-500">{profession.count} khóa học</p>
    </Link>
  );
};

// Component Course Card
const CourseCard = ({ course }) => {
  const labelToUse = course.label || course.title;
  const labelLines = labelToUse
    .split("\n")
    .map((line, index) => <span key={index}>{line}</span>);

  const students = course.students || 0;
  const lessons = course.lessons || 0;
  const duration = course.duration || "N/A";
  const color = course.color || "from-gray-300 to-gray-500";

  return (
    <Link
      to={`/courses/detail/${course.slug}`}
      className="rounded-2xl shadow-md overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div
        className={`h-48 bg-gradient-to-br ${color} flex items-center justify-center text-white text-lg font-semibold p-4 text-center`}
        style={{ lineHeight: "1.2" }}
      >
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold mb-2 whitespace-pre-line">
            {labelLines}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <h4 className="font-semibold text-gray-900 mb-2 text-base line-clamp-2 min-h-[40px]">
          {course.title}
        </h4>
        <p className="text-orange-500 font-medium mb-4">Miễn phí</p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span>
              {typeof students === "number"
                ? students.toLocaleString("en-US")
                : students}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <PlayCircle className="w-4 h-4 text-green-500" />
            <span>{lessons}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- Component chính ---
export default function CourseList() {
  const { categorySlug } = useParams();
  const isCategoryPage = !!categorySlug;
  const courseListRef = useRef(null);

  // Logic lọc khóa học
  const filteredCourses = useMemo(() => {
    if (!categorySlug) {
      return courseData;
    }
    return courseData.filter((c) => c.category === categorySlug);
  }, [categorySlug]);

  // Find current profession for title
  const currentProfession = professions.find(p => p.slug === categorySlug);

  // Text cho Tiêu đề trang
  let headerTitle = "Khóa học miễn phí";
  if (isCategoryPage) {
    headerTitle = currentProfession
      ? `Khóa học ${currentProfession.name}`
      : "Khóa học";
  }

  const scrollToCourses = () => {
    courseListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* --- 1. HEADER CHÍNH (Chỉ hiển thị trên trang /courses index) --- */}
      {!isCategoryPage && (
        <div className="pt-16 pb-12 bg-gradient-to-r from-blue-600 to-purple-700 mb-10 text-white shadow-xl rounded-b-xl">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold mb-4 text-center">
              Học Lập Trình Từ Cơ Bản Đến Nâng Cao
            </h2>
            <p className="text-lg text-gray-200 mb-8 text-center max-w-3xl mx-auto">
              Khám phá thế giới lập trình với các khóa học chất lượng cao từ
              HoangAn IT. Từ Frontend đến Backend, từ Web đến Mobile - chúng tôi
              có tất cả!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={scrollToCourses} // Bấm vào thì cuộn xuống danh sách khóa học
                className="flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition"
              >
                <i className="fas fa-play-circle mr-2"></i> Bắt đầu học ngay
              </button>
              <div className="px-8 py-3 bg-white bg-opacity-0 border-2 border-white text-white font-semibold rounded-full hover:bg-opacity-10 transition cursor-pointer">
                Tư vấn lộ trình
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* --- 2. SECTION THỐNG KÊ (50+ Khóa học, 10K+ Học viên) --- */}
        {!isCategoryPage && (
          <div className="flex justify-around py-10 my-8 border-y border-gray-200">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800">50+</h3>
              <p className="text-gray-500">Khóa học</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800">10K+</h3>
              <p className="text-gray-500">Học viên</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800">500+</h3>
              <p className="text-gray-500">Giờ học</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800">5K+</h3>
              <p className="text-gray-500">Chứng chỉ</p>
            </div>
          </div>
        )}

        {/* --- 3. SECTION KHÁM PHÁ THEO CHUYÊN MÔN (Box chuyên môn) --- */}
        <div className="mb-12 text-center pt-8">
          <h2 className="text-3xl font-bold mb-2">Khám phá theo chuyên môn</h2>
          <p className="text-gray-500 mb-8">
            Chọn lĩnh vực phù hợp với mục tiêu nghề nghiệp của bạn
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {professions.map((p, i) => (
              <ProfessionBox key={i} profession={p} />
            ))}
          </div>
        </div>

        <hr className="my-10" />

        {/* --- 4. PHẦN DANH SÁCH KHÓA HỌC HIỂN THỊ DỰ TRÊN LỌC --- */}

        {isCategoryPage && (
          <div className="mb-8">
            {/* Nút Quay lại: Quay về trang Index /courses */}
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center mb-4"
            >
              <i className="fas fa-arrow-left mr-2"></i> Quay lại khám phá
              chuyên môn
            </Link>
          </div>
        )}

        {/* Phần Header danh sách khóa học (dùng ref để cuộn) */}
        <div ref={courseListRef}>
          {!isCategoryPage && (
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-medium text-gray-600">
                <span className="text-3xl font-bold text-black mr-2">
                  458.067+
                </span>{" "}
                người đã học
              </h2>
              <Link
                to="/xem-them"
                className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center"
              >
                Xem thêm <i className="fas fa-arrow-right ml-1 text-xs"></i>
              </Link>
            </div>
          )}

          <h1 className="text-4xl font-extrabold mb-8">{headerTitle}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <p className="text-center text-gray-600 mt-10 text-lg">
            Không tìm thấy khóa học nào trong chuyên môn **
            {currentProfession ? currentProfession.name : "này"}**.
          </p>
        )}
      </div>
    </div>
  );
}
