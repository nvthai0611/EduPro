import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import SortableLesson from './SortableLesson';

const SortableSection = ({ 
  section, 
  sectionIndex, 
  expandedSections, 
  toggleSection, 
  openEditSection, 
  openDeleteDialog, 
  openAddLesson, 
  openEditLesson, 
  formatDuration, 
  handleLessonDragEnd 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const lessonSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div ref={setNodeRef} style={style} className="bg-white">
      {/* Section Header */}
      <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
        <button
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
          title="Kéo để sắp xếp"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={() => toggleSection(section._id)}
          className="flex-1 flex items-center gap-3 text-left"
        >
          {expandedSections[section._id] ? (
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
      {expandedSections[section._id] && (
        <div className="bg-gray-50 border-t">
          {section.lessons && section.lessons.length > 0 ? (
            <DndContext
              sensors={lessonSensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleLessonDragEnd(event, section._id)}
            >
              <SortableContext
                items={section.lessons.map((l) => l._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="divide-y divide-gray-200">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <SortableLesson
                      key={lesson._id}
                      lesson={lesson}
                      lessonIndex={lessonIndex}
                      section={section}
                      openEditLesson={openEditLesson}
                      openDeleteDialog={openDeleteDialog}
                      formatDuration={formatDuration}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
  );
};

export default SortableSection;
