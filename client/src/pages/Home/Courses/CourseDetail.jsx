import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Users,
  Clock,
  Play,
  Lock,
  CheckCircle,
  Download,
  Heart,
  Share2,
  BookOpen,
  Award,
  Target,
  Users2,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useCourseBySlug, useCourses } from "../../../hooks/useCourseQueries";
import * as orderService from "../../../services/user/orderService";
import * as freeCourseService from "../../../services/user/freeCourseService";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { formatPrice, formatDuration } from "../../../utils/format";
import "react-toastify/dist/ReactToastify.css";

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Sử dụng TanStack Query để fetch course by slug
  const {
    data: course,
    isLoading: loading,
    error: courseError
  } = useCourseBySlug(slug);

  // Fetch related courses
  const { data: allCourses = [] } = useCourses({ status: "published" });

  // Filter related courses based on category
  const relatedCourses = React.useMemo(() => {
    if (!course || !allCourses.length) return [];
    return allCourses
      .filter(c => c.slug !== slug && c.category === course.category)
      .slice(0, 4);
  }, [course, allCourses, slug]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Optimized CourseCard component with memoization
  const CourseCard = React.memo(({ course }) => {
    // Memoize gradientColors to prevent recreation on every render
    const gradientColors = useMemo(() => [
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
    ], []);
    const labelToUse = course.label || course.title;
    const labelLines = labelToUse
      .split("\n")
      .map((line, index) => <span key={index}>{line}</span>);

    const students = course.totalStudents || 0;
    const lessons = course.totalLessons || 0;
    const duration = course.duration || "N/A";
    const star = course?.averageRating;

    // Memoize getRandomGradient function
    const getRandomGradient = useCallback(() => {
      return gradientColors[Math.floor(Math.random() * gradientColors.length)];
    }, [gradientColors]);

    const color = useMemo(() => {
      return course.color || getRandomGradient();
    }, [course.color]);

    return (
      <Link
        to={`/learn/${course.slug}`}
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
                {star?.toFixed(1) || "5.0"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

          {/* Stats section */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full mb-1">
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs text-gray-500">Học viên</span>
              <span className="font-semibold text-gray-700">
                {typeof students === "number"
                  ? students.toLocaleString("en-US")
                  : students}
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full mb-1">
                <PlayCircle className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-xs text-gray-500">Bài học</span>
              <span className="font-semibold text-gray-700">{lessons}</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-50 rounded-full mb-1">
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-xs text-gray-500">Thời lượng</span>
              <span className="font-semibold text-gray-700">{duration}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  });

  // Chuyển từ data fix cứng thành state
  const [reviews, setReview] = useState([
    {
      id: 1,
      userName: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      comment: "Khóa học rất hay, giảng viên giảng rất dễ hiểu",
      date: "30-11-2025",
    },
    {
      id: 2,
      userName: "Nguyễn Thị B",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 4,
      comment: "Nội dung đầy đủ, nhưng tốc độ còn nhanh",
      date: "28-11-2025",
    },
  ]);

  // State cho form nhập liệu
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  // State cho video player
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Optimized submit function with useCallback
  const handleSubmit = useCallback(() => {
    if (!userName || !comment || rating === 0) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const newReview = {
      id: Date.now(), // Use timestamp for unique ID
      userName,
      avatar: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70),
      rating,
      comment,
      date: new Date().toLocaleDateString("vi-VN"),
    };

    setReview(prev => [...prev, newReview]);
    setUserName("");
    setComment("");
    setRating(0);
    toast.success("Đánh giá của bạn đã được gửi!");
  }, [userName, comment, rating]);

  // Video player functions with speed control
  const handlePlayVideo = useCallback((videoUrl, title) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentVideoTitle(title);
    setIsVideoPlayerOpen(true);
    setPlaybackSpeed(1); // Reset speed to normal
  }, []);

  const handleCloseVideoPlayer = useCallback(() => {
    setIsVideoPlayerOpen(false);
    setCurrentVideoUrl("");
    setCurrentVideoTitle("");
    setPlaybackSpeed(1);
  }, []);

  const handleSpeedChange = useCallback((speed) => {
    setPlaybackSpeed(speed);
    const video = document.querySelector('.video-player video');
    if (video) {
      video.playbackRate = speed;
    }
  }, []);

  const handleSkip = useCallback((seconds) => {
    const video = document.querySelector('.video-player video');
    if (video) {
      video.currentTime += seconds;
    }
  }, []);

  // Check if user has purchased this course
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (user && course) {
        try {
          const hasPurchased = await orderService.checkPurchase(
            user?.userId,
            course._id
          );
          setIsPurchased(hasPurchased.purchased);
        } catch (error) {
          console.error("Error checking purchase status:", error);
        }
      }
    };

    checkPurchaseStatus();
  }, [user, course]);

  const handlePurchase = () => {
    if (!user) {
      // Redirect to login
      window.location.href = "/dang-nhap";
      return;
    }

    // Check if course is free
    if (freeCourseService.isFreeCourse(course)) {
      handleEnrollFreeCourse();
      return;
    }

    // Redirect to checkout for paid courses
    window.location.href = `/checkout?course=${course._id}`;
  };

  const handleEnrollFreeCourse = async () => {
    if (!user || !course) return;

    setIsEnrolling(true);
    try {
      const response = await freeCourseService.enrollFreeCourse(
        user.userId,
        course._id,
        course.title
      );

      if (response.success) {
        toast.success("Đăng ký khóa học thành công!");
        setIsPurchased(true);
        
        // Redirect to learning page after 1.5 seconds
        setTimeout(() => {
          window.location.href = `/learn/${course.slug}`;
        }, 1500);
      } else {
        toast.error(response.message || "Đăng ký khóa học thất bại");
      }
    } catch (error) {
      console.error("Error enrolling free course:", error);
      toast.error(
        error?.response?.data?.message || "Đã xảy ra lỗi khi đăng ký khóa học"
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    if (isPurchased) {
      window.location.href = `/learn/${course.slug}`;
    } else {
      handlePurchase();
    }
  };

  // Utility functions moved to utils/format.js to avoid duplication
  const getTotalLessons = () => {
    return (
      course?.modules?.reduce(
        (total, module) => total + module.lessons.length,
        0
      ) || 0
    );
  };

  const getPreviewLessons = () => {
    return (
      course?.modules?.flatMap((module) =>
        module.lessons.filter((lesson) => lesson.isFree)
      ) || []
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Khóa học không tồn tại
          </h2>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Video Player Modal */}
      {isVideoPlayerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={handleCloseVideoPlayer}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{currentVideoTitle}</h3>
              <button
                onClick={handleCloseVideoPlayer}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Đóng video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="video-player relative bg-black rounded-lg overflow-hidden">
                <video
                  className="w-full h-auto max-h-96"
                  controls
                  autoPlay
                  src={currentVideoUrl}
                  onLoadedData={(e) => {
                    e.target.playbackRate = playbackSpeed;
                  }}
                >
                  <source src={currentVideoUrl} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              </div>
              
              {/* Video Controls */}
              <div className="mt-4 flex items-center justify-between">
                {/* Speed Control */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Tốc độ:</span>
                  <div className="flex space-x-1">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-2 py-1 text-xs rounded ${
                          playbackSpeed === speed
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Skip Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSkip(-10)}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    aria-label="Tua lùi 10 giây"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                    </svg>
                    <span>-10s</span>
                  </button>
                  
                  <button
                    onClick={() => handleSkip(10)}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    aria-label="Tua tới 10 giây"
                  >
                    <span>+10s</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {course.category?.name || "Lập trình"}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {course.level === "beginner"
                    ? "Cơ bản"
                    : course.level === "intermediate"
                      ? "Trung bình"
                      : "Nâng cao"}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

              <p className="text-xl text-blue-100 mb-6">{course.description}</p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">
                    {course.rating?.toFixed(1) || "5.0"}
                  </span>
                  <span className="text-blue-200">
                    ({course.reviewCount || 0} đánh giá)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span className="text-lg">
                    {course.totalStudents || 0} học viên
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">
                    {formatDuration(course.totalDuration || 0)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={handleStartLearning}
                  disabled={isEnrolling}
                  aria-label={freeCourseService.isFreeCourse(course) || isPurchased ? "Bắt đầu học khóa học" : "Mua khóa học"}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {freeCourseService.isFreeCourse(course) || isPurchased
                        ? "Bắt đầu học"
                        : "Mua khóa học"}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  aria-label="Thêm khóa học vào danh sách yêu thích"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Yêu thích
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  aria-label="Chia sẻ khóa học"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src={course.thumbnail || "https://via.placeholder.com/600x400"}
                alt={`${course.title} - Ảnh minh họa khóa học`}
                className="w-full h-80 object-cover rounded-lg shadow-2xl"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              {[
                { id: "overview", label: "Tổng quan", icon: BookOpen },
                { id: "content", label: "Nội dung", icon: Play },
                { id: "reviews", label: "Đánh giá", icon: Star },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="flex-1"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* What You'll Learn */}
                {course.whatYouWillLearn &&
                  course.whatYouWillLearn.length > 0 && (
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold flex items-center">
                          <Target className="w-5 h-5 mr-2 text-green-600" />
                          Bạn sẽ học được gì
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {course.whatYouWillLearn.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-xl font-semibold flex items-center">
                        <Award className="w-5 h-5 mr-2 text-blue-600" />
                        Yêu cầu đầu vào
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Target Audience */}
                {course.targetAudience && course.targetAudience.length > 0 && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-xl font-semibold flex items-center">
                        <Users2 className="w-5 h-5 mr-2 text-purple-600" />
                        Phù hợp với
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.targetAudience.map((audience, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{audience}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "content" && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Nội dung khóa học</h3>
                  <p className="text-gray-600">
                    {course.totalLessons} bài học •{" "}
                    {formatDuration(course.totalDuration || 0)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules?.map((module, moduleIndex) => (
                      <div key={module._id} className="border rounded-lg">
                        <div className="p-4 bg-gray-50 border-b">
                          <h4 className="font-semibold text-gray-900">
                            {module.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {module.lessons.length} bài học
                          </p>
                        </div>
                        <div className="p-4 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson._id}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                              onClick={() => {
                                if (lesson.isFree || isPurchased) {
                                  // Mock video URL - trong thực tế sẽ lấy từ lesson.videoUrl
                                  const videoUrl = lesson.videoUrl || `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
                                  handlePlayVideo(videoUrl, lesson.title);
                                } else {
                                  toast.info("Vui lòng mua khóa học để xem bài học này");
                                }
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                {lesson.isFree ? (
                                  <Play className="w-4 h-4 text-green-600" />
                                ) : isPurchased ? (
                                  <Play className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="text-gray-900">
                                  {lesson.title}
                                </span>
                                {lesson.isFree && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Miễn phí
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  {formatDuration(lesson.videoDuration || 0, 'time')}
                                </span>
                                {lesson.resources &&
                                  lesson.resources.length > 0 && (
                                    <Download className="w-4 h-4 text-gray-400" />
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mục đánh giá */}
            {activeTab === "reviews" && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">
                    Đánh giá từ học viên
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">
                        {course.rating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      ({course.reviewCount || 0} đánh giá)
                    </span>
                  </div>
                </CardHeader>

                {/* Hiển thị đánh giá của học viên - Data fix cứng, chỉ hiện thị ở UI, không lưu vào BackEnd */}
                <CardContent>
                  {/* Add loading state for reviews */}
                  <div className="space-y-6">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Chưa có đánh giá nào</p>
                      </div>
                    ) : (
                      reviews.map((review) => {
                        return (
                          <div
                            key={review.id}
                            className="flex items-start space-x-4 border-b pb-4"
                          >
                            <img
                              src={review.avatar}
                              alt={review.userName}
                              className="w-12 h-12 rounded-full object-cover"
                            ></img>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">
                                  {" "}
                                  {review.userName}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {" "}
                                  {review.date}
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, index) => {
                                  return (
                                    <Star
                                      key={index}
                                      className={
                                        index < review.rating
                                          ? "w-4 h-4 fill-yellow-400 text-yellow-400"
                                          : "w-4 h-4 text-gray-300"
                                      }
                                    ></Star>
                                  );
                                })}
                              </div>
                              <p className="text-gray-700 mt-2">
                                {" "}
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>

                {/* UI người dùng nhập đánh giá */}
                <CardContent>
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold"> Đánh giá khóa học</h3>

                    {/* Input tên */}
                    <input
                      type="text"
                      placeholder="Tên của bạn"
                      className="w-full border p-3 rounded-lg"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />

                    {/* Input comment */}
                    <textarea
                      placeholder="Nhập đánh giá của bạn..."
                      className="w-full border p-3 rounded-lg"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    {/* Rating */}
                    <div className="flex space-x-2">
                      {[...Array(5)].map((_, index) => {
                        return (
                          <Star
                            key={index}
                            className={
                              index < rating ? "w-5 h-5 cursor-pointer text-yellow-400 fill-yellow-400" : "w-5 h-5 cursor-pointer text-gray-300"
                            }
                            onClick={() => setRating(index + 1)}
                          />
                        );
                      })}
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Gửi đánh giá
                    </button>

                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="top-8">
              <CardContent className="p-6">
                {!isPurchased && (
                  <>
                    <div className="text-center mb-4">
                      {course.salePrice === 0 || course.salePrice === undefined || course.salePrice === null ? (
                        <div className="text-3xl font-bold text-red-600">
                          Miễn phí
                          {course.price && course.price > 0 ? (
                            <>
                              <div className="text-lg text-gray-500 line-through">
                                {formatPrice(course.price)}
                              </div>
                            </>
                          ) : null}
                        </div>
                      ) : course.salePrice && course.salePrice > 0 &&
                        course.salePrice < course.price ? (
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-red-600">
                            {formatPrice(course.salePrice)}
                          </div>
                          <div className="text-lg text-gray-500 line-through">
                            {formatPrice(course.price)}
                          </div>
                          <Badge className="bg-red-100 text-red-800">
                            Tiết kiệm{" "}
                            {Math.round(
                              ((course.price - course.salePrice) /
                                course.price) *
                              100
                            )}
                            %
                          </Badge>
                        </div>
                      ) : null}
                    </div>
                  </>
                )}

                <Button
                  className="w-full mb-4"
                  size="lg"
                  onClick={handleStartLearning}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {freeCourseService.isFreeCourse(course) ||
                      isPurchased
                        ? "Bắt đầu học"
                        : "Mua khóa học"}
                    </>
                  )}
                </Button>

                {!isPurchased && (
                  <>
                    <div className="text-center text-sm text-gray-600 mb-4">
                      Hoặc
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mb-4"
                      onClick={() =>
                      (window.location.href =
                        "/checkout?course=" + course._id)
                      }
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </>
                )}

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Truy cập trọn đời</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Chứng chỉ hoàn thành</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hỗ trợ 24/7</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cập nhật miễn phí</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Giảng viên</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <img
                    src={course.instructorId?.image || 'https://i.pravatar.cc'}
                    alt={`${course.instructorId?.fullName || 'Giảng viên'} - Ảnh đại diện`}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                    loading="lazy"
                  />
                  <h4 className="font-semibold text-lg">{course.instructorId?.fullName}</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Fullstack Developer & Instructor
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">50+</div>
                      <div className="text-gray-600">Khóa học</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">10K+</div>
                      <div className="text-gray-600">Học viên</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <h1 className="w-full text-center text-[30px] font-bold text-gray-900 py-8">Khóa học liên quan</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
