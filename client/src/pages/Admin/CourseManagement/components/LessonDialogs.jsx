import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Video,
  BookOpen,
  HelpCircle,
  Film,
  Plus,
  Loader2,
} from 'lucide-react';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet',
  'link', 'image'
];

export const AddLessonDialog = ({ 
  open, 
  onOpenChange, 
  selectedSection,
  lessonForm, 
  setLessonForm, 
  handleAddLesson, 
  isLoading 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  className={`p-4 border-2 rounded-lg transition-all ${lessonForm.type === 'video'
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <Video className={`w-6 h-6 mx-auto mb-2 ${lessonForm.type === 'video' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-sm font-medium text-center">Video</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLessonForm({ ...lessonForm, type: 'article' })}
                  className={`p-4 border-2 rounded-lg transition-all ${lessonForm.type === 'article'
                    ? 'border-green-500 bg-green-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <BookOpen className={`w-6 h-6 mx-auto mb-2 ${lessonForm.type === 'article' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="text-sm font-medium text-center">Bài viết</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLessonForm({ ...lessonForm, type: 'quiz' })}
                  className={`p-4 border-2 rounded-lg transition-all ${lessonForm.type === 'quiz'
                    ? 'border-purple-500 bg-purple-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <HelpCircle className={`w-6 h-6 mx-auto mb-2 ${lessonForm.type === 'quiz' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className="text-sm font-medium text-center">Quiz</div>
                </button>
              </div>
            </div>

            {/* Video Content */}
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

            {/* Article Content */}
            {lessonForm.type === 'article' && (
              <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <BookOpen className="w-5 h-5" />
                  <span>Nội dung Bài viết</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lesson-content" className="text-sm font-medium">Nội dung bài viết</Label>
                  <div className="bg-white rounded border border-gray-300 quill-editor">
                    <ReactQuill
                      value={lessonForm.content}
                      onChange={(content) => setLessonForm({ ...lessonForm, content })}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Nhập nội dung bài viết ở đây..."
                      theme="snow"
                    />
                  </div>
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

            {/* Quiz Content */}
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

            {/* Free Preview Option */}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleAddLesson}
            disabled={!lessonForm.title || lessonForm.type === 'quiz' || isLoading}
          >
            {isLoading ? (
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
  );
};

export const EditLessonDialog = ({ 
  open, 
  onOpenChange, 
  lessonForm, 
  setLessonForm, 
  handleUpdateLesson, 
  isLoading 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    lessonForm.type === 'video'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <Video className={`w-6 h-6 mx-auto mb-2 ${lessonForm.type === 'video' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${lessonForm.type === 'video' ? 'text-blue-700' : 'text-gray-600'}`}>
                    Video
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLessonForm({ ...lessonForm, type: 'article' })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    lessonForm.type === 'article'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                >
                  <BookOpen className={`w-6 h-6 mx-auto mb-2 ${lessonForm.type === 'article' ? 'text-green-500' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${lessonForm.type === 'article' ? 'text-green-700' : 'text-gray-600'}`}>
                    Bài viết
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLessonForm({ ...lessonForm, type: 'quiz' })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    lessonForm.type === 'quiz'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  <HelpCircle className={`w-6 h-6 mx-auto mb-2 ${lessonForm.type === 'quiz' ? 'text-purple-500' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${lessonForm.type === 'quiz' ? 'text-purple-700' : 'text-gray-600'}`}>
                    Quiz
                  </p>
                </button>
              </div>
            </div>

            <Separator />

            {/* Video Content */}
            {lessonForm.type === 'video' && (
              <div className="space-y-4 p-4 rounded-lg border-2 border-blue-200">
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

            {/* Article Content */}
            {lessonForm.type === 'article' && (
              <div className="space-y-4 p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <h4 className="font-medium text-green-900">Nội dung Bài viết</h4>
                </div>

                <div className="space-y-2">
                  <ReactQuill
                    value={lessonForm.content || ''}
                    onChange={(content) => setLessonForm({ ...lessonForm, content })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Nhập nội dung bài viết ở đây..."
                    theme="snow"
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
              </div>
            )}

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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleUpdateLesson}
            disabled={!lessonForm.title || lessonForm.type === 'quiz' || isLoading}
          >
            {isLoading ? (
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
  );
};
