import { useState, useEffect, useRef } from "react";
// import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCourseBySlug, useSectionsWithLessons } from "../../hooks/useCourseQueries";
import * as orderService from "../../services/user/orderService";
import * as freeCourseService from "../../services/user/freeCourseService";
import { useAuth } from "../../hooks/useAuth";
import VideoPlayer from "../../components/Video/VideoPlayer";
import AssignmentSubmission from "../../components/Assignment/AssignmentSubmission";
import LessonCommentDialog from "../../components/LessonComment/LessonCommentDialog";
import { useMyLessonComment, useCreateLessonComment, useUpdateLessonComment, useCommentsForLesson, useTeacherReply } from "../../hooks/useLessonCommentQueries";
import { Loader2, CircleHelp } from "lucide-react";
import parse from 'html-react-parser';

// Component cho từng bài học trong danh sách bên phải
const LessonItem = ({ item, isCurrent, onClick }) => (
  <div
    className={`p-3 cursor-pointer border-b hover:bg-gray-50 transition ${isCurrent
      ? "bg-orange-100 text-orange-600 font-semibold"
      : "text-gray-700"
      }`}
    onClick={() => onClick(item)}
  >
    <div className="flex items-center justify-between">
      <span className="flex items-center text-sm">
        <i
          className={`mr-2 far fa-circle ${isCurrent ? "text-orange-500" : "text-gray-400"
            }`}
        ></i>
        {item.title}
      </span>
      <span className="text-xs text-gray-500">
        {item.videoDuration ? item?.videoDuration / 60 + " ph" : item?.readingTime + " ph"}
      </span>
    </div>
  </div>
);


