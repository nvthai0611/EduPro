import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ProCourseSection - Section for paid courses with F8 style layout
 */
const ProCourseSection = ({ courses = [], isLoading = false }) => {
  const formatPrice = (price) => {
    if (!price || price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getGradientClass = (index) => {
    const gradients = [
      'from-blue-600 to-blue-800',
      'from-yellow-400 to-orange-500', 
      'from-pink-500 to-pink-700',
      'from-green-500 to-green-700',
      'from-purple-600 to-purple-800',
      'from-red-500 to-red-700'
    ];
    return `bg-gradient-to-br ${gradients[index % gradients.length]}`;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
            <Badge className="bg-blue-600 text-white animate-pulse">PRO</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Khóa học Pro
            <Badge className="bg-blue-600 text-white">PRO</Badge>
          </h2>
        </div>

        {/* Pro Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course, index) => (
            <Link to={`/courses/${course.slug}`} key={course._id || index}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden h-full hover:-translate-y-1">
                {/* Course Header with Gradient */}
                <div className={`${getGradientClass(index)} text-white p-6 relative h-48`}>
                  <Badge className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 font-semibold">
                    PRO
                  </Badge>
                  
                  <div className="flex flex-col justify-center h-full text-center">
                    <h3 className="text-xl font-bold leading-tight mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-white/80">
                      Cho người mới bắt đầu
                    </p>
                  </div>
                </div>

                {/* Course Content */}
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {course.title}
                  </h4>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-red-500">
                      {formatPrice(course.price)}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.studentsCount?.toLocaleString() || '590'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <PlayCircle className="w-4 h-4" />
                      <span>{course.lessonsCount || '254'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration || '116h50p'}</span>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2 text-white">
                      <span className="text-xs font-semibold">SĐ</span>
                    </div>
                    <span>Sơn Đặng</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProCourseSection;