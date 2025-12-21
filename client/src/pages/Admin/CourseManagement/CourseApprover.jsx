import { Card, CardContent, CardHeader } from '@/components/ui/card';
import  { useEffect, useState } from 'react'
import { courseService } from '../../../services/admin/courseService';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import ApproveRejectModal from '../../../components/Course/ApproveRejectModal';

const CourseApprover = () => {
     const [courses, setCourses] = useState([]);
      const [loading, setLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState('');
      const [statusFilter, setStatusFilter] = useState('all');
      const [levelFilter, setLevelFilter] = useState('all');
      const [showApproveModal, setShowApproveModal] = useState(false);
      const [showRejectModal, setShowRejectModal] = useState(false);
      const [selectedCourse, setSelectedCourse] = useState(null);
    
      useEffect(() => {
        fetchCourses();
      }, [searchTerm, statusFilter, levelFilter]);
    
      const fetchCourses = async () => {
        try {
          setLoading(true);
    
          const response = await courseService.getCourses({
            search: searchTerm,
            status: "pending",
            level: levelFilter === 'all' ? '' : levelFilter,
          });
    
          // Backend returns { success: true, data: [...] }
          // But if response is already an array, use it directly
          let coursesData;
          if (Array.isArray(response)) {
            coursesData = response;
          } else if (response?.data) {
            coursesData = Array.isArray(response.data) ? response.data : [];
          } else {
            coursesData = [];
          }
          
          setCourses(coursesData);
        } catch (error) {
          console.error('Error fetching courses:', error);
          setCourses([]);
        } finally {
          setLoading(false);
        }
      };
      
      const handleApprove = async (adminNote) => {
        try {
          await courseService.reviewCourse(selectedCourse._id, 'approve', adminNote);
          toast.success('Đã phê duyệt khóa học thành công!');
          setShowApproveModal(false);
          setSelectedCourse(null);
          await fetchCourses();
        } catch (error) {
          console.error('Error approving course:', error);
          toast.error(error.response?.data?.message || 'Không thể phê duyệt khóa học');
          throw error;
        }
      };

      const handleReject = async (adminNote) => {
        try {
          await courseService.reviewCourse(selectedCourse._id, 'reject', adminNote);
          toast.success('Đã từ chối khóa học!');
          setShowRejectModal(false);
          setSelectedCourse(null);
          await fetchCourses();
        } catch (error) {
          console.error('Error rejecting course:', error);
          toast.error(error.response?.data?.message || 'Không thể từ chối khóa học');
          throw error;
        }
      };
      
      //soft delete
      //isDeleted = true;
   
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Duyệt khóa học</h1>
        <p className="text-gray-600 mt-2">Danh sách khóa học đang chờ phê duyệt</p>
      </div>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Khóa học chờ duyệt</h3>
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
                    <th className="text-left p-4">Giảng viên</th>
                    <th className="text-left p-4">Ngày gửi</th>
                    <th className="text-left p-4">Lý do</th>
                    <th className="text-left p-4">Trạng thái</th>
                    <th className="text-left p-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.filter(course => course && course._id).map(course => (
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
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {course?.instructorId?.fullName || course?.instructorName || 'N/A'}
                          </div>
                          <div className="text-gray-500">
                            {course?.instructorId?.email || ''}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {course?.submittedAt ? new Date(course.submittedAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-700 line-clamp-2" title={course?.approvalMessage}>
                            {course?.approvalMessage || 'No message'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Đang chờ duyệt
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/courses/${course?.slug}`, '_blank')}
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowApproveModal(true);
                            }}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Phê duyệt"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowRejectModal(true);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Từ chối"
                          >
                            <XCircle className="w-4 h-4" />
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

      {/* Approve Modal */}
      <ApproveRejectModal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleApprove}
        courseTitle={selectedCourse?.title}
        action="approve"
        submittedMessage={selectedCourse?.approvalMessage}
      />

      {/* Reject Modal */}
      <ApproveRejectModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleReject}
        courseTitle={selectedCourse?.title}
        action="reject"
        submittedMessage={selectedCourse?.approvalMessage}
      />
    </div>
  )
}

export default CourseApprover