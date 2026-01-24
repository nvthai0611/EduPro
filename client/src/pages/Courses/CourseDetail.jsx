import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Users,
  Clock,
  Play,
  CheckCircle,
  Heart,
  Share2,
  BookOpen,
  Award,
  Target,
  Users2,
  Loader2,
  Trash2,
  Pencil,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCourseBySlug, useSectionsWithMinimalLessons } from "../../hooks/useCourseQueries";
import * as orderService from "../../services/user/orderService";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { formatPrice, formatDuration } from "../../utils/format";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/user/userService";
import courseReviewService from "../../services/courseReviewService";
import CourseCurriculum from "./components/CourseCurriculum";

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [averageRating, setAverageRating] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const isAdmin = user && (user.role === 'admin');

  const navigate = useNavigate();

  // Sử dụng TanStack Query để fetch course by slug
  const {
    data: course,
    isLoading: loading,
  } = useCourseBySlug(slug);

  const courseId = course?._id;

  // Fetch minimal sections và lessons data (chỉ title, duration, type)
  const {
    data: sections = [],
    isLoading: sectionsLoading,
  } = useSectionsWithMinimalLessons(courseId, {
    enabled: !!courseId,
  });

  const { data: infoUser } = useQuery({
    queryKey: ["user-profile", user?.userId],
    queryFn: async () => {
      const res = await getUserProfile(user?.userId || null);
      return res.data;
    },
    enabled: !!user,
  });

  const {
    data: reviews = [],
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["reviews", slug],
    queryFn: async () => {
      return await courseReviewService.getReviewsByCourseSlug(slug);
    },
    enabled: !!slug,
  });

  const dataReview = reviews.find((r) => r.userId._id === infoUser?._id);

  // State cho form nhập liệu
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setAverageRating(Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length * 100) / 100);
  }, [reviews]);

  // Optimized submit function with useCallback
  const handleSubmit = async () => {

    if (dataReview) {
      if (!comment || rating === 0) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      const finalData = {
        courseId: course._id,
        rating,
        comment,
      };

      await courseReviewService.updateReview(dataReview._id, finalData);
    } else {
      if (!comment || rating === 0) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      const finalData = {
        courseId: course._id,
        rating,
        comment,
      };

      await courseReviewService.createReview(finalData);
    }

    setComment("");
    setRating(0);
    toast.success(dataReview ? "Chỉnh sửa đánh giá thành công" : "Đánh giá của bạn đã được gửi!");
    refetchReviews();
  };

  const handleDeleteReview = async (id) => {
    await courseReviewService.deleteReview(id);
    refetchReviews();
    toast.success("Đánh giá đã được xóa.");
  }

  const handleEditReview = (review) => {
    if (review) {
      setComment(review.comment);
      setRating(review.rating);
    }
  }

  function formatReviewTime(isoString) {
    if (!isoString) return "";

    const date = new Date(isoString);

    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Tính tổng số lessons và duration
  const totalLessons = sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0);
  const totalDuration = sections.reduce((acc, section) => {
    const sectionDuration = section.lessons?.reduce((sum, lesson) => {
      return sum + (lesson.videoDuration || lesson.readingTime * 60 || 0);
    }, 0) || 0;
    return acc + sectionDuration;
  }, 0);

  // Format duration helper
  const formatLessonDuration = (seconds) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };


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
      toast.error("Vui lòng đăng nhập");
      return;
    }

    // Redirect to checkout for paid courses
    navigate(`/checkout?course=${course._id}`);
  };

  const handleStartLearning = () => {
    if (isPurchased) {
      navigate(`/learn/${course.slug}`);
    } else {
      handlePurchase();
    }
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
    <div className="min-h-screen bg-gray-50 mt-[70px]">
      <ToastContainer position="top-right" autoClose={3000} />

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
                    {averageRating || "5.0"}
                  </span>
                  <span className="text-blue-200">
                    ({reviews.length || 0} đánh giá)
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
                    {formatDuration(totalDuration)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={handleStartLearning}
                  aria-label={isPurchased ? "Bắt đầu học khóa học" : "Mua khóa học"}
                >
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {isPurchased ? "Bắt đầu học" : "Mua khóa học"}
                  </>
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
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span>{sections.length} chương</span>
                    <span>•</span>
                    <span>{totalLessons} bài học</span>
                    <span>•</span>
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CourseCurriculum
                    sections={sections}
                    sectionsLoading={sectionsLoading}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                    formatLessonDuration={formatLessonDuration}
                  />
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
                        {averageRating || "5.0"}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      ({reviews.length || 0} đánh giá)
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
                            key={review._id}
                            className="flex items-start space-x-4 border-b pb-4"
                          >
                            <img
                              src={review.userId.image}
                              alt={review.userId.fullName}
                              className="w-12 h-12 rounded-full object-cover"
                            ></img>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900 leading-tight">
                                    {review.userId.fullName}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {formatReviewTime(review.createdAt)}
                                  </span>
                                </div>

                                {isAdmin && (
                                  <button
                                    onClick={() => handleDeleteReview(review._id)}
                                    className="
                                      flex items-center gap-1
                                      text-red-500 text-xs font-medium
                                      px-2 py-1 rounded-md
                                      hover:bg-red-50 hover:text-red-600
                                      transition
                                    "
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Xóa
                                  </button>
                                )}

                                {!isAdmin && dataReview?._id === review._id && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditReview(review)}
                                      className="
                                      flex items-center gap-1
                                      text-blue-500 text-xs font-medium
                                      px-2 py-1 rounded-md
                                      hover:bg-blue-50 hover:text-blue-600
                                      transition
                                    "
                                    >
                                      <Pencil className="w-4 h-4" />
                                      Sửa
                                    </button>

                                    <button
                                      onClick={() => handleDeleteReview(review._id)}
                                      className="
                                      flex items-center gap-1
                                      text-red-500 text-xs font-medium
                                      px-2 py-1 rounded-md
                                      hover:bg-red-50 hover:text-red-600
                                      transition
                                    "
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Xóa
                                    </button>
                                  </div>
                                )}
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

                {isPurchased && (
                  <>
                    {/* UI người dùng nhập đánh giá */}
                    <CardContent>
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold"> Đánh giá khóa học</h3>

                        {/* Input comment */}
                        <textarea
                          placeholder="Nhập đánh giá của bạn..."
                          className="w-full border p-3 rounded-lg transition hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
                  </>
                )}
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
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
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
                >
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {isPurchased ? "Bắt đầu học" : "Mua khóa học"}
                  </>
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
                        navigate(`/checkout?course=${course._id}`)
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
      </div>
    </div>
  );
};

export default CourseDetail;
