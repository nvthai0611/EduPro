import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-toastify';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ArrowLeft,
  Plus,
  FileText,
  Clock,
  Eye,
  Save,
} from 'lucide-react';
import {
  useCourseBySlug,
  useAdminSectionsWithLessons,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useReorderSections,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useReorderLessons,
  useAddLessonToSection,
} from '../../../hooks/useCourseQueries';

// Component imports
import SortableSection from './components/SortableSection';
import { AddSectionDialog, EditSectionDialog } from './components/SectionDialogs';
import { AddLessonDialog, EditLessonDialog } from './components/LessonDialogs';
import DeleteDialog from './components/DeleteDialog';
import CourseInfoSidebar from './components/CourseInfoSidebar';

const CourseBuilder = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // TanStack Query hooks
  const { data: course, isLoading: courseLoading, error: courseError } = useCourseBySlug(slug, {
    onError: () => {
      toast.error('Không thể tải dữ liệu khóa học');
      navigate('/manager-courses');
    }
  });

  const courseId = course?._id;
  const { data: sections = [], isLoading: sectionsLoading } = useAdminSectionsWithLessons(courseId);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mutations
  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();
  const reorderSectionsMutation = useReorderSections();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  const reorderLessonsMutation = useReorderLessons();
  const addLessonToSectionMutation = useAddLessonToSection();

  // State management
  const [expandedSections, setExpandedSections] = useState({});

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

  // Auto-expand first section
  React.useEffect(() => {
    if (sections.length > 0 && Object.keys(expandedSections).length === 0) {
      setExpandedSections({ [sections[0]._id]: true });
    }
  }, [sections]);

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

    // Validate article content if type is article
    if (lessonForm.type === 'article') {
      if (!lessonForm.content || lessonForm.content.trim().length < 20) {
        toast.error('Nội dung bài viết phải có ít nhất 20 ký tự');
        return;
      }
    }

    // Prepare lesson data - works for both video and article types
    const lessonData = {
      courseId: courseId,
      sectionId: selectedSection._id,
      title: lessonForm.title,
      description: lessonForm.description || '',
      type: lessonForm.type,
      order: (selectedSection.lessons?.length || 0) + 1,
      isFree: lessonForm.isFree || false,
      isPublished: false,
      // Video specific fields
      ...(lessonForm.type === 'video' && {
        videoUrl: lessonForm.videoUrl || '',
        videoDuration: lessonForm.videoDuration || 0,
      }),
      // Article specific fields
      ...(lessonForm.type === 'article' && {
        content: lessonForm.content,
        readingTime: lessonForm.readingTime || 5,
      }),
    };

    // Save to Lesson collection (for both video and article)
    createLessonMutation.mutate(lessonData, {
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
              toast.success(lessonForm.type === 'article' ? 'Thêm bài viết thành công!' : 'Thêm bài học thành công!');
            }
          }
        );
      }
    });
  };

  const handleUpdateLesson = async () => {
    // Validate article content if type is article
    if (lessonForm.type === 'article') {
      if (lessonForm.content && lessonForm.content.trim().length < 20) {
        toast.error('Nội dung bài viết phải có ít nhất 20 ký tự');
        return;
      }
    }

    // Prepare lesson update data - works for both video and article types
    const lessonData = {
      title: lessonForm.title,
      description: lessonForm.description || '',
      type: lessonForm.type,
      isFree: lessonForm.isFree || false,
      // Video specific fields
      ...(lessonForm.type === 'video' && {
        videoUrl: lessonForm.videoUrl || '',
        videoDuration: lessonForm.videoDuration || 0,
      }),
      // Article specific fields
      ...(lessonForm.type === 'article' && {
        content: lessonForm.content,
        readingTime: lessonForm.readingTime || 5,
      }),
    };

    // Remove undefined/empty fields
    Object.keys(lessonData).forEach(key => {
      if (lessonData[key] === undefined || lessonData[key] === '') {
        delete lessonData[key];
      }
    });

    // Update lesson in Lesson collection (for both video and article)
    updateLessonMutation.mutate(
      {
        id: selectedLesson._id,
        data: lessonData
      },
      {
        onSuccess: () => {
          setShowEditLessonDialog(false);
          setSelectedLesson(null);
          toast.success(lessonForm.type === 'article' ? 'Cập nhật bài viết thành công!' : 'Cập nhật bài học thành công!');
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
      // Find the lesson's parent section
      let foundSection = null;
      sections.find(section => {
        const found = (section.lessons || []).find(l => l._id === deleteTarget.id);
        if (found) {
          foundSection = section;
          return true;
        }
        return false;
      });
        
      // Delete from Lesson collection first (new articles and videos)
      // If not found, it will try Articles collection (old articles) via backend
      deleteLessonMutation.mutate(
        {
          id: deleteTarget.id,
          courseId: courseId,
          sectionId: foundSection?._id
        },
        { onSuccess: resetDeleteState }
      );
    }
  }, [deleteTarget, courseId, sections, deleteSectionMutation, deleteLessonMutation]);

  // Toggle section expand/collapse
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
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

  // Reorder handlers
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sections.findIndex((s) => s._id === active.id);
    const newIndex = sections.findIndex((s) => s._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Reorder sections locally for optimistic UI
    const newSections = arrayMove(sections, oldIndex, newIndex);
    const sectionIds = newSections.map((s) => s._id);

    // Call mutation to save the new order
    reorderSectionsMutation.mutate({
      courseId: courseId,
      sectionIds: sectionIds,
    });
  };


  // Calculate statistics
  const totalSections = sections.length;
  const totalLessons = sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0);
  const totalDuration = sections.reduce((acc, section) => {
    return acc + (section.lessons?.reduce((sum, l) => sum + (l.videoDuration || 0), 0) || 0);
  }, 0);

  // Helper function to format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0 phút';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const handleLessonDragEnd = (event, sectionId) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const section = sections.find(s => s._id === sectionId);
    if (!section || !section.lessons) return;

    const oldIndex = section.lessons.findIndex((l) => l._id === active.id);
    const newIndex = section.lessons.findIndex((l) => l._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Reorder lessons locally for optimistic UI
    const newLessons = arrayMove(section.lessons, oldIndex, newIndex);
    const lessonIds = newLessons.map((l) => l._id);

    // Call mutation to save the new order
    reorderLessonsMutation.mutate({
      sectionId: sectionId,
      lessonIds: lessonIds,
      courseId: courseId,
    });
  };

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
                onClick={() => navigate('/manager-courses')}
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
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sections.map((s) => s._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="divide-y">
                        {sections.map((section, sectionIndex) => (
                          <SortableSection
                            key={section._id}
                            section={section}
                            sectionIndex={sectionIndex}
                            expandedSections={expandedSections}
                            toggleSection={toggleSection}
                            openEditSection={openEditSection}
                            openDeleteDialog={openDeleteDialog}
                            openAddLesson={openAddLesson}
                            openEditLesson={openEditLesson}
                            formatDuration={formatDuration}
                            handleLessonDragEnd={handleLessonDragEnd}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Course Info & Stats */}
          <div className="lg:col-span-1">
            <CourseInfoSidebar
              course={course}
              totalSections={totalSections}
              totalLessons={totalLessons}
              totalDuration={totalDuration}
              formatDuration={formatDuration}
              onAddSection={() => setShowAddSectionDialog(true)}
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddSectionDialog
        open={showAddSectionDialog}
        onOpenChange={setShowAddSectionDialog}
        sectionForm={sectionForm}
        setSectionForm={setSectionForm}
        handleAddSection={handleAddSection}
        isLoading={createSectionMutation.isPending}
      />

      <EditSectionDialog
        open={showEditSectionDialog}
        onOpenChange={setShowEditSectionDialog}
        sectionForm={sectionForm}
        setSectionForm={setSectionForm}
        handleUpdateSection={handleUpdateSection}
        isLoading={updateSectionMutation.isPending}
      />

      <AddLessonDialog
        open={showAddLessonDialog}
        onOpenChange={setShowAddLessonDialog}
        selectedSection={selectedSection}
        lessonForm={lessonForm}
        setLessonForm={setLessonForm}
        handleAddLesson={handleAddLesson}
        isLoading={createLessonMutation.isPending || addLessonToSectionMutation.isPending}
      />

      <EditLessonDialog
        open={showEditLessonDialog}
        onOpenChange={setShowEditLessonDialog}
        lessonForm={lessonForm}
        setLessonForm={setLessonForm}
        handleUpdateLesson={handleUpdateLesson}
        isLoading={updateLessonMutation.isPending}
      />

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        deleteTarget={deleteTarget}
        handleDelete={handleDelete}
        isLoading={deleteSectionMutation.isPending || deleteLessonMutation.isPending}
      />
    </div>
  );
};

export default CourseBuilder;