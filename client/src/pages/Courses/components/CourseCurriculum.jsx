import { ChevronDown, ChevronUp, Video, Loader2 } from "lucide-react";

const CourseCurriculum = ({
  sections,
  sectionsLoading,
  expandedSections,
  toggleSection,
  formatLessonDuration,
}) => {
  if (sectionsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chưa có nội dung khóa học</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div key={section._id} className="border rounded-lg overflow-hidden">
          {/* Section Header */}
          <button
            onClick={() => toggleSection(section._id)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {expandedSections[section._id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">
                  Chương {index + 1}: {section.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {section.lessons?.filter(l => l.type === "video").length || 0} video
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {formatLessonDuration(
                section.lessons?.filter(l => l.type === "video").reduce(
                  (sum, lesson) =>
                    sum + (lesson.videoDuration || 0),
                  0
                ) || 0
              )}
            </div>
          </button>

          {/* Lessons List */}
          {expandedSections[section._id] && (
            <div className="divide-y">
              {section.lessons && section.lessons.filter(l => l.type === "video").length > 0 ? (
                section.lessons.filter(l => l.type === "video").map((lesson, lessonIndex) => (
                  <div
                    key={lesson._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Video className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {lessonIndex + 1}. {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Video
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatLessonDuration(
                        lesson.videoDuration || lesson.readingTime * 60 || 0
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Chương này chưa có video
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseCurriculum;
