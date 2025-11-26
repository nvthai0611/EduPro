import { Users, PlayCircle, Clock } from 'lucide-react';
import { courses } from './const/data';
export default function FreeCourses() {


  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Khóa học miễn phí</h1>
          <a href="#" className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
            Xem lộ trình <span>›</span>
          </a>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              {/* Card Header with Gradient */}
              <div className={`h-48 bg-gradient-to-br ${course.gradient} flex items-center justify-center text-white p-6`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 whitespace-pre-line">{course.subtitle}</h3>
                </div>
                
              </div>
              <a href="http://"> xem chi tiet</a>

              {/* Card Body */}
              <div className="p-5">
                <h4 className="font-semibold text-gray-900 mb-2 text-base">
                  {course.title}
                </h4>
                <p className="text-orange-500 font-medium mb-4">Miễn phí</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" />
                    <span>{course.lessons}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}