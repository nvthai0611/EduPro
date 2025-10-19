import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Users, 
  BookOpen, 
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  Play,
  Calendar,
  BarChart3
} from 'lucide-react';
import { progressService } from '../../../services/progressService';

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [progressFilter, setProgressFilter] = useState('');

  useEffect(() => {
    fetchStudentProgress();
  }, [searchTerm, courseFilter, progressFilter]);

  const fetchStudentProgress = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real app, this would be an admin API
      const mockData = [
        {
          _id: '1',
          user: {
            _id: 'u1',
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            image: 'https://via.placeholder.com/40x40'
          },
          course: {
            _id: 'c1',
            title: 'React từ cơ bản đến nâng cao',
            thumbnail: 'https://via.placeholder.com/60x40'
          },
          progress: 75,
          completedLessons: 15,
          totalLessons: 20,
          enrolledAt: '2024-01-15',
          lastActivity: '2024-01-20',
          certificate: {
            issued: false
          }
        },
        {
          _id: '2',
          user: {
            _id: 'u2',
            fullName: 'Trần Thị B',
            email: 'tranthib@email.com',
            image: 'https://via.placeholder.com/40x40'
          },
          course: {
            _id: 'c2',
            title: 'Node.js Backend Development',
            thumbnail: 'https://via.placeholder.com/60x40'
          },
          progress: 100,
          completedLessons: 25,
          totalLessons: 25,
          enrolledAt: '2024-01-10',
          lastActivity: '2024-01-22',
          certificate: {
            issued: true,
            issuedAt: '2024-01-22'
          }
        },
        {
          _id: '3',
          user: {
            _id: 'u3',
            fullName: 'Lê Văn C',
            email: 'levanc@email.com',
            image: 'https://via.placeholder.com/40x40'
          },
          course: {
            _id: 'c3',
            title: 'JavaScript Fundamentals',
            thumbnail: 'https://via.placeholder.com/60x40'
          },
          progress: 30,
          completedLessons: 6,
          totalLessons: 20,
          enrolledAt: '2024-01-18',
          lastActivity: '2024-01-19',
          certificate: {
            issued: false
          }
        }
      ];
      
      setStudents(mockData);
    } catch (error) {
      console.error('Error fetching student progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressText = (progress) => {
    if (progress === 0) return 'Chưa bắt đầu';
    if (progress < 30) return 'Mới bắt đầu';
    if (progress < 70) return 'Đang tiến bộ';
    if (progress < 100) return 'Gần hoàn thành';
    return 'Đã hoàn thành';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return '1 ngày trước';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    return `${Math.floor(diffInDays / 30)} tháng trước`;
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !courseFilter || student.course._id === courseFilter;
    const matchesProgress = !progressFilter || (
      progressFilter === 'completed' ? student.progress === 100 :
      progressFilter === 'in-progress' ? student.progress > 0 && student.progress < 100 :
      progressFilter === 'not-started' ? student.progress === 0 : true
    );
    
    return matchesSearch && matchesCourse && matchesProgress;
  });

  const stats = {
    totalStudents: students.length,
    completedCourses: students.filter(s => s.progress === 100).length,
    inProgressCourses: students.filter(s => s.progress > 0 && s.progress < 100).length,
    certificatesIssued: students.filter(s => s.certificate.issued).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tiến độ học viên</h1>
          <p className="text-gray-600 mt-2">Theo dõi tiến độ học tập của học viên</p>
        </div>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang học</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chứng chỉ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificatesIssued}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm học viên hoặc khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Khóa học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả khóa học</SelectItem>
                <SelectItem value="c1">React từ cơ bản đến nâng cao</SelectItem>
                <SelectItem value="c2">Node.js Backend Development</SelectItem>
                <SelectItem value="c3">JavaScript Fundamentals</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={progressFilter} onValueChange={setProgressFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tiến độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả tiến độ</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
                <SelectItem value="in-progress">Đang học</SelectItem>
                <SelectItem value="not-started">Chưa bắt đầu</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setCourseFilter('');
              setProgressFilter('');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Progress Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Danh sách tiến độ học viên</h3>
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
                    <th className="text-left p-4">Học viên</th>
                    <th className="text-left p-4">Khóa học</th>
                    <th className="text-left p-4">Tiến độ</th>
                    <th className="text-left p-4">Bài học</th>
                    <th className="text-left p-4">Đăng ký</th>
                    <th className="text-left p-4">Hoạt động cuối</th>
                    <th className="text-left p-4">Chứng chỉ</th>
                    <th className="text-left p-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={student.user.image}
                            alt={student.user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{student.user.fullName}</h4>
                            <p className="text-sm text-gray-600">{student.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={student.course.thumbnail}
                            alt={student.course.title}
                            className="w-15 h-10 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{student.course.title}</h4>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{student.progress}%</span>
                            <span className="text-gray-500">{getProgressText(student.progress)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(student.progress)}`}
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <span className="font-medium text-green-600">{student.completedLessons}</span>
                          <span className="text-gray-500"> / {student.totalLessons}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(student.enrolledAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          {getTimeAgo(student.lastActivity)}
                        </div>
                      </td>
                      <td className="p-4">
                        {student.certificate.issued ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Award className="w-3 h-3 mr-1" />
                            Đã cấp
                          </Badge>
                        ) : student.progress === 100 ? (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Sẵn sàng cấp
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Chưa đủ điều kiện
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/learn/${student.course._id}`, '_blank')}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // View detailed progress
                              console.log('View detailed progress for:', student._id);
                            }}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          {student.progress === 100 && !student.certificate.issued && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => {
                                // Issue certificate
                                console.log('Issue certificate for:', student._id);
                              }}
                            >
                              <Award className="w-4 h-4" />
                            </Button>
                          )}
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
    </div>
  );
};

export default StudentProgress;
