import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GripVertical,
  Play,
  FileText,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

const SortableLesson = ({ lesson, lessonIndex, section, openEditLesson, openDeleteDialog, formatDuration }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 pl-16 hover:bg-white transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
        title="Kéo để sắp xếp"
      >
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
          <span>{lesson.videoDuration ? formatDuration(lesson.videoDuration) : lesson.readingTime + "m"}</span>
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
  );
};

export default SortableLesson;
