import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Users,
  PlayCircle,
  Clock,
  Globe,
  Database,
  Smartphone,
  Zap,
  Loader2,
  Star,
} from "lucide-react";
import { courseService } from "../../../services/courseService";
import { formatPrice } from "../../../utils/format";

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
 const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

const formatPrice = (price) => {
  if (price === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Component box chuyên môn
const ProfessionBox = ({ profession }) => {
  const IconComponent = profession.icon;
  return (
    <Link
      // ĐIỂM QUAN TRỌNG: Link trực tiếp đến trang lọc category
      to={`/courses/category/${profession.slug}`}
      className="block p-6 border rounded-2xl shadow-sm hover:shadow-lg transition duration-200 cursor-pointer bg-white flex flex-col items-center text-center"
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
  const gradientColors = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-green-400 to-green-600",
    "from-yellow-400 to-yellow-600",
    "from-red-400 to-red-600",
    "from-indigo-400 to-indigo-600",
    "from-teal-400 to-teal-600",
    "from-orange-400 to-orange-600",
    "from-cyan-400 to-cyan-600",
    "from-violet-400 to-violet-600",
    "from-fuchsia-400 to-fuchsia-600",
    "from-rose-400 to-rose-600",
    "from-sky-400 to-sky-600",
    "from-emerald-400 to-emerald-600",
    "from-amber-400 to-amber-600",
    "from-lime-400 to-lime-600",
  ];
  const labelToUse = course.label || course.title;
  const labelLines = labelToUse
    .split("\n")
    .map((line, index) => <span key={index}>{line}</span>);

  const students = course.students || 0;
  const lessons = course.lessons || 0;
  const duration = course.duration || "N/A";

  const getRandomGradient = () => {
    return gradientColors[Math.floor(Math.random() * gradientColors.length)];
  };

  const color = useMemo(() => {
    return course.color || getRandomGradient();
  }, [course.color]);

  return (
    <Link
      to={`/courses/${course.slug}`}
       onClick={handleClick}
      className="rounded-2xl shadow-md overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div
        className={`h-48 bg-gradient-to-br ${color} flex items-center justify-center text-white text-lg font-semibold p-4 text-center`}
        style={{ lineHeight: '1.2' }}
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
        <div className="flex items-center justify-between mb-4">
          <p className="text-orange-500 font-medium">{formatPrice(course.salePrice)}</p>
          <div>
            <span className="text-lg font-semibold flex items-center justify-between gap-1">
              {star.toFixed(1) || "5.0"} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </span>
          </div>
        </div>

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

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState([]);

  // Fetch courses từ backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = {};
        params.status = "published"; // Chỉ lấy khóa học đã xuất bản
        if (categorySlug) {
          params.category = categorySlug;
        }

        const response = await courseService.getCourses(params);
        setCourseData(response.data || []); // Đảm bảo luôn là array
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [categorySlug]);

  // Logic lọc khóa học
  const filteredCourses = useMemo(() => {
    if (!categorySlug) {
      return courseData;
    }
    return courseData.filter((c) => c.category === categorySlug);
  }, [categorySlug, courseData]);

  // Lấy tên chuyên môn để hiển thị tiêu đề
  const currentProfession = professions.find((p) => p.slug === categorySlug);

  // Text cho Tiêu đề trang
  let headerTitle = "Khóa học Pro";
  if (isCategoryPage) {
    headerTitle = currentProfession
      ? `Khóa học ${currentProfession.name}`
      : "Khóa học";
  }

  return (
    <div className="min-h-screen bg-white pb-12">
      <div className="max-w-7xl mx-auto">

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
                  10K+
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-10">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Course list */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <p className="text-center text-gray-600 mt-10 text-lg">
                Không tìm thấy khóa học nào trong chuyên môn{" "}
                <strong>
                  {currentProfession ? currentProfession.name : "này"}
                </strong>
                .
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
