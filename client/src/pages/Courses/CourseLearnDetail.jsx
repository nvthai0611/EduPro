import { useState, useEffect, useMemo, useCallback } from "react";
// import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import { useCourseBySlug, useSectionsWithMinimalLessons, useLesson, useArticle, lessonKeys, articleKeys } from "../../hooks/useCourseQueries";
import lessonService from "../../services/lessonService";
import { articleService } from "../../services/articleService";
import * as orderService from "../../services/user/orderService";
import { useAuth } from "../../hooks/useAuth";
import VideoPlayer from "../../components/Video/VideoPlayer";
// import AssignmentSubmission from "../../components/Assignment/AssignmentSubmission";
import LessonCommentDialog from "../../components/LessonComment/LessonCommentDialog";
import { useMyLessonComment, useCreateLessonComment, useUpdateLessonComment, useCommentsForLesson, useTeacherReply, useDeleteLessonComment, useUpdateReply, useDeleteReply } from "../../hooks/useLessonCommentQueries";
import { Loader2, CircleHelp, Video, BookOpen } from "lucide-react";
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
        {item.type === "video" ? (
          <span className="inline-flex items-center gap-2 px-3 py-1.5
                   rounded-full bg-blue-50 text-blue-600
                   border border-blue-200">
            <Video className="w-4 h-4" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-3 py-1.5
                   rounded-full bg-green-50 text-green-600
                   border border-green-200">
            <BookOpen className="w-4 h-4" />
          </span>
        )}
        <i
          className={`mr-2 far fa-circle ${isCurrent ? "text-orange-500" : "text-gray-400"
            }`}
        ></i>
        {item.title}
      </span>
      <span className="text-xs text-gray-500">
        {item.videoDuration ? `${(item.videoDuration / 60).toFixed(0)}m` : item.readingTime ? `${item.readingTime}m` : null}
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
  const queryClient = useQueryClient();

  // TanStack Query hooks - giống CourseBuilder
  const { data: course, isLoading: courseLoading, error: courseError } = useCourseBySlug(slug, {
    onError: (error) => {
      console.error('Error fetching course:', error);
    }
  });

  const courseId = course?._id;
  
  // SỬ DỤNG MINIMAL DATA CHO LIST - Chỉ load title, type, duration
  const { data: sections = [], isLoading: sectionsLoading, error: sectionsError } = useSectionsWithMinimalLessons(courseId);

  // Local states
  const [accessChecked, setAccessChecked] = useState(false);

  // Tạo pop up hỏi đáp
  const [showQABox, setShowQABox] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState({}); // Thay đổi từ [] thành {}

  const [showNoteBox, setShowNoteBox] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState({}); // { [videoId]: [{id,text,createdAt}, ...] }

  // State để quản lý video hiện tại đang phát (chỉ minimal data từ list)
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  
  // Fetch FULL lesson detail khi cần (lazy load) - CHỈ khi type là video
  const currentLessonId = currentPlayingVideo?._id;
  const { data: fullLessonData, isLoading: lessonDetailLoading} = useLesson(
    currentPlayingVideo?.type === 'video' ? currentLessonId : null,
    { enabled: !!currentLessonId && currentPlayingVideo?.type === 'video' }
  );

  // Fetch FULL article detail khi cần (lazy load) - CHỈ khi type là article
  const { data: fullArticleData, isLoading: articleDetailLoading } = useArticle(
    currentPlayingVideo?.type === 'article' ? currentLessonId : null,
    { enabled: !!currentLessonId && currentPlayingVideo?.type === 'article' }
  );

  // Helper function để tìm bài học kế tiếp
  const getNextLesson = useCallback(() => {
    if (!currentPlayingVideo || !sections || sections.length === 0) return null;

    let foundCurrent = false;
    for (const section of sections) {
      if (!section.lessons || section.lessons.length === 0) continue;
      
      for (let i = 0; i < section.lessons.length; i++) {
        const lesson = section.lessons[i];
        
        if (foundCurrent) {
          // Trả về bài học đầu tiên sau bài hiện tại
          return lesson;
        }
        
        if (lesson._id === currentPlayingVideo._id) {
          foundCurrent = true;
          // Nếu không phải bài cuối trong section, trả về bài kế tiếp
          if (i < section.lessons.length - 1) {
            return section.lessons[i + 1];
          }
          // Nếu là bài cuối, tiếp tục tìm trong section kế tiếp
        }
      }
    }
    
    return null;
  }, [currentPlayingVideo, sections]);

  // Prefetch bài học kế tiếp để giảm lag
  useEffect(() => {
    const nextLesson = getNextLesson();
    if (!nextLesson) return;

    // Prefetch dựa trên type của bài học kế tiếp
    if (nextLesson.type === 'video') {
      queryClient.prefetchQuery({
        queryKey: lessonKeys.detail(nextLesson._id),
        queryFn: async () => {
          const response = await lessonService.getLessonById(nextLesson._id);
          return response?.data || response;
        },
        staleTime: 1000 * 60 * 15, // Giống với useLesson hook
      });
    } else if (nextLesson.type === 'article') {
      queryClient.prefetchQuery({
        queryKey: articleKeys.detail(nextLesson._id),
        queryFn: async () => {
          const response = await articleService.getArticleContent(nextLesson._id);
          return response?.data || response;
        },
        staleTime: 1000 * 60 * 15, // Giống với useArticle hook
      });
    }
  }, [currentPlayingVideo, sections, queryClient, getNextLesson]);

  // Debug logging
  // useEffect(() => {
  //   if (currentPlayingVideo) {
  //     console.log('📹 Current Playing Video:', currentPlayingVideo);
  //     console.log('🎬 Video ID:', currentPlayingVideo.videoId);
  //     console.log('📝 Type:', currentPlayingVideo.type);
  //   }
  // }, [currentPlayingVideo]);

    // useEffect(() => {
    //   if (fullLessonData) {
    //     console.log('✅ Full Lesson Data loaded:', fullLessonData);
    //   }
    //   if (lessonError) {
    //     console.error('❌ Lesson Error:', lessonError);
    //   }
    // }, [fullLessonData, lessonError]);

  // useEffect(() => {
  //   if (fullArticleData) {
  //     console.log('✅ Full Article Data loaded:', fullArticleData);
  //   }
  //   if (articleError) {
  //     console.error('❌ Article Error:', articleError);
  //   }
  // }, [fullArticleData, articleError]);

  // State cho dialog
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);

  // Lesson comment state
  const myCommentQuery = useMyLessonComment(currentLessonId, { enabled: !!currentLessonId });
  const allCommentsQuery = useCommentsForLesson(currentLessonId, { enabled: !!currentLessonId });
  const createCommentMutation = useCreateLessonComment();
  const updateCommentMutation = useUpdateLessonComment();
  const teacherReplyMutation = useTeacherReply();
  const deleteCommentMutation = useDeleteLessonComment();
  const updateReplyMutation = useUpdateReply();
  const deleteReplyMutation = useDeleteReply();

  // State cho video controls
  const [videoRef, setVideoRef] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showVideoSettings, setShowVideoSettings] = useState(false);

  // Helper function to extract YouTube video ID from URL - đặt trước useMemo
  const extractVideoId = useCallback((url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }, []);

  // Get videoId from minimal data, or extract from full data's videoUrl - di chuyển lên trước
  const videoId = currentPlayingVideo?.videoId || 
                  (fullLessonData?.videoUrl ? extractVideoId(fullLessonData.videoUrl) : null);
  
  // Dùng embed URL với các tham số tối ưu cho loading nhanh hơn
  const videoEmbedUrl = useMemo(() => {
    if (!videoId) return "";
    // Dùng /embed/ thay vì /watch để load nhanh hơn
    // Thêm các params: rel=0 (không hiện related videos), modestbranding=1 (ẩn logo), autoplay=1
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  }, [videoId]);

  // Content - sử dụng full data khi đã load, fallback về minimal data
  const finalContent = useMemo(() => {
    return currentPlayingVideo?.type === 'article' 
      ? (fullArticleData?.content || currentPlayingVideo?.content)
      : (fullLessonData?.content || currentPlayingVideo?.content);
  }, [currentPlayingVideo?.type, fullArticleData?.content, fullLessonData?.content, currentPlayingVideo?.content]);

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

  const handleDeleteComment = async ({ lessonId }) => {
    return deleteCommentMutation.mutateAsync({ lessonId });
  };

  const handleUpdateReply = async ({ commentId, replyIndex, payload }) => {
    return updateReplyMutation.mutateAsync({ commentId, replyIndex, payload });
  };

  const handleDeleteReply = async ({ commentId, replyIndex }) => {
    return deleteReplyMutation.mutateAsync({ commentId, replyIndex });
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

        if (!hasPurchased.purchased) {
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




  // const fileInputRef = useRef(null);

  // when current video changes, select first assignment by default
  useEffect(() => {
    // const vid = currentPlayingVideo?.videoId;
    // const assigns = getAssignmentsForVideo(vid);
    // setSelectedAssignmentId(assigns[0]?.id || null);
  }, [currentPlayingVideo]);


  // --- END NEW ---

  // Auto-select first lesson when sections load
  useEffect(() => {
    if (!sections || sections.length === 0) return;
    if (currentPlayingVideo) return; // Đã có video đang phát

    // Tìm section đầu tiên có lessons
    for (const section of sections) {
      if (section.lessons?.length > 0) {
        const firstLesson = section.lessons[0];
        // Set minimal data từ list - full data sẽ được fetch tự động
        setCurrentPlayingVideo({
          _id: firstLesson._id,
          title: firstLesson.title,
          videoId: firstLesson.videoId || null,
          type: firstLesson.type || 'video',
          videoDuration: firstLesson.videoDuration,
          readingTime: firstLesson.readingTime
        });
        break;
      }
    }
  }, [sections, currentPlayingVideo]);

  // Xử lý khi click vào một bài học hoặc article - optimize với useCallback
  const handleLessonClick = useCallback((item) => {
    // Set minimal data - full content sẽ được fetch automatically qua useLesson/useArticle hooks
    setCurrentPlayingVideo({
      _id: item._id,
      title: item.title,
      videoId: item.videoId || null,
      type: item.type || 'video',
      videoDuration: item.videoDuration,
      readingTime: item.readingTime
    });
  }, []);


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

  return (
    <>
      {/* Preconnect to YouTube domains để tăng tốc load video */}
      <link rel="preconnect" href="https://www.youtube.com" />
      <link rel="preconnect" href="https://i.ytimg.com" />
      <link rel="dns-prefetch" href="https://www.youtube.com" />

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
              {/* Show loading khi đang fetch full content */}
              {(lessonDetailLoading || articleDetailLoading) ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải nội dung bài học...</p>
                  </div>
                </div>
              ) : currentPlayingVideo?.type === 'article' || (!videoEmbedUrl && finalContent) ? (
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
        < div className="w-full lg:w-[500px] flex-shrink-0 bg-white border-r overflow-y-auto p-4" >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 hidden lg:block">
              Nội dung khóa học
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Link to="/" className="hover:underline text-blue-600">
                <i className="fas fa-home"></i>
              </Link>
              <span className="mx-2 hidden lg:block">/</span>
              <Link to="/courses" className="hover:underline text-blue-600 hidden lg:block">
                Khóa học
              </Link>
              <span className="mx-2 hidden lg:block">/</span>
              <span className="text-gray-700 font-semibold line-clamp-1 text-xl lg:text-sm">
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
          <div className="h-[1100px] overflow-y-auto scrollbar-hide">
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
        onDeleteComment={handleDeleteComment}
        onUpdateReply={handleUpdateReply}
        onDeleteReply={handleDeleteReply}
      />
    </>
  );
}