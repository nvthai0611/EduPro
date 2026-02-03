import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile } from '../../services/user/userService';
import { useQuery } from '@tanstack/react-query';
import ProfileCard from '../../components/Profile/ProfileCard';
import TabNavigation from '../../components/Profile/TabNavigation';
import PostCard from '../../components/Profile/PostCard';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');

  const { data: infoUser } = useQuery({
    queryKey: ["user-profile", user?.userId],
    queryFn: async () => {
      const res = await getUserProfile(user?.userId || null);
      return res.data;
    },
    enabled: !!user,
  });

  // Mock data cho demo
  const mockStats = {
    followers: 1234,
    following: 567,
    posts: 89,
  };

  const mockPosts = [
    {
      id: 1,
      title: 'Kinh nghiệm học lập trình web từ con số 0',
      description: 'Chia sẻ hành trình từ một người không biết gì về lập trình đến khi trở thành Full-stack Developer...',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      author: {
        name: infoUser?.fullName || 'User',
        image: infoUser?.image,
      },
      views: 1520,
      comments: 45,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: 8,
    },
    {
      id: 2,
      title: 'Top 10 VS Code Extensions cho Developer năm 2026',
      description: 'Những extension không thể thiếu giúp tăng năng suất làm việc gấp 10 lần...',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      author: {
        name: infoUser?.fullName || 'User',
        image: infoUser?.image,
      },
      views: 2340,
      comments: 67,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: 6,
    },
    {
      id: 3,
      title: 'React 19 - Những tính năng mới đáng chú ý',
      description: 'Tổng hợp các tính năng mới trong React 19 và cách áp dụng vào dự án thực tế...',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      author: {
        name: infoUser?.fullName || 'User',
        image: infoUser?.image,
      },
      views: 3450,
      comments: 123,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: 12,
    },
  ];

  // Render content dựa trên active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="space-y-4">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        );
      case 'series':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">Chưa có series nào</p>
          </div>
        );
      case 'saved':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">Chưa có bài viết đã lưu</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProfileCard user={infoUser} stats={mockStats} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <TabNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />

            {/* Content Area */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;