import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Code,
  Database,
  Globe,
  Smartphone,
  Zap
} from 'lucide-react';
import CourseCard from '../../components/Course/CourseCard';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';

function Home() {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [featured, popular, free] = await Promise.all([
        courseService.getFeaturedCourses(),
        courseService.getPopularCourses(),
        courseService.getFreeCourses()
      ]);
      
      setFeaturedCourses(featured.data || []);
      setPopularCourses(popular.data || []);
      setFreeCourses(free.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (course) => {
    window.location.href = `/courses/${course.slug}`;
  };

  const handlePurchase = (course) => {
    if (course.price === 0) {
      window.location.href = `/learn/${course._id}`;
    } else {
      window.location.href = `/courses/${course.slug}`;
    }
  };

  const categories = [
    { name: 'Frontend', icon: Globe, color: 'bg-blue-500', count: 12 },
    { name: 'Backend', icon: Database, color: 'bg-green-500', count: 8 },
    { name: 'Mobile', icon: Smartphone, color: 'bg-purple-500', count: 6 },
    { name: 'DevOps', icon: Zap, color: 'bg-orange-500', count: 4 },
  ];

  const stats = [
    { label: 'Khóa học', value: '50+', icon: BookOpen },
    { label: 'Học viên', value: '10K+', icon: Users },
    { label: 'Giờ học', value: '500+', icon: Clock },
    { label: 'Chứng chỉ', value: '5K+', icon: Award },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'Frontend Developer',
      content: 'Khóa học React của Hoàng An IT rất chi tiết và dễ hiểu. Tôi đã có thể tự tin apply vào các công ty lớn.',
      rating: 5,
      avatar: 'https://via.placeholder.com/60x60'
    },
    {
      name: 'Trần Thị B',
      role: 'Fullstack Developer',
      content: 'Hệ thống học tập rất tốt, video chất lượng cao và có hỗ trợ 24/7. Rất đáng để đầu tư!',
      rating: 5,
      avatar: 'https://via.placeholder.com/60x60'
    },
    {
      name: 'Lê Văn C',
      role: 'Mobile Developer',
      content: 'Sau khi học khóa Flutter, tôi đã có thể tự phát triển ứng dụng mobile và kiếm được thu nhập tốt.',
      rating: 5,
      avatar: 'https://via.placeholder.com/60x60'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Học Lập Trình Từ Cơ Bản Đến Nâng Cao
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Khám phá thế giới lập trình với các khóa học chất lượng cao từ Hoàng An IT. 
              Từ Frontend đến Backend, từ Web đến Mobile - chúng tôi có tất cả!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
                onClick={() => window.location.href = '/courses'}
              >
                <Play className="w-5 h-5 mr-2" />
                Bắt đầu học ngay
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 px-8 py-3"
                onClick={() => window.location.href = '/courses?price=free'}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Khóa học miễn phí
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Khám phá theo chuyên môn
            </h2>
            <p className="text-lg text-gray-600">
              Chọn lĩnh vực phù hợp với mục tiêu nghề nghiệp của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.count} khóa học
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Khóa học nổi bật
              </h2>
              <p className="text-lg text-gray-600">
                Những khóa học được đánh giá cao nhất
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/courses?sort=featured'}
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map(course => (
              <CourseCard
                key={course._id}
                course={course}
                onViewDetail={handleViewDetail}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Khóa học phổ biến
              </h2>
              <p className="text-lg text-gray-600">
                Được nhiều học viên lựa chọn nhất
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/courses?sort=popular'}
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.slice(0, 6).map(course => (
              <CourseCard
                key={course._id}
                course={course}
                onViewDetail={handleViewDetail}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Free Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Khóa học miễn phí
              </h2>
              <p className="text-lg text-gray-600">
                Bắt đầu hành trình học tập của bạn ngay hôm nay
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/courses?price=free'}
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeCourses.slice(0, 6).map(course => (
              <CourseCard
                key={course._id}
                course={course}
                onViewDetail={handleViewDetail}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Học viên nói gì về chúng tôi
            </h2>
            <p className="text-xl text-blue-100">
              Hàng nghìn học viên đã thành công với các khóa học của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-blue-200 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-blue-100 italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn học viên đang học tập và phát triển kỹ năng lập trình
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
              onClick={() => window.location.href = '/courses'}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Khám phá khóa học
            </Button>
            {!user && (
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3"
                onClick={() => window.location.href = '/dang-ky'}
              >
                <Users className="w-5 h-5 mr-2" />
                Đăng ký miễn phí
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