// Component cho từng Section (Chương)
const CourseSection = ({ section, currentPlayingVideo, onLessonClick }) => {
  const sectionItems = section.lessons || []; // Sử dụng lessons thay vì items

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
              isCurrent={item._id === currentPlayingVideo?._id}
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
  const { user } = useAuth();

  // TanStack Query hooks - giống CourseBuilder
  const { data: course, isLoading: courseLoading, error: courseError } = useCourseBySlug(slug, {
    onError: (error) => {
      console.error('Error fetching course:', error);
    }
  });

  const courseId = course?._id;
  const { data: sections = [], isLoading: sectionsLoading, error: sectionsError } = useSectionsWithLessons(courseId);

  // Local states
  const [accessChecked, setAccessChecked] = useState(false);

  // Tạo pop up hỏi đáp
  const [showQABox, setShowQABox] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState({}); // Thay đổi từ [] thành {}

  const [showNoteBox, setShowNoteBox] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState({}); // { [videoId]: [{id,text,createdAt}, ...] }

  // State để quản lý video hiện tại đang phát
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  const [isAssignmentOpen, setAssignmentOpen] = useState(false);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);

  // Lesson comment state
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const currentLessonId = currentPlayingVideo?._id;
  const myCommentQuery = useMyLessonComment(currentLessonId, { enabled: !!currentLessonId });
  const allCommentsQuery = useCommentsForLesson(currentLessonId, { enabled: !!currentLessonId });
  const createCommentMutation = useCreateLessonComment();
  const updateCommentMutation = useUpdateLessonComment();
  const teacherReplyMutation = useTeacherReply();

  // State cho video controls
  const [videoRef, setVideoRef] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showVideoSettings, setShowVideoSettings] = useState(false);

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

  const handleCreateComment = async ({ lessonId, payload }) => {
    return createCommentMutation.mutateAsync({ lessonId, payload });
  };

  const handleUpdateComment = async ({ lessonId, payload }) => {
    return updateCommentMutation.mutateAsync({ lessonId, payload });
  };

  const handleTeacherReply = async ({ commentId, payload }) => {
    return teacherReplyMutation.mutateAsync({ commentId, payload });
  };

  // Access checking logic using TanStack Query data
  useEffect(() => {
    const checkCourseAccess = async () => {
      if (!course || !user || accessChecked) return;

      try {
        // Admin/Instructor/Manager can access all courses (they created/manage them)
        const isStaff = user?.role && ['admin', 'manager', 'instructor'].includes(user.role);
        if (isStaff) {
          setAccessChecked(true);
          return;
        }

        // Check if user has purchased this course
        const hasPurchased = await orderService.checkPurchase(
          user?.userId,
          course._id
        );

        // Check if course is free
        const isFree = freeCourseService.isFreeCourse(course);

        if (!hasPurchased.purchased && !isFree) {
          window.location.href = `/courses/${slug}`;
          return;
        }

        setAccessChecked(true);
      } catch (error) {
        console.error("Error checking course access:", error);
      }
    };

    checkCourseAccess();
  }, [course, user, slug, accessChecked]);




  const fileInputRef = useRef(null);

  // when current video changes, select first assignment by default
  useEffect(() => {
    const vid = currentPlayingVideo?.videoId;
    // const assigns = getAssignmentsForVideo(vid);
    // setSelectedAssignmentId(assigns[0]?.id || null);
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
    if (!sections || sections.length === 0) return;

    for (const section of sections) {
      if (section.lessons?.length) {
        const first = section.lessons.find((item) => item.videoUrl ? item?.videoUrl : item?.content);
        if (first) {
          setCurrentPlayingVideo({
            _id: first._id,
            title: first.title,
            videoId: first.videoUrl ? first.videoUrl.split("/")[first.videoUrl.split("/").length - 1] : null,
            content: first.content,
            updatedAt: first.updatedAt,
            type: first.type || (first.videoUrl ? 'video' : 'article')
          });
          break;
        }
      }
    }
  }, [sections]);

  // Xử lý khi click vào một bài học hoặc article
  const handleLessonClick = (item) => {
    if (item.videoUrl || item.content) {
      setCurrentPlayingVideo({
        _id: item._id,
        title: item.title,
        videoId: item.videoUrl ? item.videoUrl.split("/")[item.videoUrl.split("/").length - 1] : null,
        content: item.content,
        updatedAt: item.updatedAt,
        type: item.type || (item.videoUrl ? 'video' : 'article')
      });
    }
  };

  const handleAssignmentSubmit = ({ link, note }) => {
    if (!link) return;

    const newSubmission = {
      id: `${Date.now()}`,
      link,
      note,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    setAssignmentSubmissions((prev) => [newSubmission, ...prev]);
  };

  // Video control functions
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    try {
      if (videoRef && typeof videoRef.setPlaybackRate === 'function') {
        videoRef.setPlaybackRate(speed);
      }
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  };

  const handleVideoRef = (ref) => {
    setVideoRef(ref);
  };

  const handleVideoReady = () => {
    try {
      if (videoRef && typeof videoRef.setPlaybackRate === 'function' && playbackSpeed !== 1) {
        videoRef.setPlaybackRate(playbackSpeed);
      }
    } catch (error) {
      console.error('Error setting initial playback rate:', error);
    }
  };

  // Keyboard shortcuts for video control
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only work when video is focused or no input is focused
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          // Skip backward 10 seconds
          if (videoRef && videoRef.getCurrentTime && videoRef.seekTo) {
            const currentTime = videoRef.getCurrentTime();
            videoRef.seekTo(Math.max(0, currentTime - 10), true);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          // Skip forward 10 seconds
          if (videoRef && videoRef.getCurrentTime && videoRef.seekTo) {
            const currentTime = videoRef.getCurrentTime();
            const duration = videoRef.getDuration();
            videoRef.seekTo(Math.min(duration, currentTime + 10), true);
          }
          break;
        case ' ':
          e.preventDefault();
          if (videoRef && videoRef.getPlayerState) {
            const state = videoRef.getPlayerState();
            if (state === 1) { // playing
              videoRef.pauseVideo();
            } else if (state === 2) { // paused
              videoRef.playVideo();
            }
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [videoRef]);

  // Đóng video settings khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showVideoSettings && !event.target.closest('.video-settings')) {
        setShowVideoSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVideoSettings]);

  // Loading và error handling
  if (courseLoading || sectionsLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải khóa học...</span>
      </div>
    );
  }

  if (courseError || sectionsError) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">
            {courseError?.message || sectionsError?.message || "Không thể tải dữ liệu khóa học"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Video Embed URL
  const videoEmbedUrl = currentPlayingVideo?.videoId
    ? `https://www.youtube.com/watch?v=${currentPlayingVideo?.videoId}`
    : "";

  const finalContent = currentPlayingVideo?.content;

  return (
    <>


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

          {/* Video Player hoặc Article Content - Tăng kích thước */}
          <div className="w-full bg-black">
            <div className="aspect-[16/9] min-h-[600px] w-full">
              {currentPlayingVideo?.type === 'article' || (!videoEmbedUrl && finalContent) ? (
                <div className="w-full h-full bg-white overflow-y-auto">
                  <div className="p-8 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">{currentPlayingVideo?.title}</h1>
                    <div className="prose prose-lg max-w-none text-gray-800">
                      {finalContent ? parse(finalContent) : 'Nội dung đang được tải...'}
                    </div>
                  </div>
                </div>
              ) : videoEmbedUrl ? (
                <div className="relative w-full h-full">
                  <VideoPlayer
                    src={`${videoEmbedUrl}`}
                    title={currentPlayingVideo?.title}
                    className="w-full h-full min-h-[600px]"
                    onReady={handleVideoReady}
                    onRef={handleVideoRef}
                    showCustomControls={true}
                    speedControls={{
                      speedOptions: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
                      currentSpeed: playbackSpeed,
                      onSpeedChange: handleSpeedChange
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">
                      Không có nội dung để hiển thị
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
          <div className="p-6 bg-white border-t border-gray-200 shadow-sm flex-1" >
            <h1 className="text-3xl font-bold mb-1 text-gray-900">
              {currentPlayingVideo?.title}
            </h1>
            <p className="text-gray-500 text-sm">
              Cập nhật lần cuối vào ngày{" "}
              {formatDate(currentPlayingVideo?.updatedAt) ||
                "Chưa có thông tin cập nhật"}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                  onClick={() => setShowQABox(true)}
                >
                  <i className="fas fa-comments"></i> Hỏi đáp
                </button>
              </div>
              <button
                className="flex items-center gap-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
                onClick={() => setShowNoteBox(true)}
              >
                <i className="fas fa-plus text-xs"></i> Thêm ghi chú
              </button>
            </div>
          </div>

          {/* Thêm ghi chú popup */}
          {
            showNoteBox && (
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
            )
          }

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
          {
            showQABox && (
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
            )
          }

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
        </div >

        {/* Right - Course Content List */}
        < div className="w-full lg:w-[500px] flex-shrink-0 bg-white border-r overflow-y-auto p-4 shadow-inner" >
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
          <div className="h-[1100px] overflow-y-auto">
            {
              sections &&
              sections.map((section) => (
                <CourseSection
                  key={section._id}
                  section={section}
                  currentPlayingVideo={currentPlayingVideo}
                  onLessonClick={handleLessonClick}
                />
              ))
            }
          </div>
        </div >
      </div >

      {/* Floating Comment Island Button */}
      <button
        onClick={() => setCommentDialogOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300 group"
        title="Nhận xét bài học"
      >
        <CircleHelp size={24} className="text-white" strokeWidth={2.5} />
        {/* <span className="font-semibold text-base">Nhận xét</span> */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
      </button>

      <LessonCommentDialog
        open={isCommentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        lessonId={currentLessonId}
        lessonTitle={currentPlayingVideo?.title}
        onTeacherReply={handleTeacherReply}
        myComment={myCommentQuery.data}
        allComments={allCommentsQuery.data || []}
        onCreateComment={handleCreateComment}
        onUpdateComment={handleUpdateComment}
      />
    </>
  );
}