import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  Users, 
  Star,
  Clock,
  DollarSign,
  BookOpen,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import { courseService } from '../../../services/courseService';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    level: 'beginner',
    price: 0,
    isPremium: false,
    isPublished: false
  });

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, statusFilter, levelFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
        level: levelFilter === 'all' ? '' : levelFilter,
      };
      const response = await courseService.getCourses(params);
      console.log('Courses fetched:', response);
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const response = await courseService.createCourse(newCourse);
      setCourses(prev => [response.data, ...prev]);
      setShowCreateDialog(false);
      setNewCourse({
        title: '',
        description: '',
        thumbnail: '',
        category: '',
        level: 'beginner',
        price: 0,
        isPremium: false,
        isPublished: false
      });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleEditCourse = async () => {
    try {
      const response = await courseService.updateCourse(selectedCourse._id, selectedCourse);
      setCourses(prev => prev.map(course => 
        course._id === selectedCourse._id ? response.data : course
      ));
      setShowEditDialog(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await courseService.deleteCourse(courseId);
        setCourses(prev => prev.filter(course => course._id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleToggleStatus = async (course) => {
    try {
      const updatedCourse = { ...course, isPublished: !course.isPublished };
      const response = await courseService.updateCourse(course._id, updatedCourse);
      setCourses(prev => prev.map(c => 
        c._id === course._id ? response.data : c
      ));
    } catch (error) {
      console.error('Error updating course status:', error);
    }
  };

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-600 mt-2">Quản lý tất cả các khóa học trong hệ thống</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo khóa học mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng khóa học</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.isPublished).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(courses.reduce((sum, c) => sum + (c.price * (c.totalStudents || 0)), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Cấp độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp độ</SelectItem>
                <SelectItem value="beginner">Cơ bản</SelectItem>
                <SelectItem value="intermediate">Trung bình</SelectItem>
                <SelectItem value="advanced">Nâng cao</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setLevelFilter('all');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Danh sách khóa học</h3>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Khóa học</th>
                    <th className="text-left p-4">Cấp độ</th>
                    <th className="text-left p-4">Giá</th>
                    <th className="text-left p-4">Học viên</th>
                    <th className="text-left p-4">Đánh giá</th>
                    <th className="text-left p-4">Trạng thái</th>
                    <th className="text-left p-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={course.thumbnail || 'https://via.placeholder.com/60x40'}
                            alt={course.title}
                            className="w-15 h-10 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{course.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {course.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {/* <Badge variant="outline">
                          {course.level === 'beginner' ? 'Cơ bản' : 
                           course.level === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                        </Badge> */}
                      </td>
                      <td className="p-4">
                        <span className="font-medium">
                          {formatPrice(course.price)}
                        </span>
                      </td>
                      <td className="p-4">
                        {/* <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{course.totalStudents || 0}</span>
                        </div> */}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating?.toFixed(1) || '5.0'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={course.isPublished ? "default" : "secondary"}
                          className={course.isPublished ? "bg-green-100 text-green-800" : ""}
                        >
                          {course.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/courses/${course.slug}`, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(course)}
                          >
                            {course.isPublished ? 'Ẩn' : 'Xuất bản'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Course Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo khóa học mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Tên khóa học</Label>
              <Input
                id="title"
                value={newCourse.title}
                onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nhập tên khóa học"
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={newCourse.description}
                onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả khóa học"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="thumbnail">URL hình ảnh</Label>
              <Input
                id="thumbnail"
                value={newCourse.thumbnail}
                onChange={(e) => setNewCourse(prev => ({ ...prev, thumbnail: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level">Cấp độ</Label>
                <Select 
                  value={newCourse.level} 
                  onValueChange={(value) => setNewCourse(prev => ({ ...prev, level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Cơ bản</SelectItem>
                    <SelectItem value="intermediate">Trung bình</SelectItem>
                    <SelectItem value="advanced">Nâng cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Giá (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newCourse.isPremium}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, isPremium: e.target.checked }))}
                />
                <span>Khóa học Premium</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newCourse.isPublished}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, isPublished: e.target.checked }))}
                />
                <span>Xuất bản ngay</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateCourse}>
              Tạo khóa học
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khóa học</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Tên khóa học</Label>
                <Input
                  id="edit-title"
                  value={selectedCourse.title}
                  onChange={(e) => setSelectedCourse(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nhập tên khóa học"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  value={selectedCourse.description}
                  onChange={(e) => setSelectedCourse(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Nhập mô tả khóa học"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-thumbnail">URL hình ảnh</Label>
                <Input
                  id="edit-thumbnail"
                  value={selectedCourse.thumbnail}
                  onChange={(e) => setSelectedCourse(prev => ({ ...prev, thumbnail: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-level">Cấp độ</Label>
                  <Select 
                    value={selectedCourse.level} 
                    onValueChange={(value) => setSelectedCourse(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Cơ bản</SelectItem>
                      <SelectItem value="intermediate">Trung bình</SelectItem>
                      <SelectItem value="advanced">Nâng cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-price">Giá (VNĐ)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedCourse.price}
                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCourse.isPremium}
                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, isPremium: e.target.checked }))}
                  />
                  <span>Khóa học Premium</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCourse.isPublished}
                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, isPublished: e.target.checked }))}
                  />
                  <span>Xuất bản</span>
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditCourse}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
