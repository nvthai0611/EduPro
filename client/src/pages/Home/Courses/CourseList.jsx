import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  PlayCircle,
  Clock,
  Star,
} from "lucide-react";
import { useCourses } from "../../../hooks/useCourseQueries";
import SideBar from "./components/SideBar";
import Carousel from "./components/Carousel";

const handleClick = () => {
  window.scrollTo({ top: 0, behavior: "instant" });
};

// Utility functions
const formatPrice = (price) => {
  if (price === undefined || price === null) return "Miễn phí";
  if (price === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// AUTO TĂNG HỌC VIÊN 25% - Logic chính
const calculateStudentsDisplay = (realStudents) => {
  if (!realStudents || realStudents === 0) return 0;
  // Tăng 25% và làm tròn
  return Math.round(realStudents * 1.25);
};

// Tính tổng thời lượng từ sections và lessons
const calculateTotalDuration = (sections = []) => {
  let totalMinutes = 0;

  sections.forEach((section) => {
    if (section.lessons && Array.isArray(section.lessons)) {
      section.lessons.forEach((lesson) => {
        if (lesson.videoDuration) {
          totalMinutes += Math.round(lesson.videoDuration / 60); // Convert seconds to minutes
        } else if (lesson.readingTime) {
          totalMinutes += lesson.readingTime;
        }
      });
    }
  });

  if (totalMinutes === 0) return "N/A";

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
};

// Đếm tổng số lessons từ sections
const calculateTotalLessons = (sections = []) => {
  let totalLessons = 0;

  sections.forEach((section) => {
    if (section.lessons && Array.isArray(section.lessons)) {
      totalLessons += section.lessons.length;
    }
  });

  return totalLessons;
};

// Gradient colors constant
const GRADIENT_COLORS = [
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

// Component Course Card với thông tin đầy đủ
const CourseCard = ({ course }) => {

  const labelToUse = course.label || course.title;
  const labelLines = labelToUse
    .split("\n")
    .map((line, index) => <span key={index}>{line}</span>);
  const realStudents = course.totalStudents || course.students || 0;
  const displayStudents = calculateStudentsDisplay(realStudents);

  // Tính toán thông tin từ sections và lessons
  const totalLessons =
    calculateTotalLessons(course.sections) ||
    course.totalLessons ||
    course.lessons ||
    0;
  const courseDuration =
    calculateTotalDuration(course.sections) || course.duration || "N/A";

  const averageRating = course?.averageRating || 5.0;

  const color = useMemo(() => {
    const getRandomGradient = () => {
      return GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)];
    };
    return course.color || getRandomGradient();
  }, [course.color]);

  return (
    <Link
      to={`/courses/${course.slug}`}
      onClick={handleClick}
      className="group rounded-2xl shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
    >
      {/* Header with gradient background */}
      <div
        className={`h-52 bg-gradient-to-br ${color} flex items-center justify-center text-white p-6 text-center relative overflow-hidden`}
      >
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>

        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2 whitespace-pre-line leading-tight drop-shadow-sm">
            {labelLines}
          </h3>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6">
        {/* Course title */}
        <h4 className="font-bold text-gray-900 mb-3 text-lg line-clamp-2 min-h-[56px] group-hover:text-blue-600 transition-colors">
          {course.title}
        </h4>

        {/* Price and rating section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-orange-500 mb-1">
              {formatPrice(course.salePrice)}
            </p>
            {course.price && course.price > 0 && (
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(course.price)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">
              {averageRating?.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

        {/* Stats section - Hiển thị thông tin đầy đủ */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full mb-1">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-xs text-gray-500">Học viên</span>
            <span className="font-semibold text-gray-700 text-xs">
              {displayStudents > 0
                ? displayStudents.toLocaleString("vi-VN")
                : "0"}
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full mb-1">
              <PlayCircle className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-xs text-gray-500">Bài học</span>
            <span className="font-semibold text-gray-700">
              {totalLessons > 0 ? totalLessons : "0"}
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-50 rounded-full mb-1">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-xs text-gray-500">Thời lượng</span>
            <span className="font-semibold text-gray-700 text-xs">
              {courseDuration}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- Component chính ---
export default function CourseList() {
  // const { categorySlug } = useParams();
  // const isCategoryPage = !!categorySlug;

  // ✅ TanStack Query với filters và data transformation
  const filters = useMemo(
    () => ({
      status: "published",
      // ...(categorySlug && { category: categorySlug }),
    }),
    []
  );

  const {
    data: courseData = [],
  } = useCourses(filters, {
    // Transform data để bao gồm thông tin đầy đủ
    select: (data) => {
      if (!Array.isArray(data)) return [];

      return data.map((course) => ({
        ...course,
        // Enhance course data với thông tin computed
        // displayStudents: calculateStudentsDisplay(course.totalStudents || course.students || 0),
        // computedLessons: calculateTotalLessons(course.sections) || course.totalLessons || course.lessons || 0,
        computedDuration:
          calculateTotalDuration(course.sections) || course.duration || "N/A",
        rating: course.averageRating || 5.0,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Logic lọc khóa học
  const filteredCourses = useMemo(() => {
    return courseData;
  }, [courseData]);

  // Lấy tên chuyên môn để hiển thị tiêu đề
  // const currentProfession = professions.find((p) => p.slug === categorySlug);

  // Text cho Tiêu đề trang
  // let headerTitle = "Khóa học Pro";
  // if (isCategoryPage) {
  //   headerTitle = currentProfession
  //     ? `Khóa học ${currentProfession.name}`
  //     : "Khóa học";
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Container */}
      <div className="w-24 flex-shrink-0 p-4">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Carousel />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Danh sách khóa học</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
