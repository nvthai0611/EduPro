import React, { useState } from 'react';
import { Users, PlayCircle, Clock, ArrowLeft, BookmarkPlus, Circle, CheckCircle, Lock, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

export default function FreeCourses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({ 1: true });

  const courses = [
    {
      id: 1,
      slug: "kien-thuc-nhap-mon-it",
      title: "Kiến Thức Nhập Môn IT",
      subtitle: "Kiến thức nhập môn{}",
      gradient: "from-pink-500 via-purple-500 to-purple-700",
      students: "137.665",
      lessons: "9",
      duration: "3h12p",
      progress: 0,
      totalLessons: 12,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      chapters: [
        {
          id: 1,
          title: "1. Khái niệm kỹ thuật cần biết",
          duration: "0/3 | 23:09",
          lessons: [
            { 
              id: 1, 
              title: "1. Mô hình Client - Server là gì?", 
              duration: "11:35", 
              completed: false, 
              current: true,
              videoUrl: "https://www.youtube.com/embed/IoL9izioni4Y"
            },
            { 
              id: 2, 
              title: "2. Domain là gì? Tên miền là gì?", 
              duration: "10:34", 
              completed: false, 
              locked: false,
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },
            { 
              id: 3, 
              title: "3. Mua áo F8 | Đăng ký học Offline", 
              duration: "01:00", 
              completed: false, 
              locked: true,
              videoUrl: ""
            }
          ]
        },
        {
          id: 2,
          title: "2. Môi trường, con người IT",
          duration: "0/3 | 01:46:14",
          lessons: [
            { 
              id: 4, 
              title: "1. Các mô hình làm việc phổ biến", 
              duration: "12:30", 
              completed: false, 
              locked: false,
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },
            { 
              id: 5, 
              title: "2. Làm việc nhóm hiệu quả", 
              duration: "15:20", 
              completed: false, 
              locked: false,
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            }
          ]
        },
        {
          id: 3,
          title: "3. Phương pháp, định hướng",
          duration: "0/4 | 01:04:27",
          lessons: [
            { 
              id: 6, 
              title: "1. Lộ trình học lập trình", 
              duration: "18:45", 
              completed: false, 
              locked: false,
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            }
          ]
        },
        {
          id: 4,
          title: "4. Hoàn thành khóa học",
          duration: "0/2 | 13:00",
          lessons: [
            { 
              id: 7, 
              title: "1. Chia sẻ và nhận xét", 
              duration: "08:30", 
              completed: false, 
              locked: false,
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      slug: "lap-trinh-cpp-co-ban",
      title: "Lập trình C++ cơ bản, nâng cao",
      subtitle: "Từ cơ bản\nđến nâng cao",
      gradient: "from-cyan-400 to-cyan-600",
      students: "38.186",
      lessons: "55",
      duration: "10h18p",
      progress: 0,
      totalLessons: 55,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      chapters: []
    },
    {
      id: 3,
      slug: "html-css-tu-zero-den-hero",
      title: "HTML CSS từ Zero đến Hero",
      subtitle: "HTML, CSS\ntừ zero đến hero",
      gradient: "from-cyan-500 to-blue-600",
      students: "216.556",
      lessons: "117",
      duration: "29h5p",
      progress: 0,
      totalLessons: 117,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      chapters: []
    },
    {
      id: 4,
      slug: "responsive-voi-grid-system",
      title: "Responsive Với Grid System",
      subtitle: "Responsive\n@web design",
      gradient: "from-purple-600 to-purple-900",
      students: "48.158",
      lessons: "34",
      duration: "6h31p",
      progress: 0,
      totalLessons: 34,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      chapters: []
    },
    {
      id: 5,
      slug: "lap-trinh-javascript-co-ban",
      title: "Lập Trình JavaScript Cơ Bản",
      subtitle: "JavaScript\n{.Cơ bản}",
      gradient: "from-yellow-400 via-orange-400 to-orange-500",
      students: "137.665",
      lessons: "9",
      duration: "24h15p",
      progress: 0,
      totalLessons: 24,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      chapters: []
    },
    {
      id: 6,
      slug: "lap-trinh-javascript-nang-cao",
      title: "Lập Trình JavaScript Nâng Cao",
      subtitle: "JavaScript\n{.Nâng cao}",
      gradient: "from-red-500 to-orange-600",
      students: "41.927",
      lessons: "19",
      duration: "8h41p",
      progress: 0,
      totalLessons: 19,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      chapters: []
    },
    {
      id: 7,
      slug: "lam-viec-voi-terminal-ubuntu",
      title: "Làm việc với Terminal & Ubuntu",
      subtitle: "WSL Ubuntu\nWindows Terminal",
      gradient: "from-pink-600 via-rose-500 to-orange-500",
      students: "21.542",
      lessons: "28",
      duration: "4h59p",
      progress: 0,
      totalLessons: 28,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      chapters: []
    },
    {
      id: 8,
      slug: "xay-dung-website-voi-reactjs",
      title: "Xây Dựng Website với ReactJS",
      subtitle: "React JS\nLearn once, write anywhere",
      gradient: "from-indigo-900 to-purple-900",
      students: "79.297",
      lessons: "112",
      duration: "27h32p",
      progress: 0,
      totalLessons: 112,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      chapters: []
    }
  ];

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleLessonClick = (lesson) => {
    if (!lesson.locked) {
      setCurrentLesson(lesson);
    }
  };

  const getCurrentLesson = (course) => {
    if (currentLesson) return currentLesson;
    
    // Find first lesson that is current or not completed
    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.current || !lesson.completed) {
          return lesson;
        }
      }
    }
    return course.chapters[0]?.lessons[0];
  };

  if (selectedCourse) {
    const course = courses.find(c => c.slug === selectedCourse);

    const activeLesson = getCurrentLesson(course);
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-800 text-white">
          <div className="max-w-full mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setSelectedCourse(null);
                  setCurrentLesson(null);
                }}
                className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold">
                  F8
                </div>
                <span className="font-semibold">{course.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span>{course.progress}%</span>
              <span>{course.progress}/{course.totalLessons} bài học</span>
              <button className="hover:text-orange-400 transition-colors flex items-center gap-1">
                <BookmarkPlus className="w-5 h-5" />
                <span>Ghi chú</span>
              </button>
              <button className="hover:text-orange-400 transition-colors">
                ❓ Hướng dẫn
              </button>
            </div>
          </div>
        </div>

        <div className="flex max-w-full">
          {/* Video Player Area */}
          <div className="flex-1 bg-black">
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={activeLesson?.videoUrl || course.videoUrl}
                title={activeLesson?.title || course.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Title and Navigation */}
            <div className="bg-white p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {activeLesson?.title || "Mô hình Client - Server là gì?"}
              </h1>
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-gray-400 px-6 py-2 rounded-full border border-gray-300 hover:border-blue-400 hover:text-blue-400 transition-colors">
                  <span>←</span>
                  <span>BÀI TRƯỚC</span>
                </button>
                <button className="flex items-center gap-2 bg-blue-400 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition-colors">
                  <span>BÀI TIẾP THEO</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Course Content */}
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
            <div className="p-4">
              {/* Achievement Badge */}
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">🔥</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Bắt đầu chuỗi ngày học
                    </h3>
                    <p className="text-sm text-gray-600">
                      Hoàn thành 1 bài để bắt đầu!
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="font-bold text-gray-900 mb-4">Nội dung khóa học</h2>

              {/* Chapters */}
              <div className="space-y-2">
                {course.chapters?.map((chapter) => (
                  <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Chapter Header */}
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-500">{chapter.duration}</p>
                      </div>
                      {expandedChapters[chapter.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {/* Chapter Lessons */}
                    {expandedChapters[chapter.id] && (
                      <div className="border-t border-gray-200">
                        {chapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson)}
                            className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                              lesson.locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                            } ${
                              (currentLesson?.id === lesson.id) || (lesson.current && !currentLesson) ? 'bg-orange-50' : ''
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {lesson.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : lesson.locked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                              ) : (
                                <Circle className={`w-5 h-5 ${
                                  (currentLesson?.id === lesson.id) || (lesson.current && !currentLesson) ? 'text-orange-500' : 'text-gray-300'
                                }`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${
                                (currentLesson?.id === lesson.id) || (lesson.current && !currentLesson) ? 'text-orange-500 font-medium' : 'text-gray-700'
                              }`}>
                                {lesson.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.locked && (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-500">{lesson.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Q&A Button */}
            <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
              <button className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Hỏi đáp</span>
              </button>
              <button className="w-full mt-2 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-full hover:border-gray-400 transition-colors text-sm">
                <span>+ Thêm ghi chú tại 00:00</span>
              </button>
            </div>

            {/* Bottom Navigation */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 transition-colors">
                <span className="font-medium">1. Khái niệm kỹ thuật cần biết</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div 
              key={course.id} 
              onClick={() => setSelectedCourse(course.slug)}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Card Header with Gradient */}
              <div className={`h-48 bg-gradient-to-br ${course.gradient} flex items-center justify-center text-white p-6`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 whitespace-pre-line">{course.subtitle}</h3>
                </div>
              </div>

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
import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseData } from "../../data/courseData"; // Đảm bảo đường dẫn đúng

// Component cho từng bài học trong danh sách bên phải
const LessonItem = ({ item, isCurrent, onClick }) => (
    <div
        className={`p-3 cursor-pointer border-b hover:bg-gray-50 transition ${isCurrent ? 'bg-gray-100 text-orange-600 font-semibold' : 'text-gray-700'}`}
        onClick={() => onClick(item)}
    >
        <div className="flex items-center justify-between">
            <span className="flex items-center text-sm">
                <i className={`mr-2 ${item.completed ? 'far fa-check-circle text-green-500' : 'far fa-circle text-gray-400'}`}></i>
                {item.title}
            </span>
            <span className="text-xs text-gray-500">{item.duration}</span>
        </div>
    </div>
);

// Component cho từng Section (Chương)
const CourseSection = ({ section, currentVideoId, onLessonClick }) => {
    const [isOpen, setIsOpen] = useState(true); // Mặc định mở
    
    // Tính toán số bài đã hoàn thành và tổng số bài trong section
    const completedItems = section.items ? section.items.filter(item => item.completed).length : 0;
    const totalItems = section.items ? section.items.length : 0;

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
                    <span className="mr-2">{completedItems}/{totalItems}</span>
                    <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </div>
            </div>
            {isOpen && section.items && (
                <div>
                    {section.items.map((item, index) => (
                        <LessonItem
                            key={item.id || index}
                            item={item}
                            isCurrent={item.videoId === currentVideoId}
                            onClick={onLessonClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


export default function CourseDetail() {
    const { slug } = useParams();
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    // Tìm khóa học dựa trên slug từ courseData
    const course = useMemo(() => {
        return courseData.find(c => c.slug === slug);
    }, [slug]);

    // State để quản lý video hiện tại đang phát
    const [currentPlayingVideo, setCurrentPlayingVideo] = useState(() => {
        // Mặc định lấy video đầu tiên của khóa học nếu có
        if (course && course.sections && course.sections.length > 0 && course.sections[0].items && course.sections[0].items.length > 0) {
            return {
                title: course.sections[0].items[0].title,
                videoId: course.sections[0].items[0].videoId
            };
        }
        return { title: "Không có video", videoId: "" };
    });


    // Xử lý khi click vào một bài học
    const handleLessonClick = (lesson) => {
        setCurrentPlayingVideo({
            title: lesson.title,
            videoId: lesson.videoId
        });
    };

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Khóa học với slug "**{slug}**" không tìm thấy!
                </h1>
                <p className="text-lg text-gray-600 mb-6">Có vẻ như khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ.</p>
                <Link to="/courses" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <i className="fas fa-arrow-left mr-2"></i> Quay lại danh sách khóa học
                </Link>
            </div>
        );
    }
    
    // Video Embed URL
    const videoEmbedUrl = currentPlayingVideo.videoId 
        ? `https://www.youtube.com/embed/${currentPlayingVideo.videoId}?autoplay=1&rel=0` 
        : "";

    // Tính toán tổng số bài đã hoàn thành và tổng số bài của cả khóa
    const totalCompletedLessons = course.sections.reduce((acc, section) => 
        acc + (section.items ? section.items.filter(item => item.completed).length : 0), 0
    );
    const totalAllLessons = course.sections.reduce((acc, section) => 
        acc + (section.items ? section.items.length : 0), 0
    );


    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100">

            {/* Left - Video Player & Lesson Info */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Header (để hiển thị nút Back) */}
                <div className="hidden lg:flex justify-end p-4 bg-white border-b sticky top-0 z-10">
                    <button 
                        onClick={() => navigate('/courses')}
                        className="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition duration-150"
                    >
                        <i className="fas fa-arrow-left text-sm"></i>
                        <span className="text-sm font-semibold">Quay lại danh sách khóa học</span>
                    </button>
                </div>

                {/* Video Player - Sử dụng aspect-video để responsive */}
                <div className="w-full bg-black">
                    <div className="aspect-video"> 
                        {videoEmbedUrl ? (
                            <iframe
                                className="w-full h-full"
                                src={videoEmbedUrl}
                                title={currentPlayingVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold p-10">
                                <div className="text-center">
                                    <h1 className="text-4xl font-bold mb-4">Không có video để phát</h1>
                                    <p className="text-lg">Hãy chọn một bài học từ danh sách bên phải.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lesson Details */}
                <div className="p-6 bg-white border-t border-gray-200 shadow-sm flex-1">
                    <h1 className="text-3xl font-bold mb-1 text-gray-900">{currentPlayingVideo.title}</h1>
                    <p className="text-gray-500 text-sm">{course.updatedAt}</p>

                    <div className="mt-4 flex items-center justify-between">
                        <button className="flex items-center gap-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition">
                            <i className="fas fa-plus text-xs"></i> Thêm ghi chú
                        </button>
                        <button className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
                            <i className="fas fa-comments"></i> Hỏi đáp
                        </button>
                    </div>
                </div>
            </div>

            {/* Right - Course Content List */}
            <div className="w-full lg:w-[350px] flex-shrink-0 bg-white border-l overflow-y-auto p-4 shadow-inner">
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
                    onClick={() => navigate('/courses')}
                    className="lg:hidden w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mb-4 text-sm font-medium hover:bg-gray-300 transition"
                >
                    <i className="fas fa-arrow-left"></i> Quay lại danh sách
                </button>
                
                <div className="w-full flex items-center gap-2 bg-orange-100 border border-orange-300 text-orange-700 px-4 py-2 rounded-lg mb-4 text-sm font-medium">
                    <i className="fas fa-fire"></i> Bắt đầu chuỗi ngày học
                </div>
                <p className="text-xs text-gray-600 mb-4">Hoàn thành: {totalCompletedLessons}/{totalAllLessons} bài học</p>

                {/* List Sections */}
                {course.sections.map((section, index) => (
                    <CourseSection
                        key={section.title || index}
                        section={section}
                        currentVideoId={currentPlayingVideo.videoId}
                        onLessonClick={handleLessonClick}
                    />
                ))}
            </div>
        </div>
    );
}