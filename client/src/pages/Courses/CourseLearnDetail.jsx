import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseService } from "../../services/courseService";
import { lessonService } from "../../services/lessonService";
import * as orderService from "../../services/user/orderService";
import { useAuth } from "../../hooks/useAuth";
// Đảm bảo đường dẫn import courseData đúng với cấu trúc của bạn

// Component cho từng bài học trong danh sách bên phải
const LessonItem = ({ item, isCurrent, onClick }) => (
  <div
    className={`p-3 cursor-pointer border-b hover:bg-gray-50 transition ${
      isCurrent
        ? "bg-orange-100 text-orange-600 font-semibold"
        : "text-gray-700"
    }`}
    onClick={() => onClick(item)}
  >
    <div className="flex items-center justify-between">
      <span className="flex items-center text-sm">
        <i
          className={`mr-2 far fa-circle ${
            isCurrent ? "text-orange-500" : "text-gray-400"
          }`}
        ></i>
        {item.title}
      </span>
      <span className="text-xs text-gray-500">
        {item.videoDuration ? item.videoDuration / 60 + " ph" : ""}
      </span>
    </div>
  </div>
);

// Component cho từng Section (Chương)
const CourseSection = ({ section, currentVideoId, onLessonClick }) => {
  const sectionItems = section.items || [];

  // Tính toán số bài đã hoàn thành và tổng số bài trong section
  const totalItems = sectionItems.length;

  // Mặc định mở section
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-2 border rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-sm font-semibold text-gray-800">
          {section.title}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <span className="mr-2">{totalItems} Bài Giảng</span>
          <i
            className={`fas ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
          ></i>
        </div>
      </div>
      {isOpen && sectionItems.length > 0 && (
        <div>
          {sectionItems.map((item, index) => (
            <LessonItem
              key={item._id || index}
              item={item}
              isCurrent={currentVideoId === item.videoUrl.split("/").pop()}
              onClick={onLessonClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function CourseLearnDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const { user } = useAuth();

  // Tạo pop up hỏi đáp
  const [showQABox, setShowQABox] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleSubmitQuestion = () => {
    if (!questionText.trim()) return;

    const newQuestion = {
      id: Date.now(),
      text: questionText,
      createdAt: new Date(),
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    setQuestionText("");
    setShowQABox(false);
  };

  useEffect(() => {
    // Fetch course data from API
    const fetchCourse = async () => {
      try {
        const responeCourse = await courseService.getCourseBySlug(slug);
        const responeLessons = await lessonService.getLessonsByCourse(
          responeCourse.data._id
        );

        // Check if user has purchased this course
        if (user) {
          const hasPurchased = await orderService.checkPurchase(
            user?.userId,
            responeCourse.data._id
          );

          if (!hasPurchased.purchased) {
            window.location.href = `/checkout?course=${responeCourse.data._id}`;
            return;
          } else {
            const sectionsMap = {};

            for (const lesson of responeLessons) {
              const sec = lesson.sectionId; // thông tin section trong từng lession

              // nhóm lesson theo id của section
              if (!sectionsMap[sec._id]) {
                sectionsMap[sec._id] = {
                  _id: sec._id,
                  title: sec.title,
                  description: sec.description,
                  items: [],
                };
              }

              sectionsMap[sec._id].items.push(lesson);
            }

            const dataFinal = {
              ...responeCourse.data,
              sections: Object.values(sectionsMap),
            };

            setCourse(dataFinal);
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourse();
  }, [slug, user]);

  // State để quản lý video hiện tại đang phát
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);

  useEffect(() => {
    if (!course || !course.sections) return;

    for (const section of course.sections) {
      if (section.items?.length) {
        const first = section.items.find((item) => item.videoUrl);
        if (first) {
          setCurrentPlayingVideo({
            title: first.title,
            videoId:
              first.videoUrl.split("/")[first.videoUrl.split("/").length - 1],
            updatedAt: first.updatedAt,
          });
          break;
        }
      }
    }
  }, [course]);

  // Xử lý khi click vào một bài học
  const handleLessonClick = (lesson) => {
    if (lesson.videoUrl) {
      setCurrentPlayingVideo({
        title: lesson.title,
        videoId:
          lesson.videoUrl.split("/")[lesson.videoUrl.split("/").length - 1],
        updatedAt: lesson.updatedAt,
      });
    }
  };

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Khóa học với slug ${slug} không tìm thấy!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Có vẻ như khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i className="fas fa-arrow-left mr-2"></i> Quay lại danh sách khóa học
        </Link>
      </div>
    );
  }

  // Video Embed URL
  const videoEmbedUrl = currentPlayingVideo?.videoId
    ? `https://www.youtube.com/embed/${currentPlayingVideo?.videoId}?autoplay=1&rel=0`
    : "";

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100">
      {/* Left - Video Player & Lesson Info */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header (Nút Back Desktop) */}
        <div className="hidden lg:flex justify-end p-4 bg-white border-b sticky top-0 z-10">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition duration-150"
          >
            <i className="fas fa-arrow-left text-sm"></i>
            <span className="text-sm font-semibold">
              Quay lại danh sách khóa học
            </span>
          </button>
        </div>

        {/* Video Player - Sử dụng aspect-video để responsive */}
        <div className="w-full bg-black">
          <div className="aspect-video">
            {videoEmbedUrl ? (
              <iframe
                className="w-full h-full"
                src={videoEmbedUrl}
                title={currentPlayingVideo?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold p-10">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">
                    Không có video để phát
                  </h1>
                  <p className="text-lg">
                    Hãy chọn một bài học từ danh sách bên phải.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Details */}
        <div className="p-6 bg-white border-t border-gray-200 shadow-sm flex-1">
          <h1 className="text-3xl font-bold mb-1 text-gray-900">
            {currentPlayingVideo?.title}
          </h1>
          <p className="text-gray-500 text-sm">
            Cập nhật lần cuối vào ngày{" "}
            {formatDate(currentPlayingVideo?.updatedAt) ||
              "Chưa có thông tin cập nhật"}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <button className="flex items-center gap-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition">
              <i className="fas fa-plus text-xs"></i> Thêm ghi chú
            </button>
            <button
              className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
              onClick={() => setShowQABox(true)}
            >
              <i className="fas fa-comments"></i> Hỏi đáp
            </button>
          </div>
        </div>

        {/* Phần hỏi đáp */}
        {showQABox && (
          <div className="p-6 border-t bg-white">
            <h2 className="text-lg font-semibold mb-2">Đặt câu hỏi</h2>

            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
              rows="4"
              placeholder="Nhập câu hỏi của bạn..."
            ></textarea>

            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setShowQABox(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Hủy
              </button>

              <button
                onClick={handleSubmitQuestion}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Gửi câu hỏi
              </button>
            </div>
          </div>
        )}

        {/* Hiển thị câu hỏi đã gửi tạm thời */}
        <div className="p-6 bg-white border-t mt-2">
          <h2 className="text-lg font-semibold mb-4">Câu hỏi của bạn</h2>

          {questions.length === 0 && (
            <p className="text-gray-500 text-sm">Chưa có câu hỏi nào.</p>
          )}

          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="text-gray-800">{q.text}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {formatDate(q.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Course Content List */}
      <div className="w-full lg:w-[500px] flex-shrink-0 bg-white border-l overflow-y-auto p-4 shadow-inner">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Nội dung khóa học</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <Link to="/" className="hover:underline text-blue-600">
              <i className="fas fa-home"></i>
            </Link>
            <span className="mx-2">/</span>
            <Link to="/courses" className="hover:underline text-blue-600">
              Khóa học
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-semibold line-clamp-1">
              {course.title}
            </span>
          </div>
        </div>

        {/* Mobile/Tablet Back Button */}
        <button
          onClick={() => navigate("/courses")}
          className="lg:hidden w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mb-4 text-sm font-medium hover:bg-gray-300 transition"
        >
          <i className="fas fa-arrow-left"></i> Quay lại danh sách
        </button>

        {/* <div className="w-full flex items-center gap-2 bg-orange-100 border border-orange-300 text-orange-700 px-4 py-2 rounded-lg mb-4 text-sm font-medium">
          <i className="fas fa-fire"></i> Bắt đầu chuỗi ngày học
        </div>
        <p className="text-xs text-gray-600 mb-4">
          Hoàn thành: **{totalCompletedLessons}/{totalAllLessons}** bài học
        </p> */}

        {/* List Sections */}
        {course.sections &&
          course.sections.map((section) => (
            <CourseSection
              key={section._id}
              section={section}
              currentVideoId={currentPlayingVideo?.videoId}
              onLessonClick={handleLessonClick}
            />
          ))}
      </div>
    </div>
  );
}
