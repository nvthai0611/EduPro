import  { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { toast } from 'react-toastify';
import SubmitApprovalModal from '../../../components/Course/SubmitApprovalModal';
import AdminNoteModal from '../../../components/Course/AdminNoteModal';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  Star,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Info,
  CheckSquare,
  AlertCircle,
  UserCheck,
  Layers,
  Loader2
} from 'lucide-react';
// import { courseService } from '../../../services/admin/courseService';
import { 
  useCreateCourse, 
  useUpdateCourse, 
  useDeleteCourse,
  useSubmitCourseForReview, 
  useAdminCourses
} from '../../../hooks/useCourseQueries';

const CourseManagement = () => {
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAdminNoteModal, setShowAdminNoteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: 'frontend',
    level: 'beginner',
    price: 0,
    status: 'draft'
  });
  const [activeTab, setActiveTab] = useState('basic');

  // Build filters object for React Query
  const filters = useMemo(() => ({
    search: searchTerm,
    status: statusFilter === 'all' ? '' : statusFilter,
    level: levelFilter === 'all' ? '' : levelFilter,
  }), [searchTerm, statusFilter, levelFilter]);

  // React Query hooks
  const { data: courses = [], isLoading: loading, error } = useAdminCourses(filters, {
    select: (data) => {
      if (!Array.isArray(data)) return [];
      
      // Debug: Log raw data from backend
      console.log('Raw courses data from backend:', data.slice(0, 2));
      
      // Filter out invalid courses and add default status
      return data
        .filter(course => course && course._id)
        .map(course => {
          // console.log('Course status:', course.title, '- Status:', course.status);
          return {
            ...course,
            status: course.status // Default to draft if status is missing
          };
        });
    }
  });
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const submitForReviewMutation = useSubmitCourseForReview();

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { label: "Đã xuất bản", className: "bg-green-100 text-green-800" },
      draft: { label: "Bản nháp", className: "bg-gray-100 text-gray-800" },
      pending: { label: "Đang chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Đã duyệt", className: "bg-blue-100 text-blue-800" },
      rejected: { label: "Bị từ chối", className: "bg-red-100 text-red-800" },
    };
    
    // Return draft as default if status is undefined/null or not found
    return statusConfig[status] || statusConfig.draft;
  };


  const handleCreateCourse = async () => {
    createCourseMutation.mutate(newCourse, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setNewCourse({
          title: '',
          description: '',
          thumbnail: '',
          category: 'frontend',
          level: 'beginner',
          price: 0,
          status: 'draft'
        });
      }
    });
  };

  const handleToggleDelete = async (course) => {
    const isDeleted = course?.isDeleted ? false : true;
    const updatedCourse = { ...course, isDeleted: isDeleted };
    
    updateCourseMutation.mutate({ 
      id: course._id, 
      data: updatedCourse 
    });
  };

  const handleEditCourse = async () => {
    updateCourseMutation.mutate({
      id: selectedCourse._id,
      data: selectedCourse
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedCourse(null);
      }
    });
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      deleteCourseMutation.mutate(courseId);
    }
  };

  const handleToggleStatus = async (course, newStatus) => {
    const updatedCourse = { ...course, status: newStatus };
    updateCourseMutation.mutate({ 
      id: course._id, 
      data: updatedCourse 
    });
  };

  const handleSubmitForApproval = async (approvalMessage) => {
    submitForReviewMutation.mutate({
      id: selectedCourse._id,
      approvalMessage
    }, {
      onSuccess: () => {
        setShowSubmitModal(false);
        setSelectedCourse(null);
      },
      onError: (error) => {
        // Error already handled in mutation
        throw error;
      }
    });
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

    const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...(selectedCourse[field] || [])];
    newArray[index] = value;
    setSelectedCourse(prev => ({ ...prev, [field]: newArray }));
  };

  const handleAddArrayField = (field) => {
    const newArray = [...(selectedCourse[field] || []), ''];
    setSelectedCourse(prev => ({ ...prev, [field]: newArray }));
  };

  const handleRemoveArrayField = (field, index) => {
    const newArray = [...(selectedCourse[field] || [])];
    newArray.splice(index, 1);
    setSelectedCourse(prev => ({ ...prev, [field]: newArray }));
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {courses.filter(c => c?.status === "published").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
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
        </Card> */}

        {/* <Card>
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
        </Card> */}
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
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="pending">Đang chờ duyệt</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
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
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Đang tải khóa học...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
              <p className="text-gray-600 mb-4">Có lỗi xảy ra khi tải khóa học</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BookOpen className="w-10 h-10 text-gray-400 mb-4" />
              <p className="text-gray-600">Không có khóa học nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Khóa học</th>
                    <th className="text-left p-4">Cấp độ</th>
                    <th className="text-left p-4">Giá gốc</th>
                    <th className="text-left p-4">Giá khuyến mãi</th>
                    <th className="text-left p-4">Học viên</th>
                    <th className="text-left p-4">Đánh giá</th>
                    <th className="text-left p-4">Trạng thái</th>
                    <th className="text-left p-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => {
                    // Ensure course has status field
                    const courseStatus = course?.status || 'draft';
                    
                    return (
                    <tr key={course._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={course?.thumbnail || 'https://via.placeholder.com/60x40'}
                            alt={course?.title || 'Course'}
                            className="w-15 h-10 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{course?.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {course?.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {course?.level === 'beginner' ? 'Cơ bản' :
                            course?.level === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">
                          {formatPrice(course?.price)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">
                          {formatPrice(course?.salePrice ? course.salePrice : 0)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{course?.totalStudents || 0}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course?.rating?.toFixed(1) || '5.0'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusBadge(courseStatus).className}>
                          {getStatusBadge(courseStatus).label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/courses/${course?.slug}/builder`)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Xây dựng nội dung"
                          >
                            <Layers className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Xem khóa học như học viên"
                            onClick={() => window.open(`/learn/${course?.slug}`, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {courseStatus !== 'pending' && (
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
                          )}
                          {courseStatus === 'draft' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setShowSubmitModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Submit
                              </Button>
                              
                            </>
                          )}
                          {courseStatus === 'approved' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(course, 'published')}
                              >
                                Xuất bản
                              </Button>)}
                          {courseStatus === 'published' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleDelete(course)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Xóa
                            </Button>
                          )}
                          {(courseStatus === 'approved' || courseStatus === 'rejected') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowAdminNoteModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-700"
                              title="Xem phản hồi admin"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          )}
                          {/* {course?.status !== 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCourse(course?._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )} */}
                        </div>
                      </td>
                    </tr>
                  )})}
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
            <DialogDescription>
              Điền thông tin để tạo khóa học mới trong hệ thống
            </DialogDescription>
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
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={newCourse.category}
                onValueChange={(value) => setNewCourse(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                </SelectContent>
              </Select>
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
                  checked={newCourse.status === 'published'}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, status: e.target.checked ? 'published' : 'draft' }))}
                />
                <span>Xuất bản ngay</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleCreateCourse}
              disabled={createCourseMutation.isPending}
            >
              {createCourseMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo khóa học'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog - IMPROVED VERSION */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Chỉnh sửa khóa học</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin khóa học của bạn
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 px-6">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Cơ bản
                </TabsTrigger>
                <TabsTrigger value="learning" className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Học được gì
                </TabsTrigger>
                <TabsTrigger value="requirements" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Yêu cầu
                </TabsTrigger>
                <TabsTrigger value="audience" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Đối tượng
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(85vh-220px)] px-6">
                {/* Tab 1: Basic Information */}
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="edit-title">Tên khóa học *</Label>
                    <Input
                      id="edit-title"
                      value={selectedCourse.title}
                      onChange={(e) => setSelectedCourse(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Nhập tên khóa học"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-description">Mô tả *</Label>
                    <Textarea
                      id="edit-description"
                      value={selectedCourse.description}
                      onChange={(e) => setSelectedCourse(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Nhập mô tả khóa học"
                      rows={4}
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
                    {selectedCourse.thumbnail && (
                      <div className="mt-2">
                        <img 
                          src={selectedCourse.thumbnail} 
                          alt="Preview" 
                          className="w-40 h-24 object-cover rounded border"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/160x96'}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-category">Danh mục</Label>
                      <Select
                        value={selectedCourse.category}
                        onValueChange={(value) => setSelectedCourse(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frontend">Frontend</SelectItem>
                          <SelectItem value="backend">Backend</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="devops">DevOps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-price">Giá (VNĐ) *</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        value={selectedCourse.price}
                        onChange={(e) => setSelectedCourse(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-sale-price">Giá khuyến mãi (VNĐ)</Label>
                      <Input
                        id="edit-sale-price"
                        type="number"
                        value={selectedCourse.salePrice || ''}
                        onChange={(e) => setSelectedCourse(prev => ({ ...prev, salePrice: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: What You Will Learn */}
                <TabsContent value="learning" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Bạn sẽ học được gì</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Liệt kê những kiến thức và kỹ năng học viên sẽ đạt được
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArrayField('whatYouWillLearn')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm mục
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {(selectedCourse.whatYouWillLearn || []).map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            value={item}
                            onChange={(e) => handleArrayFieldChange('whatYouWillLearn', index, e.target.value)}
                            placeholder="Ví dụ: Hiểu rõ về React hooks và cách sử dụng"
                            className="w-full"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveArrayField('whatYouWillLearn', index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(!selectedCourse.whatYouWillLearn || selectedCourse.whatYouWillLearn.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <CheckSquare className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Chưa có nội dung. Click `Thêm mục` để bắt đầu.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Tab 3: Requirements */}
                <TabsContent value="requirements" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Yêu cầu đầu vào</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Kiến thức cần thiết trước khi bắt đầu khóa học
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArrayField('requirements')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm mục
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {(selectedCourse.requirements || []).map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            value={item}
                            onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                            placeholder="Ví dụ: Kiến thức HTML/CSS cơ bản"
                            className="w-full"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveArrayField('requirements', index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(!selectedCourse.requirements || selectedCourse.requirements.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Chưa có yêu cầu. Click "Thêm mục" để bắt đầu.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Tab 4: Target Audience */}
                <TabsContent value="audience" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Khóa học dành cho</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Đối tượng phù hợp với khóa học này
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArrayField('targetAudience')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm mục
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {(selectedCourse.targetAudience || []).map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            value={item}
                            onChange={(e) => handleArrayFieldChange('targetAudience', index, e.target.value)}
                            placeholder="Ví dụ: Sinh viên mới bắt đầu học lập trình web"
                            className="w-full"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveArrayField('targetAudience', index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(!selectedCourse.targetAudience || selectedCourse.targetAudience.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <UserCheck className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Chưa có đối tượng. Click "Thêm mục" để bắt đầu.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </ScrollArea>

              <DialogFooter className="px-6 pb-6 pt-4 border-t">
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowEditDialog(false);
                      setActiveTab('basic');
                    }}
                  >
                    Hủy
                  </Button>
                  <Button onClick={handleEditCourse} disabled={updateCourseMutation.isPending}>
                    {updateCourseMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Cập nhật khóa học
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Submit Approval Modal */}
      <SubmitApprovalModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          setSelectedCourse(null);
        }}
        onSubmit={handleSubmitForApproval}
        courseTitle={selectedCourse?.title}
      />

      {/* Admin Note Modal */}
      <AdminNoteModal
        isOpen={showAdminNoteModal}
        onClose={() => {
          setShowAdminNoteModal(false);
          setSelectedCourse(null);
        }}
        courseTitle={selectedCourse?.title}
        status={selectedCourse?.status}
        adminNote={selectedCourse?.adminNote}
        approvalMessage={selectedCourse?.approvalMessage}
        reviewedAt={selectedCourse?.reviewAt}
      />
    </div>
  );
};

export default CourseManagement;
