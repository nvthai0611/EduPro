import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, Star, Users, Clock } from 'lucide-react';
import CourseCard from '../../components/Course/CourseCard';
import { courseService } from '../../services/courseService';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [searchTerm, selectedCategory, selectedLevel, selectedPrice, sortBy]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        category: selectedCategory,
        level: selectedLevel,
        price: selectedPrice,
        sort: sortBy,
        page: 1,
        limit: 12
      };
      
      const response = await courseService.getAllCourses(params);
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await courseService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleViewDetail = (course) => {
    // Navigate to course detail page
    window.location.href = `/courses/${course.slug}`;
  };

  const handlePurchase = (course) => {
    if (course.price === 0) {
      // Free course - redirect to learning page
      window.location.href = `/learn/${course._id}`;
    } else {
      // Paid course - redirect to course detail for purchase
      window.location.href = `/courses/${course.slug}`;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Khóa học lập trình
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Học lập trình từ cơ bản đến nâng cao với các khóa học chất lượng cao từ Hoàng An IT
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả danh mục</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Level Filter */}
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Cấp độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả cấp độ</SelectItem>
                  <SelectItem value="beginner">Cơ bản</SelectItem>
                  <SelectItem value="intermediate">Trung bình</SelectItem>
                  <SelectItem value="advanced">Nâng cao</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger>
                  <SelectValue placeholder="Giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả giá</SelectItem>
                  <SelectItem value="free">Miễn phí</SelectItem>
                  <SelectItem value="paid">Trả phí</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort and View */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="popular">Phổ biến</SelectItem>
                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                    <SelectItem value="price-low">Giá thấp</SelectItem>
                    <SelectItem value="price-high">Giá cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hiển thị:</span>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {courses.length} khóa học được tìm thấy
            </h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <Star className="w-3 h-3 mr-1" />
                Chất lượng cao
              </Badge>
              <Badge variant="outline">
                <Users className="w-3 h-3 mr-1" />
                Hỗ trợ 24/7
              </Badge>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-4" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy khóa học nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {courses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                onViewDetail={handleViewDetail}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {courses.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Xem thêm khóa học
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
