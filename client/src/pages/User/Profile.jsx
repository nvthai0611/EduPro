import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUserProfile } from "../../services/user/userService";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "../../components/Profile/ProfileCard";
import TabNavigation from "../../components/Profile/TabNavigation";
import PostCard from "../Forum/components/PostCard";
import { useMyPosts } from "../../hooks/usePost";
// import MyPosts from "../Forum/MyPosts";

const Profile = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");

  const { data: infoUser } = useQuery({
    queryKey: ["user-profile", user?.userId],
    queryFn: async () => {
      const res = await getUserProfile(user?.userId || null);
      return res.data;
    },
    enabled: !!user,
  });
  
  const {
    data: posts = [],
    isLoading: isPostsLoading,
    error,
  } = useMyPosts({
    enabled: !isAuthLoading && !!user,
  });
  // Render content dựa trên active tab
  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        if (isPostsLoading) {
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-500">Đang tải...</p>
            </div>
          );
        }
        if (error) {
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-red-500">Có lỗi xảy ra khi tải bài viết</p>
            </div>
          );
        }
        if (!posts || posts.length === 0) {
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-500">Chưa có bài viết nào</p>
            </div>
          );
        }
        return (
          <div className="grid p-4 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} canEdit={true} />
            ))}
          </div>
        );

      case "saved":
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProfileCard user={infoUser}  />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content Area */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
