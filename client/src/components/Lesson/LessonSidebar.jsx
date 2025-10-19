import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  CheckCircle, 
  Lock,
  Clock,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '../../lib/utils';

const LessonSidebar = ({ 
  modules = [], 
  currentLessonId, 
  onLessonSelect,
  userProgress = {},
  className = "" 
}) => {
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const isLessonCompleted = (lessonId) => {
    return userProgress.completedLessons?.includes(lessonId) || false;
  };

  const isLessonLocked = (lesson, moduleIndex, lessonIndex) => {
    // First lesson of first module is always unlocked
    if (moduleIndex === 0 && lessonIndex === 0) return false;
    
    // If previous lesson is not completed, this lesson is locked
    if (moduleIndex === 0 && lessonIndex > 0) {
      const prevLesson = modules[0]?.lessons[lessonIndex - 1];
      return !isLessonCompleted(prevLesson?._id);
    }
    
    // If previous module is not completed, this module's lessons are locked
    if (moduleIndex > 0) {
      const prevModule = modules[moduleIndex - 1];
      const lastLessonOfPrevModule = prevModule?.lessons[prevModule.lessons.length - 1];
      return !isLessonCompleted(lastLessonOfPrevModule?._id);
    }
    
    return false;
  };

  const getLessonIcon = (lesson, isLocked, isCompleted) => {
    if (isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
    
    if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    return <Play className="w-4 h-4 text-blue-500" />;
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className={cn("bg-white border-r border-gray-200 h-full overflow-y-auto", className)}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Nội dung khóa học
        </h3>
        
        <div className="space-y-2">
          {modules.map((module, moduleIndex) => {
            const isExpanded = expandedModules[module._id] ?? true;
            const moduleProgress = module.lessons?.filter(lesson => 
              isLessonCompleted(lesson._id)
            ).length || 0;
            const totalLessons = module.lessons?.length || 0;
            
            return (
              <div key={module._id} className="border border-gray-200 rounded-lg">
                {/* Module Header */}
                <div 
                  className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleModule(module._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <h4 className="font-medium text-gray-900">
                        {module.title}
                      </h4>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {moduleProgress}/{totalLessons}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-6">
                    {module.description}
                  </p>
                </div>

                {/* Module Lessons */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {module.lessons?.map((lesson, lessonIndex) => {
                      const isLocked = isLessonLocked(lesson, moduleIndex, lessonIndex);
                      const isCompleted = isLessonCompleted(lesson._id);
                      const isCurrent = lesson._id === currentLessonId;
                      
                      return (
                        <div
                          key={lesson._id}
                          className={cn(
                            "p-3 border-b border-gray-50 last:border-b-0 cursor-pointer transition-colors",
                            isCurrent && "bg-blue-50 border-l-4 border-l-blue-500",
                            !isLocked && "hover:bg-gray-50",
                            isLocked && "opacity-60"
                          )}
                          onClick={() => !isLocked && onLessonSelect?.(lesson)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getLessonIcon(lesson, isLocked, isCompleted)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h5 className={cn(
                                  "text-sm font-medium",
                                  isCurrent ? "text-blue-600" : "text-gray-900",
                                  isLocked && "text-gray-500"
                                )}>
                                  {lesson.title}
                                </h5>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDuration(lesson.duration)}
                                  </div>
                                  {lesson.type === 'quiz' && (
                                    <div className="flex items-center gap-1">
                                      <FileText className="w-3 h-3" />
                                      Quiz
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {lesson.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {lesson.description}
                                </p>
                              )}
                              
                              {lesson.isFree && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  Miễn phí
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LessonSidebar;