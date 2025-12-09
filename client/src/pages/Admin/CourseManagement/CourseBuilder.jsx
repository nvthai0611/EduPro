import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  GripVertical,
  Play,
  FileText,
  Clock,
  Eye,
  Save,
  Film,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Video,
  Type,
  Loader2
} from 'lucide-react';
import {
  useCourseBySlug,
  useSectionsWithLessons,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useAddLessonToSection
} from '../../../hooks/useCourseQueries';

const CourseBuilder = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // TanStack Query hooks
  const { data: course, isLoading: courseLoading, error: courseError } = useCourseBySlug(slug, {
    onError: (error) => {
      // console.error('Error fetching course:', error);
      toast.error('Không thể tải dữ liệu khóa học');
      navigate('/admin/manager-courses');
    }
  });
  
  const courseId = course?._id;
  const { data: sections = [], isLoading: sectionsLoading } = useSectionsWithLessons(courseId);
  
  // Mutations
  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  const addLessonToSectionMutation = useAddLessonToSection();
  
  // State management
  const [expandedSections, setExpandedSections] = useState(new Set());
  
  // Dialog states
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [showEditSectionDialog, setShowEditSectionDialog] = useState(false);
  const [showAddLessonDialog, setShowAddLessonDialog] = useState(false);
  const [showEditLessonDialog, setShowEditLessonDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form states
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState({ type: null, id: null, name: null });
  
  const [sectionForm, setSectionForm] = useState({
    title: '',
    description: '',
    order: 1
  });
  
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    type: 'video',
    videoUrl: '',
    videoDuration: 0,
    content: '', // for article
    readingTime: 0, // for article
    isFree: false,
    order: 1
  });

  // Auto-expand first section when data loads
  React.useEffect(() => {
    if (sections.length > 0 && expandedSections.size === 0) {
      setExpandedSections(new Set([sections[0]._id]));
    }
  }, [sections, expandedSections]);

  // Section handlers
  const handleAddSection = async () => {
    if (!courseId) {
      toast.error('Không tìm thấy ID khóa học');
      return;
    }
    
    createSectionMutation.mutate(
      {
        ...sectionForm,
        courseId: courseId,
        order: sections.length + 1
      },
      {
        onSuccess: () => {
          setShowAddSectionDialog(false);
          setSectionForm({ title: '', description: '', order: 1 });
        }
      }
    );
  };

  const handleUpdateSection = async () => {
    updateSectionMutation.mutate(
      {
        id: selectedSection._id,
        data: sectionForm
      },
      {
        onSuccess: () => {
          setShowEditSectionDialog(false);
          setSelectedSection(null);
        }
      }
    );
  };

  // Lesson handlers
  const handleAddLesson = async () => {
    if (!courseId) {
      toast.error('Không tìm thấy ID khóa học');
      return;
    }
    
    // Create lesson first
    createLessonMutation.mutate(
      {
        ...lessonForm,
        courseId: courseId,
        sectionId: selectedSection._id,
        order: (selectedSection.lessons?.length || 0) + 1
      },
      {
        onSuccess: (newLesson) => {
          // Then add lesson to section
          addLessonToSectionMutation.mutate(
            {
              sectionId: selectedSection._id,
              lessonId: newLesson._id,
              courseId: courseId
            },
            {
              onSuccess: () => {
                setShowAddLessonDialog(false);
                setLessonForm({
                  title: '',
                  description: '',
                  type: 'video',
                  videoUrl: '',
                  videoDuration: 0,
                  content: '',
                  readingTime: 0,
                  isFree: false,
                  order: 1
                });
              }
            }
          );
        }
      }
    );
  };

  const handleUpdateLesson = async () => {
    updateLessonMutation.mutate(
      {
        id: selectedLesson._id,
        data: lessonForm
      },
      {
        onSuccess: () => {
          setShowEditLessonDialog(false);
          setSelectedLesson(null);
        }
      }
    );
  };

  const handleDelete = React.useCallback(() => {
    const resetDeleteState = () => {
      setShowDeleteDialog(false);
      setDeleteTarget({ type: null, id: null, name: null });
    };

    if (deleteTarget.type === 'section') {
      deleteSectionMutation.mutate(
        {
          id: deleteTarget.id,
          courseId: courseId
        },
        { onSuccess: resetDeleteState }
      );
    } else if (deleteTarget.type === 'lesson') {
      deleteLessonMutation.mutate(
        {
          id: deleteTarget.id,
          courseId: courseId,
          sectionId: selectedSection?._id
        },
        { onSuccess: resetDeleteState }
      );
    }
  }, [deleteTarget, courseId, selectedSection, deleteSectionMutation, deleteLessonMutation]);

  // Toggle section expand/collapse
  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Open dialogs
  const openEditSection = (section) => {
    setSelectedSection(section);
    setSectionForm({
      title: section.title,
      description: section.description || '',
      order: section.order
    });
    setShowEditSectionDialog(true);
  };

  const openAddLesson = (section) => {
    setSelectedSection(section);
    setShowAddLessonDialog(true);
  };

  const openEditLesson = (lesson, section) => {
    setSelectedLesson(lesson);
    setSelectedSection(section);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      type: lesson.type,
      videoUrl: lesson.videoUrl || '',
      videoDuration: lesson.videoDuration || 0,
      content: lesson.content || '',
      readingTime: lesson.readingTime || 0,
      isFree: lesson.isFree || false,
      order: lesson.order
    });
    setShowEditLessonDialog(true);
  };

  const openDeleteDialog = (type, id, name) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteDialog(true);
  };

  // Calculate statistics
  const totalSections = sections.length;
  const totalLessons = sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0);
  const totalDuration = sections.reduce((acc, section) => {
    const sectionDuration = section.lessons?.reduce((sum, lesson) => sum + (lesson.videoDuration || 0), 0) || 0;
    return acc + sectionDuration;
  }, 0);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Loading states
  const isLoading = courseLoading || sectionsLoading;
  const isMutating = createSectionMutation.isPending || 
                     updateSectionMutation.isPending || 
                     deleteSectionMutation.isPending ||
                     createLessonMutation.isPending || 
                     updateLessonMutation.isPending || 
                     deleteLessonMutation.isPending ||
                     addLessonToSectionMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-600">Đang tải dữ liệu khóa học...</p>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <AlertCircle className="w-12 h-12 text-red-600" />
        <p className="text-gray-600">Không thể tải khóa học</p>
        <Button onClick={() => navigate('/admin/manager-courses')}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/manager-courses')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course?.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="outline" className="font-normal">
                    {totalSections} chương
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    {totalLessons} bài học
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(totalDuration)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Nội dung khóa học</CardTitle>
                  <Button 
                    size="sm"
                    onClick={() => setShowAddSectionDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm chương
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {sections.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Chưa có nội dung
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Bắt đầu xây dựng khóa học bằng cách thêm chương đầu tiên
                    </p>
                    <Button onClick={() => setShowAddSectionDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm chương đầu tiên
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {sections.map((section, sectionIndex) => (
                      <div key={section._id} className="bg-white">
                        {/* Section Header */}
                        <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                          <button
                            className="p-1 hover:bg-gray-100 rounded cursor-move"
                            title="Kéo để sắp xếp"
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          
                          <button
                            onClick={() => toggleSection(section._id)}
                            className="flex-1 flex items-center gap-3 text-left"
                          >
                            {expandedSections.has(section._id) ? (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-500" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">
                                  Chương {sectionIndex + 1}: {section.title}
                                </span>
                                {section.isPublished && (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                <span>{section.lessons?.length || 0} bài học</span>
                                <span>•</span>
                                <span>
                                  {formatDuration(
                                    section.lessons?.reduce((sum, l) => sum + (l.videoDuration || 0), 0) || 0
                                  )}
                                </span>
                              </div>
                            </div>
                          </button>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditSection(section)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog('section', section._id, section.title)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>

                        {/* Lessons List */}
                        {expandedSections.has(section._id) && (
                          <div className="bg-gray-50 border-t">
                            {section.lessons && section.lessons.length > 0 ? (
                              <div className="divide-y divide-gray-200">
                                {section.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lesson._id}
                                    className="flex items-center gap-3 p-4 pl-16 hover:bg-white transition-colors"
                                  >
                                    <button className="p-1 hover:bg-gray-100 rounded cursor-move">
                                      <GripVertical className="w-4 h-4 text-gray-400" />
                                    </button>
                                    
                                    <div className="w-8 h-8 bg-white border rounded flex items-center justify-center">
                                      {lesson.type === 'video' ? (
                                        <Play className="w-4 h-4 text-blue-600" />
                                      ) : (
                                        <FileText className="w-4 h-4 text-gray-600" />
                                      )}
                                    </div>

                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                          {lessonIndex + 1}. {lesson.title}
                                        </span>
                                        {lesson.isFree && (
                                          <Badge variant="secondary" className="text-xs">
                                            Miễn phí
                                          </Badge>
                                        )}
                                        {lesson.isPublished && (
                                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatDuration(lesson.videoDuration || 0)}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditLesson(lesson, section)}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDeleteDialog('lesson', lesson._id, lesson.title)}
                                      >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            
                            {/* Add Lesson Button */}
                            <div className="p-4 pl-16">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => openAddLesson(section)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm bài học
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Course Info & Stats */}
          <div className="space-y-6">
            {/* Course Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trạng thái khóa học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạng thái</span>
                  <Badge variant={course?.status === 'published' ? 'default' : 'secondary'}>
                    {course?.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    {totalSections > 0 && totalLessons > 0 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Nội dung khóa học</p>
                      <p className="text-xs text-gray-500">
                        {totalSections > 0 && totalLessons > 0
                          ? 'Đã có nội dung'
                          : 'Cần thêm chương và bài học'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng số chương</span>
                  <span className="text-sm font-semibold">{totalSections}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng số bài học</span>
                  <span className="text-sm font-semibold">{totalLessons}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thời lượng</span>
                  <span className="text-sm font-semibold">{formatDuration(totalDuration)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowAddSectionDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm chương mới
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={sections.length === 0}
                >
                  <Film className="w-4 h-4 mr-2" />
                  Upload video hàng loạt
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Section Dialog */}
      <Dialog open={showAddSectionDialog} onOpenChange={setShowAddSectionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm chương mới</DialogTitle>
            <DialogDescription>
              Tạo chương mới cho khóa học của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section-title">Tiêu đề chương *</Label>
              <Input
                id="section-title"
                placeholder="VD: Giới thiệu về React"
                value={sectionForm.title}
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section-description">Mô tả</Label>
              <Textarea
                id="section-description"
                placeholder="Mô tả ngắn về nội dung chương này..."
                rows={3}
                value={sectionForm.description}
                onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSectionDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleAddSection} 
              disabled={!sectionForm.title || createSectionMutation.isPending}
            >
              {createSectionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                'Thêm chương'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={showEditSectionDialog} onOpenChange={setShowEditSectionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa chương</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-section-title">Tiêu đề chương *</Label>
              <Input
                id="edit-section-title"
                value={sectionForm.title}
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-section-description">Mô tả</Label>
              <Textarea
                id="edit-section-description"
                rows={3}
                value={sectionForm.description}
                onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditSectionDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateSection} 
              disabled={!sectionForm.title || updateSectionMutation.isPending}
            >
              {updateSectionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Lesson Dialog */}
      <Dialog open={showAddLessonDialog} onOpenChange={setShowAddLessonDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Thêm bài học mới</DialogTitle>
            <DialogDescription>
              Thêm bài học vào chương: {selectedSection?.title}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-4">
            <div className="space-y-5 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="lesson-title" className="flex items-center gap-2">
                  Tiêu đề bài học <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lesson-title"
                  placeholder="VD: JSX là gì?"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="text-base"
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="lesson-description">Mô tả ngắn</Label>
                <Textarea
                  id="lesson-description"
                  placeholder="Mô tả ngắn gọn về nội dung bài học..."
                  rows={2}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                />
              </div>

              {/* Lesson Type Selector */}
              <div className="space-y-3">
                <Label>Loại bài học <span className="text-red-500">*</span></Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setLessonForm({ ...lessonForm, type: 'video' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      lessonForm.type === 'video'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Video className={`w-6 h-6 mx-auto mb-2 ${
                      lessonForm.type === 'video' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-center">Video</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setLessonForm({ ...lessonForm, type: 'article' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      lessonForm.type === 'article'
                        ? 'border-green-500 bg-green-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <BookOpen className={`w-6 h-6 mx-auto mb-2 ${
                      lessonForm.type === 'article' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-center">Bài viết</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setLessonForm({ ...lessonForm, type: 'quiz' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      lessonForm.type === 'quiz'
                        ? 'border-purple-500 bg-purple-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <HelpCircle className={`w-6 h-6 mx-auto mb-2 ${
                      lessonForm.type === 'quiz' ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-center">Quiz</div>
                  </button>
                </div>
              </div>

              {/* Conditional Content Based on Type */}
              {lessonForm.type === 'video' && (
                <div className="space-y-4 p-4 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 font-medium">
                    <Video className="w-5 h-5" />
                    <span>Nội dung Video</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lesson-video">URL Video</Label>
                    <Input
                      id="lesson-video"
                      placeholder="https://youtube.com/watch?v=... hoặc https://vimeo.com/..."
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                      className="bg-white"
                    />
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      Tính năng upload video trực tiếp sẽ được bổ sung sau
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lesson-duration">Thời lượng video (phút)</Label>
                    <Input
                      id="lesson-duration"
                      type="number"
                      placeholder="15"
                      value={lessonForm.videoDuration / 60}
                      onChange={(e) => setLessonForm({ 
                        ...lessonForm, 
                        videoDuration: parseInt(e.target.value || 0) * 60 
                      })}
                      className="bg-white"
                    />
                  </div>
                </div>
              )}

              {lessonForm.type === 'article' && (
                <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    <BookOpen className="w-5 h-5" />
                    <span>Nội dung Bài viết</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lesson-content">Nội dung bài viết</Label>
                    <Textarea
                      id="lesson-content"
                      placeholder="Nhập nội dung bài viết ở đây... (hỗ trợ Markdown)"
                      rows={8}
                      value={lessonForm.content}
                      onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                      className="bg-white font-mono text-sm"
                    />
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Type className="w-3 h-3" />
                      Hỗ trợ Markdown và HTML. Trình soạn thảo WYSIWYG sẽ được thêm vào sau
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reading-time">Thời gian đọc ước tính (phút)</Label>
                    <Input
                      id="reading-time"
                      type="number"
                      placeholder="5"
                      value={lessonForm.readingTime}
                      onChange={(e) => setLessonForm({ 
                        ...lessonForm, 
                        readingTime: parseInt(e.target.value || 0)
                      })}
                      className="bg-white"
                    />
                  </div>
                </div>
              )}

              {lessonForm.type === 'quiz' && (
                <div className="space-y-4 p-6 bg-purple-50 border border-purple-200 rounded-lg text-center">
                  <HelpCircle className="w-12 h-12 mx-auto text-purple-400" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-900">Tính năng Quiz</h4>
                    <p className="text-sm text-purple-700">
                      Chức năng tạo quiz đang được phát triển và sẽ sớm có mặt
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Coming Soon 🚀
                    </Badge>
                  </div>
                </div>
              )}

              <Separator />

              {/* Additional Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Tùy chọn khác</Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="lesson-free"
                    checked={lessonForm.isFree}
                    onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="lesson-free" className="cursor-pointer flex-1 font-normal">
                    <div className="font-medium">Cho phép xem miễn phí</div>
                    <div className="text-xs text-gray-500">
                      Học viên có thể xem bài học này mà không cần mua khóa học
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowAddLessonDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleAddLesson} 
              disabled={!lessonForm.title || lessonForm.type === 'quiz' || createLessonMutation.isPending || addLessonToSectionMutation.isPending}
            >
              {(createLessonMutation.isPending || addLessonToSectionMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm bài học
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={showEditLessonDialog} onOpenChange={setShowEditLessonDialog}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Chỉnh sửa bài học</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-lesson-title" className="text-sm font-medium">
                    Tiêu đề bài học <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-lesson-title"
                    placeholder="Nhập tiêu đề bài học..."
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-lesson-description" className="text-sm font-medium">
                    Mô tả
                  </Label>
                  <Textarea
                    id="edit-lesson-description"
                    placeholder="Mô tả ngắn gọn về bài học..."
                    rows={3}
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                    className="text-base resize-none"
                  />
                </div>
              </div>

              <Separator />

              {/* Lesson Type Selector */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Loại bài học</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setLessonForm({ ...lessonForm, type: 'video' })}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200
                      ${lessonForm.type === 'video' 
                        ? '' 
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                      }
                    `}
                  >
                    <Video className={`w-6 h-6 mx-auto mb-2 ${
                      lessonForm.type === 'video' ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      lessonForm.type === 'video' ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      Video
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLessonForm({ ...lessonForm, type: 'article' })}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200
                      ${lessonForm.type === 'article' 
                        ? '' 
                        : 'border-gray-200 hover:border-green-300 bg-white'
                      }
                    `}
                  >
                    <BookOpen className={`w-6 h-6 mx-auto mb-2 ${
                      lessonForm.type === 'article' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      lessonForm.type === 'article' ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      Bài viết
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLessonForm({ ...lessonForm, type: 'quiz' })}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200
                      ${lessonForm.type === 'quiz' 
                        ? '' 
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                      }
                    `}
                  >
                    <HelpCircle className={`w-6 h-6 mx-auto mb-2 ${
                      lessonForm.type === 'quiz' ? 'text-purple-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      lessonForm.type === 'quiz' ? 'text-purple-700' : 'text-gray-600'
                    }`}>
                      Quiz
                    </p>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Video Content Section */}
              {lessonForm.type === 'video' && (
                <div className="space-y-4 p-4 rounded-lg border-2 ">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium text-blue-900">Nội dung Video</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-lesson-video" className="text-sm font-medium">
                      URL Video
                    </Label>
                    <Input
                      id="edit-lesson-video"
                      placeholder="https://youtube.com/watch?v=..."
                      value={lessonForm.videoUrl || ''}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-lesson-duration" className="text-sm font-medium">
                      Thời lượng video (phút)
                    </Label>
                    <Input
                      id="edit-lesson-duration"
                      type="number"
                      min="0"
                      placeholder="15"
                      value={lessonForm.videoDuration ? lessonForm.videoDuration / 60 : ''}
                      onChange={(e) => setLessonForm({ 
                        ...lessonForm, 
                        videoDuration: parseInt(e.target.value || 0) * 60 
                      })}
                      className="bg-white"
                    />
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-100 rounded-md">
                    <Film className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800">
                      Tính năng upload video sẽ được cập nhật trong phiên bản tiếp theo. Hiện tại vui lòng sử dụng URL từ YouTube, Vimeo hoặc các nền tảng video khác.
                    </p>
                  </div>
                </div>
              )}

              {/* Article Content Section */}
              {lessonForm.type === 'article' && (
                <div className="space-y-4 p-4 rounded-lg border-2">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium text-green-900">Nội dung Bài viết</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-lesson-content" className="text-sm font-medium">
                      Nội dung bài viết
                    </Label>
                    <Textarea
                      id="edit-lesson-content"
                      placeholder="Nhập nội dung bài viết (hỗ trợ Markdown)..."
                      rows={8}
                      value={lessonForm.content || ''}
                      onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                      className="bg-white resize-none font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-lesson-reading-time" className="text-sm font-medium">
                      Thời gian đọc ước tính (phút)
                    </Label>
                    <Input
                      id="edit-lesson-reading-time"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={lessonForm.readingTime || ''}
                      onChange={(e) => setLessonForm({ 
                        ...lessonForm, 
                        readingTime: parseInt(e.target.value || 0)
                      })}
                      className="bg-white"
                    />
                  </div>

                  {/* <div className="flex items-start gap-2 p-3 bg-green-100 rounded-md">
                    <Type className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-800">
                      Hỗ trợ định dạng Markdown cơ bản. Trình soạn thảo WYSIWYG sẽ được thêm vào trong phiên bản tiếp theo.
                    </p>
                  </div> */}
                </div>
              )}

              {/* Quiz Content Section */}
              {/* {lessonForm.type === 'quiz' && (
                <div className="space-y-4 p-6 rounded-lg border-2 border-purple-200 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <HelpCircle className="w-12 h-12 text-purple-400" />
                    <h4 className="font-semibold text-purple-900 text-lg">Tính năng Quiz</h4>
                    <p className="text-purple-700 text-sm max-w-md">
                      Chức năng tạo bài quiz đang được phát triển và sẽ ra mắt trong phiên bản tiếp theo.
                    </p>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                      Coming Soon 
                    </Badge>
                  </div>
                </div>
              )} */}

              <Separator />

              {/* Free Preview Option */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="edit-lesson-free"
                    checked={lessonForm.isFree}
                    onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                    className="w-4 h-4 mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <Label htmlFor="edit-lesson-free" className="cursor-pointer font-medium text-gray-900">
                      Cho phép xem miễn phí
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Học viên có thể xem bài học này mà không cần đăng ký khóa học (dùng để giới thiệu hoặc demo)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowEditLessonDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateLesson} 
              disabled={!lessonForm.title || lessonForm.type === 'quiz' || updateLessonMutation.isPending}
            >
              {updateLessonMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa {deleteTarget.type === 'section' ? 'chương' : 'bài học'}{' '}
              <span className="font-semibold">"{deleteTarget.name}"</span>?
              {deleteTarget.type === 'section' && (
                <span className="block mt-2 text-red-600">
                  Lưu ý: Tất cả bài học trong chương này cũng sẽ bị xóa.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteSectionMutation.isPending || deleteLessonMutation.isPending}
            >
              {(deleteSectionMutation.isPending || deleteLessonMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseBuilder;
