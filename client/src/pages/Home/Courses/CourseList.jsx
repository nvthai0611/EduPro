import { useMemo, useRef } from "react";
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
  AlertCircle
} from "lucide-react";
import { useCourses } from "../../../hooks/useCourseQueries";



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
  
  sections.forEach(section => {
    if (section.lessons && Array.isArray(section.lessons)) {
      section.lessons.forEach(lesson => {
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
  
  sections.forEach(section => {
    if (section.lessons && Array.isArray(section.lessons)) {
      totalLessons += section.lessons.length;
    }
  });
  
  return totalLessons;
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

// Component Course Card với thông tin đầy đủ
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
  const realStudents = course.totalStudents || course.students || 0;
  const displayStudents = calculateStudentsDisplay(realStudents);
  
  // Tính toán thông tin từ sections và lessons
  const totalLessons = calculateTotalLessons(course.sections) || course.totalLessons || course.lessons || 0;
  const courseDuration = calculateTotalDuration(course.sections) || course.duration || "N/A";
  
  const averageRating = course?.averageRating || 5.0;

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
              {displayStudents > 0 ? displayStudents.toLocaleString("vi-VN") : "0"}
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
  const { categorySlug } = useParams();
  const isCategoryPage = !!categorySlug;
  const courseListRef = useRef(null);

  // ✅ TanStack Query với filters và data transformation
  const filters = useMemo(() => ({
    status: "published",
    ...(categorySlug && { category: categorySlug }),
  }), [categorySlug]);

  const { 
    data: courseData = [], 
    isLoading, 
    error: queryError,
    refetch 
  } = useCourses(filters, {
    // Transform data để bao gồm thông tin đầy đủ
    select: (data) => {
      if (!Array.isArray(data)) return [];
      
      return data.map(course => ({
        ...course,
        // Enhance course data với thông tin computed
        displayStudents: calculateStudentsDisplay(course.totalStudents || course.students || 0),
        computedLessons: calculateTotalLessons(course.sections) || course.totalLessons || course.lessons || 0,
        computedDuration: calculateTotalDuration(course.sections) || course.duration || "N/A",
        rating: course.averageRating || 5.0
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  const error = queryError ? "Không thể tải danh sách khóa học. Vui lòng thử lại sau." : null;

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

        {/* Loading state với skeleton */}
        {isLoading && (
          <>
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Đang tải khóa học...</span>
            </div>
            
            {/* Skeleton loader */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100 animate-pulse">
                  <div className="h-52 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="flex justify-between mb-4">
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-px bg-gray-200 mb-4"></div>
                    <div className="grid grid-cols-3 gap-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mb-1"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded mb-1"></div>
                          <div className="h-4 w-8 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-red-600 text-base mb-6 max-w-md mx-auto">{error}</p>
            <div className="space-x-3">
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center"
              >
                <Loader2 className="w-4 h-4 mr-2" />
                Thử lại
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Tải lại trang
              </button>
            </div>
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
