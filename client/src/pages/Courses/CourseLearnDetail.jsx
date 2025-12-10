import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseService } from "../../services/courseService";
import { lessonService } from "../../services/lessonService";
import * as orderService from "../../services/user/orderService";
import * as freeCourseService from "../../services/user/freeCourseService";
import { useAuth } from "../../hooks/useAuth";
import VideoPlayer from "../../components/Video/VideoPlayer";
import AssignmentSubmission from "../../components/Assignment/AssignmentSubmission";
import { Loader2 } from "lucide-react";

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
  const [questions, setQuestions] = useState({}); // Thay đổi từ [] thành {}

  const [showNoteBox, setShowNoteBox] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState({}); // { [videoId]: [{id,text,createdAt}, ...] }

  
  
  const handleSubmitQuestion = () => {
    if (!questionText.trim()) return;

    const currentVideoId = currentPlayingVideo?.videoId;

    const newQuestion = {
      id: Date.now(),
      text: questionText,
      createdAt: new Date(),
      userName: user?.fullName || "Người dùng",
      avatar: user?.avatar || "https://www.gravatar.com/avatar?d=mp&s=80",
    };

    setQuestions((prev) => ({
      ...prev,
      [currentVideoId]: [newQuestion, ...(prev[currentVideoId] || [])],
    }));
    setQuestionText("");
    setShowQABox(false);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;

    const currentVideoId = currentPlayingVideo?.videoId;
    const newNote = {
      id: Date.now(),
      text: noteText,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => ({
      ...prev,
      [currentVideoId]: [newNote, ...(prev[currentVideoId] || [])],
    }));
    setNoteText("");
    setShowNoteBox(false);
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

          // Check if course is free
          const isFree = freeCourseService.isFreeCourse(responeCourse.data);

          if (!hasPurchased.purchased && !isFree) {
            window.location.href = `/courses/${slug}`;
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
  const [isAssignmentOpen, setAssignmentOpen] = useState(false);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);

  // --- NEW: left assignment panel state (UI only, in-memory) ---
  const [showLeftAssignmentPanel, setShowLeftAssignmentPanel] = useState(false);

  // selected assignment for current video
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  // helper: sample assignments per video (UI-only). Thay bằng dữ liệu thật nếu cần.
  const getAssignmentsForVideo = (videoId) => {
    if (!videoId) return [];
    // ví dụ mặc định 3 bài tập; có thể thay đổi nội dung/prompt tùy video
    return [
      {
        id: "a1",
        title: "Bài tập 1",
        prompt:
          "Viết 1 đoạn tóm tắt 200-300 chữ về nội dung video. Nếu nộp file, chấp nhận .pdf hoặc .docx",
      },
      {
        id: "a2",
        title: "Bài tập 2",
        prompt:
          "Trả lời 3 câu hỏi ngắn liên quan đến lý thuyết trong video (mỗi câu 1-2 câu).",
      },
      {
        id: "a3",
        title: "Bài tập 3",
        prompt:
          "Chuẩn bị 1 file báo cáo ngắn (.pdf hoặc .docx) nêu ứng dụng thực tế của kiến thức trong video.",
      },
    ];
  };

  // store in-memory answers keyed by `${videoId}:${assignmentId}`
  const [leftPanelAnswers, setLeftPanelAnswers] = useState({
    // example:
    // "video123:a1": { textAnswers: [...], fileAnswers: [...] }
  });

  const fileInputRef = useRef(null);

  // when current video changes, select first assignment by default
  useEffect(() => {
    const vid = currentPlayingVideo?.videoId;
    const assigns = getAssignmentsForVideo(vid);
    setSelectedAssignmentId(assigns[0]?.id || null);
  }, [currentPlayingVideo]);

  const handleLeftTextSubmit = () => {
    if (!currentPlayingVideo?.videoId || !selectedAssignmentId) return;
    const videoId = currentPlayingVideo.videoId;
    const assignmentId = selectedAssignmentId;
    const key = `${videoId}:${assignmentId}`;

    const text = (document.getElementById("left-assignment-textarea") || {})
      .value || "";
    if (!text.trim()) return;

    const newAns = {
      id: `${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
    };

    setLeftPanelAnswers((prev) => ({
      ...prev,
      [key]: {
        textAnswers: [newAns, ...(prev[key]?.textAnswers || [])],
        fileAnswers: prev[key]?.fileAnswers || [],
      },
    }));

    if (document.getElementById("left-assignment-textarea"))
      document.getElementById("left-assignment-textarea").value = "";
  };

  const handleLeftFileSubmit = (e) => {
    e?.preventDefault();
    if (!currentPlayingVideo?.videoId || !selectedAssignmentId) return;
    const videoId = currentPlayingVideo.videoId;
    const assignmentId = selectedAssignmentId;
    const key = `${videoId}:${assignmentId}`;

    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const newFileAns = {
      id: `${Date.now()}`,
      fileName: file.name,
      createdAt: new Date().toISOString(),
    };

    setLeftPanelAnswers((prev) => ({
      ...prev,
      [key]: {
        textAnswers: prev[key]?.textAnswers || [],
        fileAnswers: [newFileAns, ...(prev[key]?.fileAnswers || [])],
      },
    }));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  // --- END NEW ---

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

  const handleAssignmentSubmit = ({ note, attachment }) => {
    if (!attachment) return;

    const newSubmission = {
      id: `${Date.now()}`,
      fileName: attachment.name,
      note,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    setAssignmentSubmissions((prev) => [newSubmission, ...prev]);
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Video Embed URL
  const videoEmbedUrl = currentPlayingVideo?.videoId
    ? `https://www.youtu.be/${currentPlayingVideo?.videoId}`
    : "";

  return (
    <>
      {/* --- NEW: Left fixed toggle button and panel --- */}
      {createPortal(
        <button
          onClick={() => setShowLeftAssignmentPanel((s) => !s)}
          className="fixed left-3 top-3 z-[9999] bg-orange-500 text-white px-3 py-2 rounded-r-lg shadow-lg hover:bg-orange-600 transition"
          title="Bài tập cho video"
          style={{ position: "fixed" }}
        >
          Bài tập
        </button>,
        document.body
      )}

      <div>
        {/* Panel cố định; bên trong có list nhiều bài tập cho 1 video */}
        <div
          className={`fixed left-0 top-16 z-40 bg-white w-[910px] shadow-xl rounded-r transition-transform ${
            showLeftAssignmentPanel ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ maxHeight: "calc(100vh - 4rem)", overflow: "auto" }}
        >
          <div className="p-4 border-b flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Bài tập</h3>
              <p className="text-sm text-gray-500">
                {currentPlayingVideo?.title || "Chưa chọn video"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLeftAssignmentPanel(false)}
                className="text-gray-500 hover:text-gray-800"
                title="Đóng"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* List bài tập */}
          <div className="p-3 border-b bg-gray-50">
            <div className="flex flex-col gap-2">
              {getAssignmentsForVideo(currentPlayingVideo?.videoId).map(
                (a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAssignmentId(a.id)}
                    className={`text-left px-3 py-2 rounded ${
                      selectedAssignmentId === a.id
                        ? "bg-orange-100 text-orange-700 font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {a.title}
                  </button>
                )
              )}

              {getAssignmentsForVideo(currentPlayingVideo?.videoId).length ===
                0 && (
                <div className="text-sm text-gray-500 px-3 py-2">
                  Chưa có bài tập cho video này.
                </div>
              )}
            </div>
          </div>

          {/* Nội dung bài tập được chọn */}
          <div className="p-4">
            {selectedAssignmentId ? (
              (() => {
                const assigns = getAssignmentsForVideo(
                  currentPlayingVideo?.videoId
                );
                const currentAssign = assigns.find(
                  (x) => x.id === selectedAssignmentId
                );
                const key = `${currentPlayingVideo?.videoId}:${selectedAssignmentId}`;
                const textAnswers = leftPanelAnswers[key]?.textAnswers || [];
                const fileAnswers = leftPanelAnswers[key]?.fileAnswers || [];

                return (
                  <>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">
                        {currentAssign?.title}
                      </h4>
                      <div className="p-3 border rounded bg-gray-50 text-sm text-gray-800">
                        {currentAssign?.prompt}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">
                        Trả lời bằng văn bản
                      </h4>
                      <textarea
                        id="left-assignment-textarea"
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-orange-300"
                        rows="5"
                        placeholder="Viết câu trả lời trực tiếp ở đây..."
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleLeftTextSubmit}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Gửi trả lời
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Hoặc tải file</h4>
                      <form onSubmit={handleLeftFileSubmit}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="w-full"
                          accept=".pdf,.doc,.docx,.txt"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Tải lên
                          </button>
                        </div>
                      </form>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Các nộp tạm của bạn</h4>

                      {textAnswers.length + fileAnswers.length === 0 && (
                        <p className="text-sm text-gray-500">
                          Bạn chưa nộp gì cho bài tập này.
                        </p>
                      )}

                      <div className="space-y-3">
                        {textAnswers.map((t) => (
                          <div
                            key={t.id}
                            className="p-3 border rounded bg-gray-50 text-sm"
                          >
                            <div className="text-xs text-gray-400 mb-1">
                              {formatDate(t.createdAt)}
                            </div>
                            <div>{t.text}</div>
                          </div>
                        ))}

                        {fileAnswers.map((f) => (
                          <div
                            key={f.id}
                            className="p-3 border rounded bg-gray-50 text-sm flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium">{f.fileName}</div>
                              <div className="text-xs text-gray-400">
                                {formatDate(f.createdAt)}
                              </div>
                            </div>
                            <div>
                              <button className="text-blue-600 text-sm" disabled>
                                Tải xuống
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="text-sm text-gray-500">
                Vui lòng chọn 1 bài tập.
              </div>
            )}
          </div>
        </div>
      </div>
      {/* --- END NEW --- */}

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
                <VideoPlayer
                  src={`${videoEmbedUrl}`}
                  title={currentPlayingVideo?.title}
                  className="w-full h-full"
                />
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
              <button
                className="flex items-center gap-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
                onClick={() => setShowNoteBox(true)}
              >
                <i className="fas fa-plus text-xs"></i> Thêm ghi chú
              </button>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                  onClick={() => setShowQABox(true)}
                >
                  <i className="fas fa-comments"></i> Hỏi đáp
                </button>
                <button
                  className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                  onClick={() => setAssignmentOpen(true)}
                >
                  <i className="fas fa-upload"></i> Nộp bài tập
                </button>
              </div>
            </div>
          </div>

          {/* Thêm ghi chú popup */}
          {showNoteBox && (
            <div className="p-6 border-t bg-white">
              <h2 className="text-lg font-semibold mb-2">Ghi chú</h2>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
                rows="6"
                placeholder="Viết ghi chú của bạn cho video này..."
              ></textarea>

              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={() => setShowNoteBox(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Hủy
                </button>

                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Lưu ghi chú
                </button>
              </div>
            </div>
          )}

          {/* Hiển thị ghi chú đã lưu cho video hiện tại (in-memory) */}
          <div className="p-6 bg-white border-t mt-2">
            <h2 className="text-lg font-semibold mb-4">Ghi chú của bạn</h2>

            {(!notes[currentPlayingVideo?.videoId] ||
              notes[currentPlayingVideo?.videoId].length === 0) && (
              <p className="text-gray-500 text-sm">Chưa có ghi chú nào.</p>
            )}

            <div className="space-y-4">
              {(notes[currentPlayingVideo?.videoId] || []).map((n) => (
                <div
                  key={n.id}
                  className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                >
                  <p className="text-gray-800 whitespace-pre-wrap">{n.text}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
              ))}
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

            {(!questions[currentPlayingVideo?.videoId] ||
              questions[currentPlayingVideo?.videoId].length === 0) && (
              <p className="text-gray-500 text-sm">Chưa có câu hỏi nào.</p>
            )}

            <div className="space-y-4">
              {(questions[currentPlayingVideo?.videoId] || []).map((q) => (
                <div
                  key={q.id}
                  className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={q.avatar} className="w-6 h-6 rounded-full" />
                    <span className="font-semibold text-sm">{q.userName}</span>
                  </div>

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
            <h3 className="text-lg font-bold text-gray-800">
              Nội dung khóa học
            </h3>
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
      <AssignmentSubmission
        open={isAssignmentOpen}
        onOpenChange={setAssignmentOpen}
        onSubmit={handleAssignmentSubmit}
        submissions={assignmentSubmissions}
        lessonTitle={currentPlayingVideo?.title}
      />
    </>
  );
}
