
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  Award,
  Database,
  Globe,
  Smartphone,
  Zap,
  // Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import SkillsSection from './SkillsSection';
import LearningRoadmap from './LearningRoadmap';
// import { toast } from 'react-toastify';
import { useHomeData } from '../../hooks/useHomeQueries';
import { useOptimizedAuth } from '../../hooks/useOptimizedAuth';
import { HomePageSkeleton, StatsSkeletonLoader, CategoriesSkeletonLoader, TestimonialsSkeletonLoader } from '../../components/LoadingSpinner/HomeSkeletonLoader';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  // const navigate = useNavigate();
  const { handleOAuthSuccess, handleOAuthError } = useOptimizedAuth();
  
  // Performance monitoring
  usePerformanceMonitor('Home Page');
  
  // Fetch all home data with TanStack Query
  const { stats, categories, testimonials, isLoading, isError, error } = useHomeData();
  
  // Icon mapping for categories
  const iconMap = useMemo(() => ({
    Globe,
    Database,
    Smartphone,
    Zap
  }), []);
  
  // Icon mapping for stats
  const statsIconMap = useMemo(() => ({
    BookOpen,
    Users,
    Clock,
    Award
  }), []);

  // Optimized OAuth redirect handling with immediate redirect
  useEffect(() => {
    const encodedAuth = searchParams.get("auth");
    const error = searchParams.get("error");

    if (error) {
      handleOAuthError(error);
      return;
    }

    // Xử lý auth param từ URL với tối ưu hóa
    if (encodedAuth) {
      handleOAuthSuccess(encodedAuth);
    }
  }, [searchParams, handleOAuthSuccess, handleOAuthError]);

  // Error handling component
  const ErrorState = ({ message, onRetry }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
          Thử lại
        </Button>
      </div>
    </div>
  );

  // Loading state with optimized skeleton UI
  if (isLoading) {
    return <HomePageSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorState 
        message={error?.message || "Không thể tải dữ liệu trang chủ"}
        onRetry={() => window.location.reload()}
      />
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
              Khám phá thế giới lập trình với các khóa học chất lượng cao EduPro.
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
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats?.data?.map((stat, index) => {
              const IconComponent = statsIconMap[stat.icon];
              return (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-center mb-4">
                    {IconComponent && (
                      <IconComponent className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 group-hover:text-gray-700 transition-colors">
                    {stat.label}
                  </div>
                </div>
              );
            }) || (
              // Fallback loading state for stats
              <StatsSkeletonLoader />
            )}
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
            {categories?.data?.map((category, index) => {
              const IconComponent = iconMap[category.iconName];
              return (
                <Link to={`/courses/category/${category.slug}`} key={index}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {IconComponent && (
                          <IconComponent className="w-8 h-8" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        {category.count} khóa học
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            }) || (
              // Fallback loading state for categories  
              <CategoriesSkeletonLoader />
            )}
          </div>
        </div>
      </section>

      <SkillsSection />
      <LearningRoadmap />

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
            {testimonials?.data?.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 bg-white object-cover ring-2 ring-white/20"
                      loading="lazy"
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
                  <p className="text-blue-100 italic leading-relaxed">
                    {/* "{testimonial.content}" */}
                  </p>
                </CardContent>
              </Card>
            )) || (
              // Fallback loading state for testimonials
              <TestimonialsSkeletonLoader />
            )}
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
                onClick={() => window.location.href = '/dang-nhap'}
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
