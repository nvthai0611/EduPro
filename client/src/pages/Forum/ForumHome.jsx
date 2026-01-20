import { useState } from "react";
import { Loader2 } from "lucide-react";
import PostCard from "./components/PostCard";
import Sidebar from "./components/Sidebar";
import WritePostButton from "./components/WritePostButton";
import SideBar from "../Home/components/SideBar";
import { useGetAllPosts } from "../../hooks/usePost";
import { Link } from "react-router-dom";

const ForumHome = () => {
  const [page, setPage] = useState(1);
  const { data: posts = [], isLoading } = useGetAllPosts();

  // Get trending posts (top 5)
  const trendingPosts = posts.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Header Spacer */}
      <div className="h-[4rem] mt-4" />
      <div className="hidden lg:block lg:w-30 flex-shrink-0 p-4">
        <SideBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[4rem] w-full">
        {/* Featured Posts Carousel */}
        <div className="bg-white rounded-lg mb-8 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 inline-block mr-4">Bài viết nổi bật trong tháng</h2>
          {/* Xem thêm button */}
          <p className="mb-4 text-gray-600 font-light inline-block text-sm"><a href="/top-4">Xem thêm</a></p>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {trendingPosts.map((post) => (
                <div key={post.slug} className="flex-shrink-0 w-64 bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                 
                  <Link
                         to={`/posts/${post.slug || post._id}`}
                         
                       > <img
                    src={post.coverImageUrl || "https://via.placeholder.com/256x144"}
                    alt={post.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[3rem] leading-tight">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author?.avatar || "https://i.pravatar.cc/32"}
                        alt={post.authorName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-600">{post.authorName || "Anonymous"}</span>
                    </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
            {/* Carousel Navigation (optional, can add buttons if needed) */}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <main className="lg:col-span-8">
            <div className="grid p-4 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Đang tải...</span>
              </div>
            )}

            {!isLoading && posts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có bài viết nào
                </h3>
                <p className="text-gray-500 text-sm">
                  Hãy là người đầu tiên chia sẻ điều gì đó thú vị!
                </p>
              </div>
            )}
          </main>
          <aside className="lg:col-span-4">
            <Sidebar trendingPosts={trendingPosts} />
          </aside>
        </div>
      </div>
      <WritePostButton />
    </div>
  );
};
export default ForumHome;
