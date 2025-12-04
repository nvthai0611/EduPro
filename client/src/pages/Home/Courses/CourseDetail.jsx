import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { courseService } from "../../../services/courseService";
import * as orderService from "../../../services/user/orderService";
import { Link, useParams } from "react-router-dom";

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [relatedCourses, setRelatedCourses] = useState([]);

  useEffect(() => {
    fetchRelatedCourse();
  }, [slug, course]);

  const fetchRelatedCourse = async () => {
    try {

      const response = await courseService.getCourses();
      const related = response.data.filter(c => c.slug !== slug && c.category === course?.category);
      setRelatedCourses(related.slice(0, 4)); // Lấy tối đa 4 khóa học liên quan

    } catch (error) {
      console.error("Error fetching course detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // Component Course Card
  const CourseCard = ({ course }) => {
    const labelToUse = course.title;
    const labelLines = labelToUse
      .split("\n")
      .map((line, index) => <span key={index}>{line}</span>);

    const students = course?.totalStudents || 0;
    const lessons = course?.totalLessons || 0;
    const duration = course?.duration || "N/A";
    const star = course?.averageRating;
    const color = course.color || "from-gray-300 to-gray-500";

    return (
      <Link
        to={`/courses/${course.slug}`}
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
            <p className="text-orange-500 font-medium">{formatPrice(course.salePrice ? course.salePrice : course.price)}</p>
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

  // Submit function
  const handleSubmit = () => {
    if (!userName || !comment || rating === 0) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      userName,
      avatar: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70),
      rating,
      comment,
      date: new Date().toLocaleDateString("vi-VN"),
    };

    setReview([...reviews, newReview]);
    setUserName("");
    setComment("");
    setRating(0);
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [slug, user]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourseBySlug(slug);
      // Server trả về { success: true, data: course }
      setCourse(response.data);

      // Check if user has purchased this course
      if (user) {
        const hasPurchased = await orderService.checkPurchase(
          user?.userId,
          response.data._id
        );
        setIsPurchased(hasPurchased.purchased);
      }
    } catch (error) {
      console.error("Error fetching course detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      // Redirect to login
      window.location.href = "/dang-nhap";
      return;
    }

    // Redirect to checkout
    window.location.href = `/checkout?course=${course._id}`;
  };

  const handleStartLearning = () => {
    if (isPurchased) {
      window.location.href = `/courses/learn/${course.slug}`;
    } else {
      handlePurchase();
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`;
    }
    return `${mins} phút`;
  };

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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                >
                  <Play className="w-5 h-5 mr-2" />
                  {course.price === 0 || isPurchased
                    ? "Bắt đầu học"
                    : "Mua khóa học"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Yêu thích
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src={course.thumbnail || "https://via.placeholder.com/600x400"}
                alt={course.title}
                className="w-full h-80 object-cover rounded-lg shadow-2xl"
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
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
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
                                  {Math.floor(lesson.videoDuration / 60)}:
                                  {(lesson.videoDuration % 60)
                                    .toString()
                                    .padStart(2, "0")}
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
                  {/* Hiển thị đánh giá của học viên */}
                  <div className="space-y-6">
                    {reviews.map((review) => {
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
                    })}
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
                      {course.salePrice > 0 &&
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
                      ) : (
                        <div className="text-3xl font-bold text-blue-600">
                          {formatPrice(course.price || 0)}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Button
                  className="w-full mb-4"
                  size="lg"
                  onClick={handleStartLearning}
                >
                  
                  <Play className="w-5 h-5 mr-2" />
                  {course.price === 0 ||
                    course.price === undefined ||
                    isPurchased
                    ? "Bắt đầu học"
                    : "Mua khóa học"}
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
                    alt="Hoàng An IT"
                    className="w-20 h-20 rounded-full mx-auto mb-4"
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

        <div className="flex flex-wrap gap-6 mt-12 justify-between">
          <h1 className="w-full text-center text-2xl font-bold text-gray-900">Khóa học liên quan</h1>
          {relatedCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
