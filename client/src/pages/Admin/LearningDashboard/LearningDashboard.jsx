import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Award,
  Play,
  Star,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const LearningPlatformDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalLessons: 0,
    completionRate: 0,
    averageRating: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from admin API
      const mockStats = {
        totalCourses: 25,
        totalStudents: 1250,
        totalRevenue: 125000000,
        totalLessons: 450,
        completionRate: 78,
        averageRating: 4.8
      };
      
      const mockRecentOrders = [
        {
          _id: '1',
          user: { fullName: 'Nguyễn Văn A', email: 'nguyenvana@email.com' },
          course: { title: 'React từ cơ bản đến nâng cao' },
          total: 299000,
          createdAt: '2024-01-22T10:30:00Z',
          status: 'completed'
        },
        {
          _id: '2',
          user: { fullName: 'Trần Thị B', email: 'tranthib@email.com' },
          course: { title: 'Node.js Backend Development' },
          total: 399000,
          createdAt: '2024-01-22T09:15:00Z',
          status: 'completed'
        },
        {
          _id: '3',
          user: { fullName: 'Lê Văn C', email: 'levanc@email.com' },
          course: { title: 'JavaScript Fundamentals' },
          total: 0,
          createdAt: '2024-01-22T08:45:00Z',
          status: 'completed'
        }
      ];

      const mockPopularCourses = [
        {
          _id: '1',
          title: 'React từ cơ bản đến nâng cao',
          thumbnail: 'https://via.placeholder.com/60x40',
          totalStudents: 450,
          rating: 4.9,
          price: 299000
        },
        {
          _id: '2',
          title: 'Node.js Backend Development',
          thumbnail: 'https://via.placeholder.com/60x40',
          totalStudents: 320,
          rating: 4.8,
          price: 399000
        },
        {
          _id: '3',
          title: 'JavaScript Fundamentals',
          thumbnail: 'https://via.placeholder.com/60x40',
          totalStudents: 280,
          rating: 4.7,
          price: 0
        }
      ];

      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setPopularCourses(mockPopularCourses);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return `${Math.floor(diffInHours / 24)} ngày trước`;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Tổng quan về nền tảng học tập</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Chọn khoảng thời gian
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Khóa học</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-xs text-green-600">+12% so với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Học viên</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
                <p className="text-xs text-green-600">+8% so với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-xs text-green-600">+15% so với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bài học</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
                <p className="text-xs text-green-600">+5% so với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                <p className="text-xs text-green-600">+3% so với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                <p className="text-xs text-green-600">+0.1 so với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Doanh thu theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Biểu đồ doanh thu</p>
                <p className="text-sm text-gray-400">Sẽ được tích hợp với Chart.js</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-600" />
              Phân bố khóa học theo danh mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Biểu đồ tròn</p>
                <p className="text-sm text-gray-400">Sẽ được tích hợp với Chart.js</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Đơn hàng gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{order.user.fullName}</h4>
                      <p className="text-sm text-gray-600">{order.course.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                    <p className="text-sm text-gray-500">{getTimeAgo(order.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Xem tất cả đơn hàng
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Khóa học phổ biến
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularCourses.map((course, index) => (
                <div key={course._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{course.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{course.totalStudents}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(course.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Xem tất cả khóa học
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BookOpen className="w-6 h-6 mb-2" />
              <span>Tạo khóa học</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="w-6 h-6 mb-2" />
              <span>Quản lý học viên</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Award className="w-6 h-6 mb-2" />
              <span>Cấp chứng chỉ</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BarChart3 className="w-6 h-6 mb-2" />
              <span>Báo cáo chi tiết</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPlatformDashboard;
