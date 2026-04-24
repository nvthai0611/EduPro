import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Clock,
  CheckCircle,
  BookOpen,
  Award,
  TrendingUp,
} from 'lucide-react';
import { getUserProfile } from '../../services/user/userService';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import SideBar from '../../pages/Home/components/SideBar';

const MyCourses = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('learning');
  const completedCourses = [];

  const {
    data: purchasedCourses = [],
    isLoading,
  } = useQuery({
    queryKey: ["my-courses", user?.userId],
    queryFn: async () => {
      const response = await getUserProfile(user?.userId || null);
      if (response.success && response.data) {
        return response.data.purchasedCourses || [];
      }
      return [];
    },
    enabled: !!user, // chỉ gọi khi đã có user
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });

  const handleContinueLearning = (course) => {
    // Redirect to learning page
    window.location.href = `/learn/${course.slug}`;
  };

  const handleViewCourse = (course) => {
    // Redirect to course detail
    window.location.href = `/courses/${course.slug}`;
  };

  console.log(purchasedCourses);
  

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // const getLearningCourses = async () => {
  //   // return courses.filter(course => course.progress < 100);
  // };

  // const getCompletedCourses = () => {
  //   return courses.filter(course => course.progress === 100);
  // };

  const CourseCard = ({ course }) => (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img
          src={course.courseId.thumbnail || 'https://via.placeholder.com/300x200'}
          alt={course.courseId.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-blue-600 text-white">
            Đang học
          </Badge>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleContinueLearning(course.courseId)}
          >
            <Play className="w-5 h-5 mr-2" />
            Tiếp tục học
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-2 h-[50px]">
              {course.courseId.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 h-[60px]">
              {course.courseId.description}
            </p>
          </div>

          {/* <ProgressBar
            progress={course.progress || 0}
            totalLessons={course.totalLessons || 0}
            completedLessons={course.completedLessons || 0}
            showDetails={false}
          /> */}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.courseId.totalDuration || 0)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.courseId.totalLessons || 0} bài</span>
              </div>
            </div>
            {/* <div className="text-xs text-gray-400">
              Cập nhật: {new Date(course.updatedAt).toLocaleDateString('vi-VN')}
            </div> */}
          </div>

          <div className="flex space-x-2">
            <Button
              className="flex-1"
              onClick={() => handleContinueLearning(course.courseId)}
            >
              <Play className="w-4 h-4 mr-2" />
              Tiếp tục học
            </Button>
            <Button
              variant="outline"
              onClick={() => handleViewCourse(course.courseId)}
            >
              Chi tiết
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex">

      <div className="lg:w-30 lg:p-4 lg:flex-shrink-0">
        <SideBar />
      </div>

      <div className="w-full p-3 mt-5">
        {/* Header */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Khóa học của tôi
              </h1>
              <p className="text-lg text-gray-600">
                Tiếp tục hành trình học tập của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {purchasedCourses.length}
                </div>
                <div className="text-sm text-gray-600">Tổng khóa học</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {purchasedCourses.length}
                </div>
                <div className="text-sm text-gray-600">Đang học</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {completedCourses.length}
                </div>
                <div className="text-sm text-gray-600">Đã hoàn thành</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {completedCourses.length}
                </div>
                <div className="text-sm text-gray-600">Chứng chỉ</div>
              </CardContent>
            </Card>
          </div>

          {/* Courses Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="learning">
                Đang học ({purchasedCourses.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Đã hoàn thành ({completedCourses.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learning">
              {purchasedCourses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có khóa học nào
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Hãy khám phá và đăng ký các khóa học để bắt đầu học tập
                  </p>
                  <Button onClick={() => window.location.href = '/courses'}>
                    Khám phá khóa học
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {purchasedCourses.map(course => (
                    <CourseCard key={course.courseId._id} course={course} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedCourses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Award className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa hoàn thành khóa học nào
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tiếp tục học tập để nhận được chứng chỉ hoàn thành
                  </p>
                  <Button onClick={() => setActiveTab('learning')}>
                    Xem khóa học đang học
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {completedCourses.map(course => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
