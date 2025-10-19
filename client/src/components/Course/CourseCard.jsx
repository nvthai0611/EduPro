import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  Lock,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, showPrice = true }) => {
  const {
    _id,
    title,
    description,
    thumbnail,
    price,
    originalPrice,
    duration,
    level,
    rating,
    studentsCount,
    isFree,
    isPurchased,
    modulesCount,
    lessonsCount,
    slug
  } = course;

  const discountPercentage = originalPrice && price < originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={thumbnail || 'https://via.placeholder.com/400x225'}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Button
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
            asChild
          >
            <Link to={`/courses/${slug || _id}`}>
              <Play className="w-4 h-4 mr-2" />
              Xem chi tiết
            </Link>
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isFree && (
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Miễn phí
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Level Badge */}
        {level && (
          <Badge className={`absolute top-3 right-3 ${getLevelColor(level)}`}>
            {level}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{modulesCount || 0} modules</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              <span>{lessonsCount || 0} bài</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(duration || 0)}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating?.toFixed(1) || '0.0'}</span>
            <span className="text-sm text-gray-500">({studentsCount || 0})</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {showPrice && (
              <div className="flex items-center gap-2">
                {originalPrice && price < originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(price)}
                </span>
              </div>
            )}
          </div>
          
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            asChild
          >
            <Link to={`/courses/${slug || _id}`}>
              {isPurchased ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Đã mua
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {isFree ? 'Học ngay' : 'Mua khóa học'}
                </>
              )}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;